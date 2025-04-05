import React, { useState, useMemo, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import Header from "@/components/home/Header";
import DynamicHabitTracker from "@/components/home/WaterTracker";
import { useGlobalContext } from "@/lib/global-provider";
import MacroSelector from "@/components/MacroSelector";

const HomeScreen = () => {
  const { userProfile, loading } = useGlobalContext();
  if (loading || !userProfile) return null;

  const { on_going } = userProfile?.streaks ?? { on_going: 0 };
  const goals = userProfile?.goals ?? {};
  const metrics = userProfile?.metrics ?? {};
  const macronutrients = userProfile?.macronutrients ?? {};
  // Base calculations
  const weightLossKg = goals?.current_weight_kg - goals?.target_weight_kg;
  const kcalPerKg = 7700;
  const totalCaloriesToBurn = weightLossKg * kcalPerKg;
  const defaultDeficit = metrics?.tdee - metrics?.calorie_target;
  const defaultDaysToGoal = Math.ceil(totalCaloriesToBurn / defaultDeficit);
  const defaultWeeks = Math.ceil(defaultDaysToGoal / 7);

  // User-adjustable weeks
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-6 bg-white">
        {/* Header */}
        <Header streak={on_going} />

        {/* Intro */}
        <View className="mt-4 mb-2">
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
          <Text className="text-white font-sans mt-1">
            To lose {weightLossKg} kg of fat (~
            {totalCaloriesToBurn.toLocaleString()} kcal), you need a daily
            calorie deficit.
          </Text>

          <Text className="text-white font-sans mt-3">
            Estimated Time:{" "}
            <Text className="font-bold">{targetWeeks} weeks</Text>
          </Text>
          <Text className="text-white font-sans">
            Deficit:{" "}
            <Text className="font-bold">{adjustedDeficit} kcal/day</Text>
          </Text>
          <Text className="text-white font-sans">
            Target Intake:{" "}
            <Text className="font-bold">{adjustedTargetCalories} kcal/day</Text>
          </Text>

          {/* Week Select */}
          <View className="flex-row flex-wrap gap-2 mt-4">
            {[
              originalTargetWeeks - 6,
              originalTargetWeeks - 4,
              originalTargetWeeks - 2,
              originalTargetWeeks,
              originalTargetWeeks + 2,
              originalTargetWeeks + 4,
            ].map((w) => (
              <Pressable
                key={w}
                className={`px-3 py-1 rounded-full border ${
                  w === targetWeeks
                    ? "bg-white border-white"
                    : "border-gray-300"
                }`}
                onPress={() => setTargetWeeks(w)}
              >
                <Text
                  className={`text-sm ${
                    w === targetWeeks ? "text-newblue font-bold" : "text-white"
                  }`}
                >
                  {w} weeks
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-xs text-gray-200 mt-3">
            1 kg of fat ≈ 7,700 kcal. A 500 kcal/day deficit is ideal for
            sustainable weight loss.
          </Text>
        </View>

        {/* Calorie Info */}
        <View className="bg-earthspinach rounded-lg p-6 mb-4">
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
        {/* <MacroSelector calorieTarget={adjustedTargetCalories} /> */}

        {/* Macros Section */}
        {/* <MacroSelector
          adjustedTargetCalories={adjustedTargetCalories}
          macronutrients={macronutrients}
        /> */}
        <View className="bg-earthbrown rounded-lg p-6 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg text-white font-semibold">
              🥗 Suggested Macros
            </Text>
            <Pressable onPress={() => setManualMacros((prev) => !prev)}>
              <Text className="text-sm text-white underline">
                {manualMacros ? "Use Suggested" : "Customize"}
              </Text>
            </Pressable>
          </View>

          {manualMacros ? (
            <>
              {["protein_g", "fats_g", "carbs_g"].map((type) => (
                <View className="mb-2" key={type}>
                  <Text className="text-white font-sans capitalize">
                    {type.replace("_g", "").toUpperCase()}
                  </Text>
                  <TextInput
                    className="border rounded-md bg-white p-2 text-gray-800 mt-1"
                    keyboardType="numeric"
                    value={customMacros[type].toString()}
                    onChangeText={(val) =>
                      setCustomMacros((prev) => ({
                        ...prev,
                        [type]: parseInt(val) || 0,
                      }))
                    }
                  />
                </View>
              ))}
              <Text className="text-xs text-gray-300 mt-2">
                Your custom macros add up to ~
                <Text className="font-bold"> {customMacroCalories} kcal</Text>
              </Text>
            </>
          ) : (
            <>
              <Text className="text-white font-sans">
                🍗 Protein: {macronutrients.max.protein_g}g
              </Text>
              <Text className="text-white font-sans">
                🥑 Fat: {macronutrients.max.fats_g}g
              </Text>
              <Text className="text-white font-sans">
                🍚 Carbs: {macronutrients.max.carbs_g}g
              </Text>
            </>
          )}
        </View>

        {/* Meal Reminder */}
        <View className="mt-4 mb-6">
          <Text className="text-center text-sm text-gray-600 font-sans">
            👉 Don’t forget to log your first meal of the day!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
