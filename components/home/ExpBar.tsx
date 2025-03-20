import React from "react";
import { View, Text } from "react-native";

const ExpBar = ({
  level,
  exp,
  maxExp,
}: {
  level: number;
  exp: number;
  maxExp: number;
}) => {
  const progress = (exp / maxExp) * 100;

  return (
    <View className="my-2">
      {/* Level Label */}
      <Text className="text-lg font-bold text-black text-left">
        Level {level}
      </Text>

      {/* Experience Bar */}
      <View className="w-full h-3 bg-gray-300 rounded-full my-2 shadow-md">
        <View
          className="h-full rounded-full"
          style={{ width: `${progress}%`, backgroundColor: "#4F46E5" }} // Neon Dark Blue
        />
      </View>

      {/* EXP Text */}
      <Text className="text-right text-sm text-gray-600 mt-1">
        {exp} / {maxExp} XP
      </Text>
    </View>
  );
};

export default ExpBar;
