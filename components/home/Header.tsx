import React from "react";
import { View, Text, Image } from "react-native";
import icons from "@/constants/icons";

const Header = ({ streak }: { streak: number }) => {
  return (
    <View className="flex-row justify-between items-center">
      {/* Left - Title */}
      <Text className="text-3xl font-bold text-black">Aki</Text>

      {/* Right - Streak Count + Icon */}
      <View className="flex-row items-center">
        <Text className="text-xl font-bold text-black mr-2">{streak}</Text>
        <Image
          source={icons.flame} // Replace with actual flame icon
          style={{ width: 24, height: 24, resizeMode: "contain" }}
        />
      </View>
    </View>
  );
};

export default Header;
