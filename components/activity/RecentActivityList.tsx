import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { format } from "date-fns"; // For formatting timestamp
import useRecentActivity from "@/hooks/useRecentActivity";
import { useGlobalContext } from "@/lib/global-provider";
import flame2 from "../../assets/images/exercise.png";

const RecentActivityList = ({ date }: { date: any }) => {
  const { user } = useGlobalContext();
  const { recentActivity, loading } = useRecentActivity(user?.uid, date);

  if (loading) return <ActivityIndicator size="large" color="black" />;

  return (
    <View className="px-6 py-2 gap-2">
      {recentActivity.length === 0 ? (
        <View className="flex-1 px-4 m-3">
          <Text className="text-lg text-black-muted mx-auto">
            Let me know about your activities!
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {recentActivity.map((item) => {
            const activityDate = item.timestamp.toDate(); // Convert Firestore Timestamp to Date

            return (
              <View
                key={item.timestamp.toString()}
                className="flex-row items-center bg-white rounded-lg shadow-md p-4 mb-4"
              >
                {/* Left: Activity Icon */}
                <Image
                  source={flame2}
                  style={{
                    width: 136,
                    height: 136,
                    borderRadius: 8,
                    marginRight: 12,
                  }}
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
                  <Text className="text-black-muted">
                    {format(activityDate, "MMM dd, yyyy h:mm a")}
                  </Text>
                  <View className="flex-row mt-1">
                    <Text className="text-sm text-black-muted">
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
