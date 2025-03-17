import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  ScrollView,
  Image,
} from "react-native";
import useMostRecentMeal from "@/hooks/useMostRecentMeal";
import { useGlobalContext } from "@/lib/global-provider";
// Mock data (replace this with AI response data)
const mockSummary = {
  calories: 450,
  protein: 25,
  carbs: 60,
  fat: 15,
  items: ["Grilled Chicken", "Brown Rice", "Steamed Broccoli"],
};

interface NutritionDialogProps {
  visible: boolean;
  onClose: () => void;
  meal_id: string;
}

const NutritionDialog: React.FC<NutritionDialogProps> = ({
  visible,
  onClose,
  meal_id = false,
}) => {
  const { user } = useGlobalContext(); // Get the current user
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade-in animation
  const { recentMeals, loading } = useMostRecentMeal(user.uid, meal_id);
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, loading]);
  if (loading || !recentMeals.length) return null;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/40">
        <Animated.View
          style={{
            opacity: fadeAnim,
          }}
          className="w-4/5 bg-white rounded-lg p-6 shadow-lg"
        >
          {/* Title */}
          <Text className="text-black text-lg font-bold text-center mb-4">
            Food Summary
          </Text>
          <View className="items-center mb-6">
            <Image
              source={{ uri: recentMeals[0].image_url }}
              className="rounded-lg w-60 h-60"
              resizeMode="contain"
            />
          </View>

          {/* Calories and Macros */}
          <View className="mb-4 bg-black rounded-lg p-4">
            <Text className="text-white text-base font-semibold">
              Total Calories:{" "}
              <Text className="text-white">
                {recentMeals[0].total_calories} kcal
              </Text>
            </Text>
            <View className="flex-row justify-between mt-2">
              <Text className="text-white">
                Protein: {recentMeals[0].total_protein}g
              </Text>
              <Text className="text-white">
                Carbs: {recentMeals[0].total_carbs}g
              </Text>
              <Text className="text-white">
                Fat: {recentMeals[0].total_fat}g
              </Text>
            </View>
          </View>

          {/* Food Items */}
          <Text className="text-black text-lg font-semibold mb-2">Items:</Text>
          <FlatList
            data={recentMeals[0].items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text className="text-black text-sm bg-gray-light p-2 mb-2 rounded-lg">
                - {item}
              </Text>
            )}
          />

          {/* Dismiss Button */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-black p-3 rounded-lg items-center mt-4"
          >
            <Text className="text-white font-bold">Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default NutritionDialog;
