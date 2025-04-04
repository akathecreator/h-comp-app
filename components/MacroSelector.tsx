import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import Toast from "react-native-toast-message";

const generateMacrosFromGoal = (goal: string, calorieTarget: number) => {
  let ratio;
  if (goal === "lose") ratio = { protein: 40, fat: 30, carbs: 30 };
  else if (goal === "gain") ratio = { protein: 35, fat: 25, carbs: 40 };
  else ratio = { protein: 30, fat: 30, carbs: 40 }; // maintain

  return {
    protein_g: Math.round((ratio.protein / 100) * calorieTarget / 4),
    fats_g: Math.round((ratio.fat / 100) * calorieTarget / 9),
    carbs_g: Math.round((ratio.carbs / 100) * calorieTarget / 4),
    ratio,
  };
};

const MacroPlanner = ({
  calorieTarget = 2000,
  goal = "maintain", // "lose", "gain", or "maintain"
}) => {
  const [manualMode, setManualMode] = useState(false);
  const [macros, setMacros] = useState({
    protein_g: 0,
    fats_g: 0,
    carbs_g: 0,
  });
  const [ratioUsed, setRatioUsed] = useState({ protein: 0, fat: 0, carbs: 0 });

  useEffect(() => {
    const { protein_g, fats_g, carbs_g, ratio } = generateMacrosFromGoal(
      goal,
      calorieTarget
    );
    setMacros({ protein_g, fats_g, carbs_g });
    setRatioUsed(ratio);
  }, [calorieTarget, goal]);

  const handleSave = () => {
    // Save logic here (e.g. to backend or local state)
    Toast.show({
      type: "success",
      text1: "Macros saved",
      text2: "Your nutrition plan has been updated.",
    });
  };

  const macroCalories =
    macros.protein_g * 4 + macros.carbs_g * 4 + macros.fats_g * 9;

  return (
    <View className="bg-earthbrown rounded-lg p-6 mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg text-white font-semibold">🥗 Daily Macros</Text>
        <Pressable onPress={() => setManualMode(!manualMode)}>
          <Text className="text-sm text-white underline">
            {manualMode ? "Use Suggested" : "Customize"}
          </Text>
        </Pressable>
      </View>

      {manualMode ? (
        <>
          {["protein_g", "fats_g", "carbs_g"].map((type) => (
            <View className="mb-2" key={type}>
              <Text className="text-white capitalize">
                {type.replace("_g", "")}
              </Text>
              <TextInput
                keyboardType="numeric"
                value={macros[type].toString()}
                onChangeText={(val) =>
                  setMacros((prev) => ({
                    ...prev,
                    [type]: parseInt(val) || 0,
                  }))
                }
                className="bg-white text-gray-800 p-2 rounded-md mt-1"
              />
            </View>
          ))}
        </>
      ) : (
        <>
          <Text className="text-white mb-1">
            🎯 Goal: {goal.charAt(0).toUpperCase() + goal.slice(1)}
          </Text>
          <Text className="text-white mb-1">
            🍗 Protein: {macros.protein_g}g ({ratioUsed.protein}%)
          </Text>
          <Text className="text-white mb-1">
            🥑 Fats: {macros.fats_g}g ({ratioUsed.fat}%)
          </Text>
          <Text className="text-white mb-1">
            🍚 Carbs: {macros.carbs_g}g ({ratioUsed.carbs}%)
          </Text>
        </>
      )}

      <Text className="text-xs text-gray-300 mt-3">
        🔥 Estimated total:{" "}
        <Text className="font-bold">{macroCalories} kcal</Text>
      </Text>

      <Pressable
        onPress={handleSave}
        className="bg-white mt-5 py-2 px-4 rounded-full self-end"
      >
        <Text className="text-earthbrown font-bold">Save</Text>
      </Pressable>

      <Toast />
    </View>
  );
};

export default MacroPlanner;