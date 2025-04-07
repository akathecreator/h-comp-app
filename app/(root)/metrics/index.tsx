import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useMemo, useState } from "react";
import { useGlobalContext } from "@/lib/global-provider";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const GoalComponent = () => {
  const { userProfile, loading } = useGlobalContext();
  if (loading || !userProfile) return null;
  const goals = userProfile?.goals ?? {};
  const metrics = userProfile?.metrics ?? {};
  const macronutrients = userProfile?.macronutrients ?? {};
  const weightLossKg = goals?.current_weight_kg - goals?.target_weight_kg;
  const kcalPerKg = 7700;
  const totalCaloriesToBurn = weightLossKg * kcalPerKg;
  const defaultDeficit = metrics?.tdee - metrics?.calorie_target;
  const defaultDaysToGoal = Math.ceil(totalCaloriesToBurn / defaultDeficit);
  const defaultWeeks = Math.ceil(defaultDaysToGoal / 7);

  const [targetWeeks, setTargetWeeks] = useState(defaultWeeks);
  const [originalTargetWeeks, setOriginalTargetWeeks] = useState(defaultWeeks);
  const [manualMacros, setManualMacros] = useState(false);
  const [customMacros, setCustomMacros] = useState({
    protein_g: macronutrients?.max?.protein_g ?? 0,
    fats_g: macronutrients?.max?.fats_g ?? 0,
    carbs_g: macronutrients?.max?.carbs_g ?? 0,
  });

  // Dynamic calorie target based on targetWeeks
  const adjustedDeficit = useMemo(
    () => Math.floor(totalCaloriesToBurn / (targetWeeks * 7)),
    [targetWeeks]
  );
  const adjustedTargetCalories = metrics?.tdee - adjustedDeficit;

  // Macro calorie estimate
  const customMacroCalories = useMemo(() => {
    const { protein_g, fats_g, carbs_g } = customMacros;
    return protein_g * 4 + fats_g * 9 + carbs_g * 4;
  }, [customMacros]);
  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <TouchableOpacity
        onPress={() => router.replace("/daily")} // Navigate back
        style={{
          position: "absolute",
          top: 30, // Adjust for status bar
          left: 5,
          zIndex: 10,
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
          paddingTop: 20,
        }}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        {/* <Text style={{ color: "black", fontSize: 18, marginLeft: 5 }}>
            Back
          </Text> */}
      </TouchableOpacity>
      <View className="bg-newblue rounded-lg p-6 mb-4 mt-12 m-4">
        <Text className="text-lg text-white font-semibold">🎯 Your Goal</Text>
        <Text className="text-white mt-1 font-sans">
          From {goals.current_weight_kg} kg → {goals.target_weight_kg} kg
        </Text>
        <Text className="text-white font-sans mt-1">
          To lose {weightLossKg} kg of fat (~
          {totalCaloriesToBurn.toLocaleString()} kcal), you need a daily calorie
          deficit.
        </Text>

        <Text className="text-white font-sans mt-3">
          Estimated Time: <Text className="font-bold">{targetWeeks} weeks</Text>
        </Text>
        <Text className="text-white font-sans">
          Deficit: <Text className="font-bold">{adjustedDeficit} kcal/day</Text>
        </Text>
        <Text className="text-white font-sans">
          Target Intake:{" "}
          <Text className="font-bold">{adjustedTargetCalories} kcal/day</Text>
        </Text>
        <Text className="text-xs text-gray-200 mt-3">
          1 kg of fat ≈ 7,700 kcal. A 500 kcal/day deficit is ideal for
          sustainable weight loss.
        </Text>
      </View>
      <View className="bg-earthspinach rounded-lg p-6 mx-4">
        <Text className="text-lg text-white font-semibold mb-2">
          🔥 Calorie Plan
        </Text>
        <Text className="text-white font-sans">BMR: {metrics.bmr} kcal</Text>
        <Text className="text-xs text-gray-300">Calories burned at rest</Text>

        <Text className="text-white font-sans mt-2">
          TDEE: {metrics.tdee} kcal
        </Text>
        <Text className="text-xs text-gray-300">
          Total energy usage per day
        </Text>

        <Text className="text-white font-sans mt-2">
          Target Intake:{" "}
          <Text className="font-bold">{adjustedTargetCalories} kcal/day</Text>
        </Text>
        <Text className="text-xs text-gray-300">
          Based on your selected {targetWeeks} week goal
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default GoalComponent;
