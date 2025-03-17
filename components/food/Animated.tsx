import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useGlobalContext } from "@/lib/global-provider";
import useDailyMacros from "@/hooks/useDailyMacros";
import { Link } from "expo-router";

const AnimatedProgress = ({ date }) => {
  const { userProfile } = useGlobalContext();
  const { daily_calories, macronutrients } = userProfile;
  const { dailyMacros } = useDailyMacros(date);

  const currentCalories = dailyMacros.totalCalories;
  const currentProtein = dailyMacros.totalProtein;
  const currentCarbs = dailyMacros.totalCarbs;
  const currentFats = dailyMacros.totalFats;
  const currentBurn = dailyMacros.totalBurn;
  const suggestedCalories = daily_calories.goal;
  const maxCalories = daily_calories.maintenance;
  const calorieDeficit = Math.max(0, maxCalories - currentCalories); // Deficit calculation

  const caloriesProgress = useSharedValue(0);
  const caloriesBalanceProgress = useSharedValue(0);
  const proteinProgress = useSharedValue(0);
  const carbsProgress = useSharedValue(0);
  const fatsProgress = useSharedValue(0);
  const burnProgress = useSharedValue(0);
  
  useEffect(() => {
    caloriesBalanceProgress.value = withTiming(
      Math.min(((currentCalories - currentBurn) / maxCalories) * 100, 100),
      { duration: 1000 }
    );
    caloriesProgress.value = withTiming(
      Math.min((currentCalories / maxCalories) * 100, 100),
      { duration: 1000 }
    );
    proteinProgress.value = withTiming(
      Math.min(
        (currentProtein / macronutrients.suggested.protein_g) * 100,
        100
      ),
      { duration: 1000 }
    );
    carbsProgress.value = withTiming(
      Math.min((currentCarbs / macronutrients.suggested.carbs_g) * 100, 100),
      { duration: 1000 }
    );
    fatsProgress.value = withTiming(
      Math.min((currentFats / macronutrients.suggested.fats_g) * 100, 100),
      { duration: 1000 }
    );
    burnProgress.value = withTiming(
      Math.min((currentBurn / maxCalories) * 100, 100),
      { duration: 1000 }
    );
  }, [currentCalories, currentProtein, currentCarbs, currentFats, currentBurn]);

  const createBarStyle = (progress, exceeded) => {
    return useAnimatedStyle(() => ({
      width: `${progress.value}%`,
      backgroundColor: exceeded ? "red" : "black",
    }));
  };

  const caloriesStyle = createBarStyle(
    caloriesProgress,
    currentCalories > maxCalories
  );
  const caloriesBalanceStyle = createBarStyle(
    caloriesBalanceProgress,
    currentCalories - currentBurn > maxCalories
  );
  const proteinStyle = createBarStyle(
    proteinProgress,
    currentProtein > macronutrients.suggested.protein_g
  );
  const carbsStyle = createBarStyle(
    carbsProgress,
    currentCarbs > macronutrients.suggested.carbs_g
  );
  const fatsStyle = createBarStyle(
    fatsProgress,
    currentFats > macronutrients.suggested.fats_g
  );
  const burnStyle = createBarStyle(burnProgress, currentBurn > maxCalories);

  return (
    <View className="mb-6 px-4 mx-4">
      {/* <Text className="text-lg font-bold text-black">Today's Progress</Text> */}
      <View className="flex flex-row items-center justify-between px-1">
        <Text className="text-lg font-bold text-black">Today's Progress</Text>
        {/* <Link href="/(root)/trends" asChild>
          <TouchableOpacity className="bg-neon px-4 py-2 rounded-lg">
            <Text className="text-black font-medium">View Trends</Text>
          </TouchableOpacity>
        </Link> */}
      </View>
      <View className="mt-4 bg-white p-6 rounded-lg shadow-lg">
        {/* Calories Progress */}
        {/* <View className="mb-6">
          <Text className="text-black-muted mb-2">Calories Consumed</Text>

          <View className="relative w-full h-4 bg-gray-200 rounded-full">
            <View />
            <Animated.View
              className="absolute h-4 rounded-full"
              style={caloriesStyle}
            />
          </View>
        </View> */}
        <View className="mb-6">
          <Text className="text-black-muted mb-2">
            Calories Balance (Max {maxCalories})
          </Text>

          <View className="relative w-full h-4 bg-gray-200 rounded-full">
            {/* Maintenance Marker */}
            <View
              style={{
                position: "absolute",
                left: `${(suggestedCalories / maxCalories) * 100}%`,
                top: -8,
                width: 2,
                height: 20,
                backgroundColor: "blue",
              }}
            />
            {/* Progress Bar */}
            {/* <Animated.View
              className="absolute h-4 rounded-full"
              style={caloriesBalanceStyle}
            /> */}
            <View
              style={{
                position: "absolute",
                left: `${(suggestedCalories / maxCalories) * 100}%`,
                top: -8,
                width: 2,
                height: 20,
                backgroundColor: "blue",
              }}
            />

            {/* Burned Calories Bar (Red) */}
            <Animated.View
              className={`absolute left-0 h-4 ${
                currentCalories - currentBurn > maxCalories
                  ? "bg-red-500"
                  : "bg-blue"
              } rounded-full opacity-70`}
              style={{
                width: `${(currentBurn / maxCalories) * 100}%`,
              }}
            />

            {/* Net Calories Bar (Black) */}
            <Animated.View
              className="absolute left-0 h-4 bg-black rounded-full"
              style={{
                width: `${
                  ((currentCalories - currentBurn) / maxCalories) * 100
                }%`,
              }}
            />
          </View>
          <Text className="text-center text-2xl font-bold mt-2 text-black">
            {currentCalories - currentBurn} / {maxCalories} kcal
          </Text>
          {currentCalories > maxCalories ? (
            <Text className="text-center text-red-600 mt-2 font-bold">
              You've exceeded your max caloric limit!
            </Text>
          ) : (
            <Text className="text-center text-black mt-2 font-bold">
              Deficit so far: {calorieDeficit} kcal
            </Text>
          )}
        </View>

        {/* Macros Progress */}
        <View className="flex-row justify-between">
          {/* Protein */}
          <View className="items-center">
            <Text className="text-black-muted text-sm mb-1">Protein</Text>
            <View className="relative w-full h-4 bg-gray-200 rounded-full">
              <Animated.View
                className="absolute h-4 rounded-full"
                style={proteinStyle}
              />
            </View>
            <Text className="text-black text-sm mt-2">
              {currentProtein}g / {macronutrients.suggested.protein_g}g
            </Text>
            <Text className="text-black text-sm mt-1 text-black">
              Missing: {macronutrients.suggested.protein_g - currentProtein}g
            </Text>
          </View>

          {/* Carbs */}
          <View className="items-center">
            <Text className="text-black-muted text-sm mb-1">Carbs</Text>
            <View className="relative w-full h-4 bg-gray-200 rounded-full">
              <Animated.View
                className="absolute h-4 rounded-full"
                style={carbsStyle}
              />
            </View>
            <Text className="text-black text-sm mt-2">
              {currentCarbs}g / {macronutrients.suggested.carbs_g}g
            </Text>
            <Text className="text-black text-sm mt-1 text-black">
              Missing: {macronutrients.suggested.carbs_g - currentCarbs}g
            </Text>
          </View>

          {/* Fats */}
          <View className="items-center">
            <Text className="text-black-muted text-sm mb-1">Fats</Text>
            <View className="relative w-full h-4 bg-gray-200 rounded-full">
              <Animated.View
                className="absolute h-4 rounded-full"
                style={fatsStyle}
              />
            </View>
            <Text className="text-black text-sm mt-2">
              {currentFats}g / {macronutrients.suggested.fats_g}g
            </Text>
            <Text className="text-black text-sm mt-1 text-black">
              Missing: {macronutrients.suggested.fats_g - currentFats}g
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AnimatedProgress;
