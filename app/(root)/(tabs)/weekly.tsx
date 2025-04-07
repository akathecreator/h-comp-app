import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { format, subWeeks, addWeeks, addDays, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

import Header from "@/components/home/Header";
import { useGlobalContext } from "@/lib/global-provider";
import BodyProgress from "@/components/weekly/BodyProgress";
import { ScrollView } from "react-native-gesture-handler";
import useWeeklyLogs from "@/hooks/useWeeklyData";
import { Divider } from "react-native-paper";
const screenWidth = Dimensions.get("window").width;

const WeeklyPage = () => {
  const { user, userProfile } = useGlobalContext();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { weeklyLogs, loading } = useWeeklyLogs(user?.uid, currentWeek);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  const handleWeekChange = (direction: "prev" | "next") => {
    setCurrentWeek((prev) =>
      direction === "prev" ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
  };

  // if (loading || weeklyLogs.length < 1) return <Text>Loading...</Text>;
  if (weeklyLogs.length < 1) return null;

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View className="px-4 mx-4">
          <Header streak={userProfile?.streaks.on_going} />
        </View>
        <View className="px-4">
          <BodyProgress />
        </View>
        {/* <Divider /> */}
        <View className="flex-1 bg-white px-4">
          <View className="flex-row justify-between items-center mb-1">
            <TouchableOpacity
              onPress={() => handleWeekChange("prev")}
              className="p-2"
            >
              <ChevronLeft size={28} color="black" />
            </TouchableOpacity>
            <Text className="text-black font-bold text-xl">
              {format(weekStart, "MMM dd")} - {format(weekEnd, "MMM dd")}
            </Text>
            <TouchableOpacity
              onPress={() => handleWeekChange("next")}
              className="p-2"
            >
              <ChevronRight size={28} color="black" />
            </TouchableOpacity>
          </View>

          {/* <Text className="text-black font-bold text-lg m-2">Activity</Text>
          <View className="flex-row justify-between p-4 bg-gray-100 rounded-lg">
            {weeklyLogs.map((entry, index) => (
              <View key={index} className="items-center">
                <Text className="text-gray-600 text-sm">
                  {format(new Date(entry.date), "EEE")}
                </Text>
                <View
                  className={`w-8 h-8 rounded-full mt-2 ${
                    entry.burned > 0
                      ? "bg-newblue"
                      : "border border-gray-400 bg-white"
                  }`}
                />
              </View>
            ))}
          </View> */}

          <Text className="text-black font-bold text-lg m-2">
            Calories Trends
          </Text>
          <BarChart
            data={{
              labels: weeklyLogs.map((entry) =>
                format(new Date(entry.date), "EEE")
              ),
              datasets: [
                { data: weeklyLogs.map((entry) => entry.calories || 0) },
              ],
            }}
            width={screenWidth - 40}
            height={250}
            fromZero
            chartConfig={{
              backgroundGradientFrom: "#F5F5F5",
              backgroundGradientTo: "#F5F5F5",
              decimalPlaces: 0,
              color: () => "#847d3b",
              labelColor: () => "#555",
              barPercentage: 0.6,
              propsForBackgroundLines: {
                stroke: "#DDD",
                strokeDasharray: "4 4",
              },
            }}
            withInnerLines
            showBarTops={false}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />

          <Text className="text-black font-bold text-lg m-2">Weight Trend</Text>
          <LineChart
            data={{
              labels: weeklyLogs.map((entry) =>
                format(new Date(entry.date), "EEE")
              ),
              datasets: [
                { data: weeklyLogs.map((entry) => entry.weight || 0) },
              ],
            }}
            width={screenWidth - 40}
            height={200}
            yAxisSuffix="kg"
            fromZero
            chartConfig={{
              backgroundGradientFrom: "#F5F5F5",
              backgroundGradientTo: "#F5F5F5",
              decimalPlaces: 1,
              color: () => "#847d3b",
              labelColor: () => "#555",
              propsForDots: { r: "5", strokeWidth: "2", stroke: "#847d3b" },
              propsForBackgroundLines: {
                stroke: "#DDD",
                strokeDasharray: "4 4",
              },
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeeklyPage;
