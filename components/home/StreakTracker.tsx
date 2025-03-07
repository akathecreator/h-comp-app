import React from "react";
import { View, Text, Image } from "react-native";
import icons from "@/constants/icons";
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const StreakTracker = ({ logs }: { logs: boolean[] }) => {
  return (
    <View>
      <View className="flex-row justify-between">
        {days.map((day, index) => (
          <View key={day} className="items-center">
            {/* Day Label */}
            <Text className="text-lg font-bold text-black">{day}</Text>

            {/* Circle - Empty or Filled with Flame */}
            <View className="w-10 h-10 rounded-full border-2 border-gray-400 mt-2 items-center justify-center">
              {logs[index] && (
                <Image
                  source={icons.flame} // Replace with actual flame icon
                  style={{ width: 38, height: 38 }}
                />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default StreakTracker;
