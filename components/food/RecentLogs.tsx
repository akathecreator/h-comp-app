import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import RecentActivityList from "@/components/activity/RecentActivityList";
import Meallogs from "@/components/food/Meallogs";
import { useGlobalContext } from "@/lib/global-provider";
import { FlatList } from "react-native-gesture-handler";

const RecentLogs = ({ date }) => {
  // const { date } = useGlobalContext();
  const [activeTab, setActiveTab] = useState<"meals" | "activity">("meals");

  return (
    <View className="flex-1 px-1">
      {/* Tab Header */}
      <View className="flex-row justify-between  border-gray-700">
        <TouchableOpacity
          className="flex-1 items-center py-3"
          onPress={() => setActiveTab("meals")}
        >
          <Text
            className={`text-black font-bold font-rubik-medium text-lg ${
              activeTab === "meals"
                ? "border-b-2 border-black pb-1"
                : "text-gray-400"
            }`}
          >
            Recent Meals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center py-3"
          onPress={() => setActiveTab("activity")}
        >
          <Text
            className={`text-black font-bold font-rubik-medium text-lg ${
              activeTab === "activity"
                ? "border-b-2 border-black pb-1"
                : "text-gray-400"
            }`}
          >
            Recent Activity
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        {/* FlatList to Prevent Nested Scroll Issues */}
        <FlatList
          data={[{ key: activeTab }]} // Simulated data for one active section
          keyExtractor={(item) => item.key}
          renderItem={({ item }) =>
            item.key === "meals" ? (
              <Meallogs date={date} />
            ) : (
              <RecentActivityList date={date} />
            )
          }
        />
      </View>
    </View>
  );
};

export default RecentLogs;
