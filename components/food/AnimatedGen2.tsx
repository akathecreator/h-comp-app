import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Circle, Svg, G } from "react-native-svg";
import * as Progress from "react-native-progress";
import useDailyMacros from "@/hooks/useDailyMacros";
import { useGlobalContext } from "@/lib/global-provider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
const CaloriesTracker = ({ date }) => {
  const { userProfile } = useGlobalContext();
  const { daily_calories, macronutrients } = userProfile;
  const { dailyMacros } = useDailyMacros(date);
  const caloriesBurned = dailyMacros.totalBurn;
  const caloriesEaten = dailyMacros.totalCalories;
  const totalBurned = daily_calories.maintenance;
  // const burnProgress = caloriesBurned / totalBurned;
  const currentCalories = dailyMacros.totalCalories;
  const currentProtein = dailyMacros.totalProtein;
  const currentCarbs = dailyMacros.totalCarbs;
  const currentFats = dailyMacros.totalFats;
  const currentBurn = dailyMacros.totalBurn;
  const suggestedCalories = daily_calories.goal;
  const maxCalories = daily_calories.maintenance;
  const calorieDeficit = Math.max(0, maxCalories - currentCalories); // Deficit calculation
  const netCalories = currentCalories - currentBurn;

  // const burnProgress = currentBurn / maxCalories;
  // const burnProgress = Math.min(1, currentCalories / suggestedCalories);
  // const burnProgress = Math.min(1, Math.max(0, currentBurn / maxCalories));
  // Macronutrient data
  const nutrients = [
    {
      label: "Protein",
      value: currentProtein,
      max: macronutrients.suggested.protein_g,
      // color: "#6f7cf8",
      color: "#c2a968",
    },
    {
      label: "Fat",
      value: currentFats,
      max: macronutrients.suggested.fats_g,
      // color: "#6f7cf8",
      color: "#c2a968",
    },
    {
      label: "Carbs",
      value: currentCarbs,
      max: macronutrients.suggested.carbs_g,
      // color: "#6f7cf8",
      color: "#c2a968",
    },
  ];
  // 🔥 Ensure progress doesn't exceed 120% (1.2)
  const burnProgress = Math.min(1.2, currentCalories / suggestedCalories);
  const progressColor =
    currentCalories > suggestedCalories ? "#FF4C4C" : "#6f7cf8";

  // 🟢 Fix stroke offset for proper speedometer effect
  const RADIUS = 80;
  const STROKE_WIDTH = 12;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const handleInfoPress = () => {
    router.push("/metrics"); // Adjust path if inside a folder like /app/(tabs)
  };
  // Ensure progress is within bounds (0 to 1)
  // const progress = Math.min(1, netCalories / suggestedCalories);
  // const strokeDashoffset = (1 - progress) * CIRCUMFERENCE;
  // const excessProgress = Math.max(progress - 1, 0);
  // const redStrokeDashoffset = (1 - excessProgress) * CIRCUMFERENCE;
  // const adjustedOffset = (1 - Math.min(1, burnProgress)) * DASH_LENGTH;
  const progress = netCalories / suggestedCalories; // full raw value
  const cappedProgress = Math.min(1, progress);
  const excessProgress = Math.max(progress - 1, 0);

  const strokeDashoffset = (1 - cappedProgress) * CIRCUMFERENCE;
  const redStrokeDashoffset = (1 - Math.min(1, excessProgress)) * CIRCUMFERENCE;
  return (
    <View className="bg-white p-8 rounded-lg shadow-md items-center mx-7 my-4 mb-6">
      {/* Circular Progress Bar */}
      <View className="absolute right-5 top-2">
        <TouchableOpacity onPress={handleInfoPress}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#594715"
          />
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center ">
        <View className="items-center justify-center mr-6">
          <Svg height="180" width="180" viewBox="0 0 200 200">
            {/* Background circle */}
            <Circle
              cx="100"
              cy="100"
              r={RADIUS}
              stroke="#E5E7EB"
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            {/* Progress circle */}
            <Circle
              cx="100"
              cy="100"
              r={RADIUS}
              stroke="#594715" // Progress color
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-270, 100, 100)"
            />
            <Circle
              cx="100"
              cy="100"
              r={RADIUS / 1.17}
              stroke="#FF4C4C" // Progress color
              strokeWidth={12}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={redStrokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-270, 100, 100)"
            />
          </Svg>
          {/* Centered Text */}
          <View style={{ position: "absolute", alignItems: "center" }}>
            <Text style={{ fontSize: 40, fontWeight: "bold" }}>
              {netCalories}
            </Text>
            <Text style={{ fontSize: 14, color: "gray" }}>Net Calories</Text>
            <Text style={{ fontSize: 10, color: "gray" }}>
              {maxCalories} Max Calories
            </Text>
          </View>
        </View>
        <View className="mt flex w-[70px] mr-6">
          {nutrients.map((nutrient, index) => (
            <View key={index} className="mb-2">
              <Text className="text-sm font-semibold">{nutrient.label}</Text>
              <Progress.Bar
                progress={nutrient.value / nutrient.max}
                width={null}
                color={
                  nutrient.value > nutrient.max ? "#c58b49" : nutrient.color
                }
                height={6}
                style={{ width: "100%" }}
              />
              <Text className="text-sm text-gray-500">
                {Math.round(nutrient.value)}/{Math.round(nutrient.max)} g
              </Text>
              {/* {nutrient.value > nutrient.max && (
                <Text className="text-xs text-red-500">
                  {nutrient.value - nutrient.max}g
                </Text>
              )} */}
            </View>
          ))}
        </View>
      </View>

      {/* Macronutrient Progress Bars */}

      {/* Calories Eaten & Burned */}
      <View className="flex-row justify-between w-full px-6">
        <View className="items-center">
          <Text className="text-lg font-bold">{currentCalories} Kcal</Text>
          <Text className="text">Eaten</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold">{currentBurn} Kcal</Text>
          <Text className="text">Burned</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold">{suggestedCalories} Kcal</Text>
          <Text className="text">Suggested</Text>
        </View>
      </View>
      {netCalories > maxCalories && (
        <Text className="text-xs text-red-500">
          {netCalories - maxCalories} Kcal
        </Text>
      )}
    </View>
  );
};

export default CaloriesTracker;
