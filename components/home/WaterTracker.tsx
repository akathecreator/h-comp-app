import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "@/lib/global-provider";
import useHydration from "@/hooks/useHydration";

const DynamicHabitTracker = () => {
  const { user } = useGlobalContext();
  if (!user) return null;

  const { cups, target, loading, logCup } = useHydration(user.uid);

  // Only show if hydration has been fetched
  if (loading || cups === null) return null;

  return (
    <View className="flex-row space-x-2 w-full gap-1 my-2 px-6">
      {/* Hydration Tracker */}
      <View className="px-1 rounded-xl flex-1">
        <TouchableOpacity
          className="p-4 rounded-xl w-full bg-royalblue"
          onPress={logCup}
          disabled={cups >= target} // Optional: disable once target is reached
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-white">Daily Hydration</Text>
            <Ionicons name="water" size={20} color="white" />
          </View>
          <Text className="text-white font-bold text-lg mt-2">
            {cups}/{target} cups
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pills Tracker - static */}
      {/* <View className="px-1 rounded-xl flex-1">
        <View className="p-4 rounded-xl w-full bg-blue">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-white">Pills Reminder</Text>
            <Ionicons name="medkit-outline" size={22} color="white" />
          </View>
          <Text className="text-white font-bold text-lg mt-2">0/1</Text>
        </View>
      </View> */}
    </View>
  );
};

export default DynamicHabitTracker;