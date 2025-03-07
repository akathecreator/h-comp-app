import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, Image } from "react-native";
import icons from "@/constants/icons"; // Ensure you have a blue flame icon

const AnimatedFlameLogo = () => {
  const flameAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateFlame = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flameAnimation, {
            toValue: -5, // Moves flame slightly up
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(flameAnimation, {
            toValue: 5, // Moves flame slightly down
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateFlame();
  }, [flameAnimation]);

  return (
    <View className="flex-row items-center">
      {/* Animated Blue Flame */}
      <Animated.View style={{ transform: [{ translateY: flameAnimation }] }}>
        <Image
          source={icons.flame} // Replace with your blue flame icon
          style={{ width: 40, height: 40, tintColor: "#0061FF" }} // Blue flame color
        />
      </Animated.View>

      {/* "C6" Text */}
      <Text className="text-black text-3xl font-bold ml-2">C6</Text>
    </View>
  );
};

export default AnimatedFlameLogo;