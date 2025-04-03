import React, { useState, useRef } from "react";
import { View, Image, FlatList, Dimensions, Animated } from "react-native";
import images from "@/constants/images";

const { width } = Dimensions.get("window");

const slides = [
  { id: "1", image: images.onboarding },
  { id: "2", image: images.onboarding2 },
//   { id: "3", image: images.onboarding3 },
  { id: "3", image: images.onboarding4 },
];

export const OnboardingSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => {
    return (
      <View style={{ width, alignItems: "center" }}>
        <Image
          source={item.image}
          className="w-full h-5/6"
          resizeMode="cover"
        />
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View className="flex-row justify-center space-x-2 -mt-24">
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              className="h-2 rounded-full bg-black "
              style={{
                width: dotWidth,
                opacity,
              }}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(newIndex);
        }}
      />
      {renderDots()}
    </View>
  );
};
