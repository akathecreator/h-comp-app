import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import useCompletedQuests from "@/hooks/useCompletedQuests";
import { FlatList } from "react-native-gesture-handler";
import { ProgressBar } from "react-native-paper";
import icons from "@/constants/icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const flameIcon = icons.flame2;
const rightArrowIcon = icons.rightArrow;

const CompletedQuests = () => {
  const { quests, loading } = useCompletedQuests();
  return (
    <SafeAreaView className="flex-1">
      <View className="p-6">
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.replace("/")} className="mr-4">
          <Text className="text-neon text-lg">← Back</Text>
        </TouchableOpacity>
      </View>
      <View className="px-6">
        <Text className="text-xl font-bold text-black">Completed Quests</Text>
      </View>

      <FlatList
        data={quests}
        className="mt-4"
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const progress = item.progress / item.target;
          const isCompleted = item.progress >= item.target;

          return (
            <View className="px-6 py-2 rounded-lg shadow-md mb-1 flex-row items-center">
              {/* Left: Quest Icon */}
              <Image
                source={isCompleted ? flameIcon : rightArrowIcon}
                style={{ width: 30, height: 30, marginRight: 12 }}
              />

              {/* Middle: Quest Info */}
              <View className="flex-1 gap-2">
                <Text className="text-black font-medium">{item.title}</Text>
                <ProgressBar
                  progress={progress}
                  color="black"
                  style={{ height: 6, borderRadius: 8, marginTop: 6 }}
                />
                <Text className="text-xs text-gray-500 m-1">
                  {item.progress} / {item.target} completed
                </Text>
                <Text className="text-xs text-gray-500 m-1">
                  {item.type}
                </Text>
                
              </View>

              {/* Right: Status */}
              <View className="items-center">
                <Text
                  className={`text-sm font-semibold mx-2 ${
                    isCompleted ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {/* {isCompleted ? "✓ Done" : "In Progress"} */}
                </Text>
                <Text className={`text-xs font-semibold mx-2 text-gray`}>
                  {/* {console.log(item.completed_at)} */}
                  {/* {item.completed_at} */}
                </Text>
              </View>

              {/* <View className="items-center"> */}
                
              </View>
            // </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default CompletedQuests;
