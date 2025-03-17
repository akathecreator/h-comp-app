import { View, Text } from "react-native";
import React from "react";
import { BarChart } from "lucide-react-native";
import { useGlobalContext } from "@/lib/global-provider";
import { format, addWeeks } from "date-fns";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
const CalTrends = ({ weeklyData }: { weeklyData: any }) => {
  const labels = weeklyData.map((entry: any) =>
    format(new Date(entry.date), "EEE")
  );
  const caloriesConsumed = weeklyData.map((entry: any) => entry.calories || 0);
  const caloriesBurned = weeklyData.map((entry: any) => entry.burned || 0);
  const sleepHours = weeklyData.map((entry: any) => entry.sleep || 0);
  const weightTrend = weeklyData.map((entry: any) => entry.weight || null);

  return (
    <>
      <Text className="text-black font-bold text-lg mb-2">Calories</Text>
      <BarChart
        data={{
          labels,
          datasets: [
            { data: caloriesConsumed, color: () => "#666", strokeWidth: 2 }, // Gray - Calories Consumed
            { data: caloriesBurned, color: () => "#333", strokeWidth: 2 }, // Dark Gray - Calories Burned
            { data: sleepHours, color: () => "#999", strokeWidth: 2 }, // Light Gray - Sleep Hours
          ],
        }}
        width={screenWidth - 40}
        height={250}
        fromZero
        chartConfig={{
          backgroundGradientFrom: "#F5F5F5",
          backgroundGradientTo: "#F5F5F5",
          decimalPlaces: 0,
          color: () => "#333",
          labelColor: () => "#555",
          barPercentage: 0.5, // Slightly reduce bar width for better spacing
          propsForBackgroundLines: { stroke: "#DDD", strokeDasharray: "4 4" },
        }}
        withInnerLines={true}
        showBarTops={false}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </>
  );
};

export default CalTrends;
