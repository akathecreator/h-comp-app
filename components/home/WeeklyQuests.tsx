import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-provider";
import useGoals from "@/hooks/useDailyQuests";
import { router } from "expo-router";

const flameIcon = icons.flame2;
const rightArrowIcon = icons.rightArrow;

const WeeklyQuests = () => {
  const { user } = useGlobalContext();
  const { quests, loading, updateQuest } = useGoals("weekly");

  if (loading) {
    return <ActivityIndicator size="large" color="black" />;
  }

  return (
    <View>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold text-black">Weekly Quests</Text>
        <TouchableOpacity
          className="p-2 border border-black rounded-lg"
          onPress={() => router.push("/completed-quests/weekly")}
        >
          <Text className="text-black font-semibold">Completed</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={quests}
        className="mt-1"
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const progress = item.progress / item.target;
          const isCompleted = item.progress >= item.target;

          return (
            <View className="p-2 rounded-lg shadow-md mb-1 flex-row items-center">
              <TouchableOpacity
                className="p-2 rounded-lg shadow-md mb-1 flex-row items-center"
                onPress={() => {
                  updateQuest(item);
                }}
              >
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
                    color="#4F46E5"
                    style={{ height: 6, borderRadius: 8, marginTop: 6 }}
                  />
                  <Text className="text-xs text-gray-500 m-1">
                    {item.progress} / {item.target} completed
                  </Text>
                </View>

                {/* Right: Status */}
                <Text
                  className={`text-sm font-semibold mx-2 ${
                    isCompleted ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {/* {isCompleted ? "✓ Done" : "In Progress"} */}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default WeeklyQuests;
