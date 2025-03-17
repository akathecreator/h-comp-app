import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";
import icons from "@/constants/icons";
const Shortcuts = () => {
  // Shortcuts Data
  const shortcuts = [
    {
      id: "food",
      label: "Food Trend",
      route: "FoodTrendScreen",
      icon: icons.cutlery,
    },
    // {
    //   id: "activity",
    //   label: "Activity Trend",
    //   route: "ActivityTrendScreen",
    //   icon: icons.run,
    // },
    {
      id: "weight",
      label: "Weight Trend",
      route: "WeightTrendScreen",
      icon: icons.heart,
    },
    // {
    //   id: "sleep",
    //   label: "Sleep Trend",
    //   route: "SleepTrendScreen",
    //   icon: icons.bed,
    // },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="m-auto py-4"
    >
      <View className="flex-row">
        {shortcuts.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="bg-gray-200 px-4 py-2 rounded-lg mr-2 center min-w-[82px] max-w-[82px]"
            onPress={() => router.push(item.route as any)}
          >
            <Image
              source={item.icon}
              style={{ width: 30, height: 30, margin: "auto", }}
            />
            <Text className="text-black font-semibold text-center">{item.id}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Shortcuts;
