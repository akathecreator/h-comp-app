import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import useMostRecentMeal from "@/hooks/useMostRecentMeal";
import { useGlobalContext } from "@/lib/global-provider";
import flame2 from "../../assets/images/food.png";

interface NutritionDialogProps {
  visible: boolean;
  onClose: () => void;
  meal_id: string;
  dailyGoal?: number;
}

const NutritionDialog: React.FC<NutritionDialogProps> = ({
  visible,
  onClose,
  meal_id,
  dailyGoal = 2000,
}) => {
  const { user } = useGlobalContext();
  const [fadeAnim] = useState(new Animated.Value(0));
  const { recentMeals, loading } = useMostRecentMeal(user?.uid, meal_id);

  const [editing, setEditing] = useState(false);
  const [editedCalories, setEditedCalories] = useState(0);
  const [editedMacros, setEditedMacros] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [editableItems, setEditableItems] = useState<string[]>([]);

  useEffect(() => {
    if (visible && recentMeals.length > 0) {
      const meal = recentMeals[0];

      setEditedCalories(meal.total_calories);
      setEditedMacros({
        protein: meal.total_protein,
        carbs: meal.total_carbs,
        fat: meal.total_fat,
      });
      setEditableItems(meal.items || []);
    }

    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: visible ? 300 : 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [visible, loading, recentMeals]);

  if (loading || !recentMeals.length) return null;

  const handleSaveFavorite = () => {
    // Implement saving logic
    console.log("Saved favorite meal:", {
      editedCalories,
      editedMacros,
      editableItems,
    });
  };

  const handleRemoveItem = (index: number) => {
    setEditableItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDoneEditing = () => {
    setEditing(false);
  };

  const meal = recentMeals[0];

  const macroPercent = {
    protein: Math.round(((editedMacros.protein * 4) / editedCalories) * 100),
    carbs: Math.round(((editedMacros.carbs * 4) / editedCalories) * 100),
    fat: Math.round(((editedMacros.fat * 9) / editedCalories) * 100),
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/40">
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="w-4/5 bg-white rounded-lg p-6 shadow-lg"
        >
          <Text className="text-black text-lg font-bold text-center mb-4">
            Food Summary
          </Text>

          <View className="items-center mb-6">
            <Image
              source={meal.image_url ? { uri: meal.image_url } : flame2}
              className="rounded-lg w-60 h-60"
              resizeMode="cover"
            />
          </View>

          {/* Calories and Macros */}
          <View className="mb-4 bg-earthseaweed rounded-lg p-4">
            {editing ? (
              <>
                <Text className="text-white mb-2 font-semibold">
                  Total Calories:
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={editedCalories.toString()}
                  onChangeText={(val) => setEditedCalories(parseInt(val) || 0)}
                  className="bg-white text-gray-800 rounded-md p-2 mb-2"
                />

                {["protein", "carbs", "fat"].map((type) => (
                  <View key={type} className="mb-2">
                    <Text className="text-white capitalize">{type} (g):</Text>
                    <TextInput
                      keyboardType="numeric"
                      value={editedMacros[type].toString()}
                      onChangeText={(val) =>
                        setEditedMacros((prev) => ({
                          ...prev,
                          [type]: parseInt(val) || 0,
                        }))
                      }
                      className="bg-white text-gray-800 rounded-md p-2"
                    />
                  </View>
                ))}
              </>
            ) : (
              <>
                <Text className="text-white text-base font-semibold">
                  Total Calories: {editedCalories} kcal
                </Text>
                <View className="flex-col justify-between mt-2">
                  <Text className="text-white ">
                    Protein: {editedMacros.protein}g ({macroPercent.protein}%)
                  </Text>
                  <Text className="text-white ">
                    Carbs: {editedMacros.carbs}g ({macroPercent.carbs}%)
                  </Text>
                  <Text className="text-white ">
                    Fat: {editedMacros.fat}g ({macroPercent.fat}%)
                  </Text>
                </View>
              </>
            )}

            <TouchableOpacity
              onPress={() => setEditing((prev) => !prev)}
              className="mt-2"
            >
              <Text className="text-xs text-white underline">
                {editing ? "Done Editing" : "Edit Calories & Macros"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Ingredient Items */}
          <Text className="text-black text-lg font-bold mb-2">Items:</Text>
          <FlatList
            className={
              editing
                ? "max-h-[100px] overflow-y-auto"
                : "max-h-[200px] overflow-y-auto"
            }
            data={editableItems}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View className="flex-row justify-between items-center bg-gray-light p-2 mb-2 rounded-lg">
                <Text className="text-black text-sm flex-1">- {item}</Text>
                {editing && (
                  <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                    <Text className="text-red-500 font-bold">✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />

          {/* Daily Goal Comparison + Tips */}
          <Text className="text-xs text-gray-400 my-2">
            📊 This meal is {((editedCalories / dailyGoal) * 100).toFixed(0)}%
            of your daily calorie goal.
          </Text>
          {/* {macroPercent.fat > 50 && (
              <Text className="text-xs text-red-500 mt-1">
                ⚠️ High fat content. Try balancing with more lean protein or
                fiber-rich carbs.
              </Text>
            )} */}

          {/* Action Buttons */}
          {/* <View className="flex-row justify-between mt-5">
              <TouchableOpacity
                onPress={handleSaveFavorite}
                className="bg-green-600 px-3 py-2 rounded-lg"
              >
                <Text className="text-white text-sm font-medium">
                  Save as Favorite
                </Text>
              </TouchableOpacity>
              
            </View> */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-earthbrown px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-bold">Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default NutritionDialog;
