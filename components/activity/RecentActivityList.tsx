import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { format } from "date-fns"; // For formatting timestamp
import useRecentActivity from "@/hooks/useRecentActivity";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";

const RecentActivityList = ({ date }: { date: Date }) => {
  const { user } = useGlobalContext();
  const { recentActivity, loading } = useRecentActivity(user?.uid, date);

  if (loading) return <ActivityIndicator size="large" color="black" />;

  return (
    <View className="p-6 gap-2">
      {recentActivity.length === 0 ? (
        <Text className="text-center text-gray-500">No recent activities</Text>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {recentActivity.map((item) => {
            const activityDate = item.timestamp.toDate(); // Convert Firestore Timestamp to Date

            return (
              <View
                key={item.timestamp.toString()}
                className="p-4 bg-white rounded-lg shadow-md mb-3 flex-row items-center"
              >
                {/* Left: Activity Icon */}
                <Image
                  source={icons.run}
                  style={{ width: 50, height: 50, margin: 14 }}
                />

                {/* Middle: Activity Info */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-black">
                      {item.activity_name}
                    </Text>
                    <Text className="text-sm text-gray-700">
                      {item.duration_minutes} mins
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500">
                    {format(activityDate, "MMM dd, yyyy h:mm a")}
                  </Text>
                  <View className="flex-row mt-1">
                    <Text className="text-sm text-gray-700 mr-3">
                      {item.calories_burned} Calories
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-700 mt-1">
                    Intensity: {item.intensity}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default RecentActivityList;