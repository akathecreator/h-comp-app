import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useState } from "react";
import { useGlobalContext } from "@/lib/global-provider";
import useMealSuggestions from "@/hooks/useMealSuggestions";
import { Feather } from "@expo/vector-icons";
import { db } from "@/lib/firebase"; // your Firestore instance
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";

const MealSuggestions = ({ date }: { date: Date }) => {
  const { user } = useGlobalContext();
  if (!user) return null;
  const { mealSuggestions, loading } = useMealSuggestions(user.uid, date);
  const [likedMeals, setLikedMeals] = useState<
    Record<string, "like" | "dislike" | undefined>
  >({});

  const typeOrder = ["breakfast", "lunch", "dinner"];
  const sortedSuggestions = [...mealSuggestions].sort((a, b) => {
    return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
  });

  const toggleReaction = async (mealId: string, type: "like" | "dislike") => {
    const uid = user?.uid;
    if (!uid) return;

    setLikedMeals((prev: Record<string, "like" | "dislike" | undefined>) => ({
      ...prev,
      [mealId]: prev[mealId] === type ? undefined : type,
    }));

    const ref = doc(db, "users", uid, "meal_feedback", mealId);

    if (likedMeals[mealId] === type) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, {
        mealId,
        reaction: type,
        timestamp: new Date(),
      });
    }
  };
  const handleHideMeal = async (mealId: string) => {
    const uid = user?.uid;
    if (!uid) return;

    try {
      const ref = doc(db, "meal_suggestions", mealId); // Assuming meal_suggestions is global
      await updateDoc(ref, {
        status: "hide",
        hidden_by: uid,
        hidden_at: new Date(),
      });

      // Optional: also store as disliked
      await setDoc(doc(db, "users", uid, "meal_feedback", mealId), {
        mealId,
        reaction: "dislike",
        timestamp: new Date(),
      });

      // Hide locally
      // setHiddenMeals((prev: Record<string, boolean>) => ({
      //   ...prev,
      //   [mealId]: true,
      // }));
    } catch (e) {
      console.error("Failed to hide meal:", e);
    }
  };
  return (
    <View className="mt-3 px-6">
      <Text className="text-lg font-bold text-black mb-2">
        Meal Suggestions
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="gap-2 p-2"
      >
        {sortedSuggestions.map((meal: any) => {
          const liked = likedMeals[meal.id] === "like";
          const disliked = likedMeals[meal.id] === "dislike";

          return (
            <View key={meal.id} className="mr-4 my-3">
              <TouchableOpacity
                onPress={() => handleHideMeal(meal.id)}
                className="absolute top-1 right-1 z-10 p-1 shadow"
              >
                <Text className="text-gray-400 text-xs">✖️</Text>
              </TouchableOpacity>
              <View
                className={`flex-1 p-4 bg-white rounded-lg shadow w-[240px] h-[180px] ${
                  disliked ? "opacity-40" : ""
                }`}
              >
                <View className="flex-1">
                  <Text className="font-bold text-md text-black mb-1">
                    {meal.title}
                  </Text>
                  <Text className="font-semibold text-sm text-newblue mb-1">
                    {meal.type[0].toUpperCase() + meal.type.slice(1)}
                  </Text>
                  <Text className="text-gray-600 text-xs mb-2">
                    {meal.ingredients.join(", ")}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mt-auto pt-2 border-t border-gray-200">
                  <TouchableOpacity
                    onPress={() => toggleReaction(meal.id, "like")}
                  >
                    <Feather
                      name="thumbs-up"
                      size={20}
                      color={liked ? "#4F46E5" : "gray"}
                    />
                  </TouchableOpacity>
                  <Text className="text-md text-gray-500 mb-3">
                    ~{meal.calories} kcal
                  </Text>
                  <TouchableOpacity
                    onPress={() => toggleReaction(meal.id, "dislike")}
                  >
                    <Feather
                      name="thumbs-down"
                      size={20}
                      color={disliked ? "tomato" : "gray"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MealSuggestions;
