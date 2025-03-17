import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import useRecentMeals from "@/hooks/useRecentMeals";
import { useGlobalContext } from "@/lib/global-provider";
import { format } from "date-fns";
import NutritionDialog from "./NutritionDialog";
import { removeMeal } from "@/lib/firebase";
import { router } from "expo-router";

interface Meal {
  id: string;
  description: string;
  image_url: string;
  timestamp: Date;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  user_id: string;
  meal_name: string;
}

const RecentLogs = ({ date }: { date: Date }) => {
  const { user } = useGlobalContext();
  if (!user) return null;

  const { recentMeals, loading } = useRecentMeals(user.uid, date);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [mealId, setMealId] = useState("");

  const handleDelete = (mealId: string) => {
    Alert.alert("Delete Meal", "Are you sure you want to delete this meal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          removeMeal(mealId);
        },
      },
    ]);
  };

  const renderRightActions = (mealId: string) => (
    <View
      className="flex justify-center items-center bg-red-500 w-24 h-48 rounded-lg"
      style={{ marginVertical: 4 }}
    >
      <TouchableOpacity
        onPress={() => handleDelete(mealId)}
        className="flex-1 justify-center items-center"
      >
        <Text className="text-white font-bold">Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center my-5">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (!recentMeals.length) {
    return (
      <View className="flex-1 px-4 m-4">
        {/* <Text className="text-lg font-rubik-semibold text-black mb-4">
          Recent Meals
        </Text> */}
        <Text className="text-lg text-black-muted font-rubik">
          Let me know what you are having today!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 px-4 mx-4">
      <View className="flex-row justify-between items-center my-1">
        {/* <Text className="text-xl font-rubik-semibold text-black ">
          Recent Meals
        </Text> */}
        {/* <TouchableOpacity onPress={() => router.push("/(root)/recents")}>
          <Text className="text-black text-md font-semibold">View All</Text>
        </TouchableOpacity> */}
      </View>
      {recentMeals.map((meal) => (
        <Swipeable
          key={meal.id}
          renderRightActions={() => renderRightActions(meal.id)}
        >
          <TouchableOpacity
            key={meal.id}
            onPress={() => {
              setDialogVisible(true); // Set dialogVisible to true
              setMealId(meal.id); // Set mealId to the log's id
            }}
            activeOpacity={0.7}
          >
            <View
              className="flex-row items-center bg-white rounded-lg shadow-md p-4 mb-4"
              style={{ elevation: 3 }}
            >
              <Image
                source={{ uri: meal.image_url }}
                style={{
                  width: 136,
                  height: 136,
                  borderRadius: 8,
                  marginRight: 12,
                }}
              />
              <View style={{ flex: 1 }}>
                <Text className="font-bold text-lg text-black mb-1">
                  {meal.meal_name}
                </Text>
                <Text className="text-black-muted">
                  {format(new Date(meal.timestamp), "MMM dd, yyyy hh:mm a")}
                </Text>
                <Text className="text-sm text-black-muted">
                  Calories: {meal.total_calories} kcal
                </Text>
                <View className="flex-row justify-between mt-3">
                  <View className="items-center">
                    <Text className="text-xs text-black-muted">Protein</Text>
                    <Text
                      className="text-sm font-rubik-semibold"
                      style={{ color: "#6f7cf8" }}
                    >
                      {meal.total_protein}g
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-xs text-black-muted">Carbs</Text>
                    <Text
                      className="text-sm font-rubik-semibold"
                      style={{ color: "#6f7cf8" }}
                    >
                      {meal.total_carbs}g
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-xs text-black-muted">Fats</Text>
                    <Text
                      className="text-sm font-rubik-semibold"
                      style={{ color: "#6f7cf8" }}
                    >
                      {meal.total_fat}g
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      ))}
      {/* Nutrition Dialog */}
      {mealId && (
        <NutritionDialog
          visible={dialogVisible}
          onClose={() => setDialogVisible(false)}
          meal_id={mealId}
        />
      )}
    </ScrollView>
  );
};

export default RecentLogs;
