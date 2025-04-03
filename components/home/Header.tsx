import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated } from "react-native";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-provider";

const FlickeringFlame = () => {
  const opacityAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const flicker = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.6,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    flicker.start();
  }, []);

  return (
    <Animated.Image
      source={icons.flame2}
      style={{
        width: 40,
        height: 40,
        resizeMode: "contain",
        opacity: opacityAnim,
      }}
    />
  );
};
const Header = ({ streak }: { streak: number }) => {
  const { userProfile, loadingFood } = useGlobalContext();
  const nickname = userProfile?.nickname;
  return (
    <View className="flex-row justify-between items-center">
      {/* Left - Title */}
      <Text className="text-3xl font-bold text-black pt-4">Hi, {nickname}</Text>

      {/* Right - Streak Count + Icon */}
      <View className="flex-row items-center">
        <Text className="text-lg font-bold text-black mr-1 mt-1">{streak}</Text>
        {/* <Image
          source={icons.flame2} // Replace with actual flame icon
          style={{ width: 40, height: 40, resizeMode: "contain" }}
        /> */}
        {loadingFood ? (
          <FlickeringFlame />
        ) : (
          <Image
            source={icons.flame2} // Replace with actual flame icon
            style={{ width: 40, height: 40, resizeMode: "contain" }}
          />
        )}
      </View>
    </View>
  );
};

export default Header;
