import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import useRecentMeals from "@/hooks/useRecentMeals"; // Adjust the path as needed
import { useGlobalContext } from "@/lib/global-provider";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import NutritionDialog from "./components/food/NutritionDialog";

interface Meal {
  id: string; // Document ID
  description: string; // Description of the meal
  image_url: string; // URL of the meal image
  timestamp: Date; // Timestamp of when the meal was logged
  total_calories: number; // Total calories in the meal
  total_protein: number; // Total protein in grams
  total_carbs: number; // Total carbs in grams
  total_fat: number; // Total fat in grams
  user_id: string; // ID of the user who logged the meal
  meal_name: string;
}

const RecentLogs = ({ date }) => {
  const { user } = useGlobalContext(); // Get the current user
  if (!user) return;
  const { recentMeals, loading } = useRecentMeals(user.uid, date);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [mealId, setMealId] = useState("");
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-bone-light">
        <ActivityIndicator size="large" color="black" /> {/* DustyBlue */}
      </View>
    );
  }

  if (!recentMeals.length) {
    return (
      <View className="flex-1 px-4 mx-4">
        <Text className="text-lg font-rubik-semibold text-black mb-4">
          Recent Activities
        </Text>
        <Text className="text-lg text-black-muted font-rubik">
          No recent meals found.??
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 mx-4">
      <Text className="text-lg font-rubik-semibold text-black mb-4">
        Recent Activities
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {recentMeals.map((log: Meal) => (
          <TouchableOpacity
            key={log.id} // `key` should be on the outermost repeating component
            onPress={() => {
              setDialogVisible(true); // Set dialogVisible to true
              setMealId(log.id); // Set mealId to the log's id
            }}
            activeOpacity={0.7}
          >
            <View
              className="flex-row bg-white rounded-lg shadow-md overflow-hidden mb-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {/* Image */}
              <Image
                source={{ uri: log.image_url }}
                className="w-48 h-48 rounded-l-lg"
                resizeMode="cover"
              />

              {/* Details */}
              <View className="flex-1 p-4">
                {/* Description */}
                <Text className="text-base font-rubik-semibold text-black truncate">
                  {log.meal_name}
                </Text>
                {/* Time Component */}
                <Text className="text-xs text-gray-dark mt-1">
                  {format(new Date(log.timestamp), "MMM d, hh:mm a")}
                </Text>
                {/* Calories */}
                <Text className="text-sm font-rubik-semibold text-gray mt-2">
                  {log.total_calories} kcal
                </Text>

                {/* Macronutrients */}
                <View className="flex-row justify-between mt-3">
                  <View className="items-center">
                    <Text className="text-xs text-black-muted">Protein</Text>
                    <Text className="text-sm font-rubik-semibold text-black">
                      {log.total_protein}g
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-xs text-black-muted">Carbs</Text>
                    <Text className="text-sm font-rubik-semibold text-black">
                      {log.total_carbs}g
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-xs text-black-muted">Fats</Text>
                    <Text className="text-sm font-rubik-semibold text-black">
                      {log.total_fat}g
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {/* Nutrition Dialog */}
        <NutritionDialog
          visible={dialogVisible}
          onClose={() => setDialogVisible(false)}
          meal_id={mealId}
        />
      </ScrollView>
    </View>
  );
};

export default RecentLogs;
