import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { format, subWeeks, addWeeks, addDays, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { ScrollView } from "react-native-gesture-handler";

import Header from "@/components/home/Header";
import BodyProgress from "@/components/weekly/BodyProgress";
import { useGlobalContext } from "@/lib/global-provider";
import useWeeklyLogs from "@/hooks/useWeeklyData";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#F5F5F5",
  backgroundGradientTo: "#F5F5F5",
  decimalPlaces: 0,
  color: () => "#847d3b",
  labelColor: () => "#555",
  propsForBackgroundLines: {
    stroke: "#DDD",
    strokeDasharray: "4 4",
  },
};

const WeeklyPage = () => {
  const { user, userProfile } = useGlobalContext();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { weeklyLogs } = useWeeklyLogs(user?.uid, currentWeek);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  const handleWeekChange = (direction: "prev" | "next") => {
    setCurrentWeek((prev) =>
      direction === "prev" ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
  };

  if (weeklyLogs.length < 1) return null;

  const labels = weeklyLogs.map((entry) => format(new Date(entry.date), "EEE"));
  const caloriesData = weeklyLogs.map((entry) => entry.calories || 0);
  const weightData = weeklyLogs.map((entry) => entry.weight || 0);

  return (
    <KeyboardAvoidingView className="flex-1 h-full pt-16 bg-white">
      <View className="px-6 my-1">
        <Header streak={userProfile?.streaks.on_going ?? 0} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <View className="px-4">
          <BodyProgress />
        </View>

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

          <Text className="text-black font-bold text-lg m-2">
            Calories Trends
          </Text>
          <BarChart
            data={{ labels, datasets: [{ data: caloriesData }] }}
            width={screenWidth - 40}
            height={250}
            fromZero
            showBarTops={false}
            withInnerLines
            chartConfig={{ ...chartConfig, barPercentage: 0.6 }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />

          <Text className="text-black font-bold text-lg m-2">Weight Trend</Text>
          <LineChart
            data={{ labels, datasets: [{ data: weightData }] }}
            width={screenWidth - 40}
            height={200}
            yAxisSuffix="kg"
            fromZero
            bezier
            chartConfig={{
              ...chartConfig,
              decimalPlaces: 1,
              propsForDots: { r: "5", strokeWidth: "2", stroke: "#847d3b" },
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default WeeklyPage;
