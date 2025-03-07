import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import icons from "@/constants/icons";
// Mock achievement data
const achievements = [
  { id: 1, title: "7-Day Streak!", image: icons.flame },
  { id: 2, title: "First Log!", image: icons.flame },
  { id: 3, title: "100 XP Earned!", image: icons.flame },
];

const Achievements = () => {
  return (
    <View>
      <Text className="text-lg font-bold text-black">Achievements</Text>

      {/* Scrollable Achievements */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-2"
      >
        {achievements.map((achievement) => (
          <View key={achievement.id} className="items-center mr-4">
            <Image
              source={achievement.image}
              style={{ width: 40, height: 50 }}
            />
            <Text className="text-xs text-gray-600 mt-1 text-center">
              {achievement.title}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Achievements;
