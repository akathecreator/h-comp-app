import React from "react";
import { View, Text, Image } from "react-native";
import icons from "@/constants/icons";

const Header = ({ streak }: { streak: number }) => {
  return (
    <View className="flex-row justify-between items-center">
      {/* Left - Title */}
      <Text className="text-3xl font-bold text-black">H Companion</Text>

      {/* Right - Streak Count + Icon */}
      <View className="flex-row items-center">
        <Text className="text-lg font-bold text-black mr-1 mt-1">{streak}</Text>
        <Image
          source={icons.flame2} // Replace with actual flame icon
          style={{ width: 40, height: 40, resizeMode: "contain" }}
        />
      </View>
    </View>
  );
};

export default Header;
