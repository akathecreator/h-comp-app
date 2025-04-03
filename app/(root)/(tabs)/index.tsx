import React from "react";
import { SafeAreaView, View, Text, ScrollView } from "react-native";
import Header from "@/components/home/Header";
import DynamicHabitTracker from "@/components/home/WaterTracker";
import { useGlobalContext } from "@/lib/global-provider";

const HomeScreen = () => {
  const { userProfile, loading } = useGlobalContext();

  if (loading || !userProfile) return null;

  const { goals, metrics, macronutrients, streaks } = userProfile;
  const { on_going } = streaks;

  const weightLossKg = goals.current_weight_kg - goals.target_weight_kg;
  const kcalPerKg = 7700;
  const totalCaloriesToBurn = weightLossKg * kcalPerKg;
  const avgDailyDeficit = metrics.tdee - metrics.calorie_target;
  const daysToGoal = Math.ceil(totalCaloriesToBurn / avgDailyDeficit);
  const estimatedWeeks = Math.ceil(daysToGoal / 7);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-6 bg-white">
        {/* Header with Streak */}
        <Header streak={on_going} />

        {/* Greeting */}
        <View className="mt-4 mb-2">
          {/* <Text className="text-xl font-semibold font-sans text-gray-800">
            Hi, {nickname} 👋
          </Text> */}
          <Text className="text-gray-600 font-sans mt-1">
            Let’s stay consistent today! You’re{" "}
            <Text className="font-bold text-newblue">{weightLossKg} kg</Text>{" "}
            away from your goal.
          </Text>
        </View>

        {/* Goal Summary */}
        <View className="bg-newblue rounded-lg p-6 mb-4">
          <Text className="text-lg text-white font-semibold">🎯 Your Goal</Text>
          <Text className="text-white mt-1 font-sans">
            From {goals.current_weight_kg} kg → {goals.target_weight_kg} kg
          </Text>
          <Text className="text-white font-sans">
            Target: <Text className="font-bold">~{estimatedWeeks} weeks</Text>{" "}
            if you keep up your daily deficit.
          </Text>
        </View>

        {/* Calorie Plan */}
        <View className="bg-earthspinach rounded-lg p-6 mb-4">
          <Text className="text-lg text-white font-semibold mb-2">
            🔥 Calorie Plan
          </Text>
          <Text className="text-white font-sans">
            BMR: <Text className="font-bold">{metrics.bmr} kcal</Text>
          </Text>
          <Text className="text-xs text-gray-300">
            Your body burns this at rest
          </Text>

          <Text className="text-white font-sans mt-2">
            TDEE: <Text className="font-bold">{metrics.tdee} kcal</Text>
          </Text>
          <Text className="text-xs text-gray-300">
            Your total daily energy use
          </Text>

          <Text className="text-white font-sans mt-2">
            Target:{" "}
            <Text className="font-bold">{metrics.calorie_target} kcal/day</Text>
          </Text>
          <Text className="text-xs text-gray-300">
            To lose weight at your current pace
          </Text>
        </View>

        {/* Macros */}
        <View className="bg-earthbrown rounded-lg p-6 mb-4">
          <Text className="text-lg text-white font-semibold mb-2">
            🥗 Macros (per day)
          </Text>
          <Text className="text-white font-sans">
            🍗 Protein: {macronutrients.max.protein_g}g
          </Text>
          <Text className="text-white font-sans">
            🥑 Fat: {macronutrients.max.fats_g}g
          </Text>
          <Text className="text-white font-sans">
            🍚 Carbs: {macronutrients.max.carbs_g}g
          </Text>
        </View>

        {/* Next Action Suggestion */}
        <View className="mt-4 mb-6">
          <Text className="text-center text-sm text-gray-600 font-sans">
            👉 Don’t forget to log your first meal of the day!
          </Text>
        </View>

        {/* Progress Summary */}
        {/* <View className="bg-gray-100 rounded-lg p-4 mb-4">
          <Text className="text-base font-semibold text-gray-800">
            📈 Progress Today
          </Text>
          <Text className="text-gray-700 font-sans mt-1">
            ✅ Weight logged: {hasLoggedWeight ? "Yes" : "No"}
          </Text>
          <Text className="text-gray-700 font-sans">
            🍽️ Meals logged: {hasLoggedMeal ? "Yes" : "No"}
          </Text>
          <Text className="text-gray-700 font-sans">
            💧 Water: {waterLogged}/{waterGoal} cups
          </Text>
          <Text className="text-gray-700 font-sans">
            🔥 Streak: {on_going || 0} days
          </Text>
        </View> */}

        {/* Water Tracker */}
        {/* <DynamicHabitTracker /> */}

        {/* Tip of the Day */}
        {/* <View className="mb-10 rounded-lg p-6 bg-black">
          <Text className="text-lg text-white font-semibold">
            💡 Tip of the Day
          </Text>
          <Text className="text-white mt-1 font-sans">
            Eating out? Choose high-protein meals like grilled meats and avoid
            sugary drinks to stay on track.
          </Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
