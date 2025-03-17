import { View, Text } from "react-native";
import React from "react";
import { LineChart } from "lucide-react-native";
import { Dimensions } from "react-native";
import { format } from "date-fns";
const screenWidth = Dimensions.get("window").width;

const WeightTrends = ({ weeklyData }: { weeklyData: any }) => {
  const labels = weeklyData.map((entry: any) =>
    format(new Date(entry.date), "EEE")
  );
  const weightTrend = weeklyData.map((entry: any) => entry.weight || null);
  return (
    <>
      <Text className="text-black font-bold text-lg mt-6 mb-2">
        Weight Trend
      </Text>
      <LineChart
        data={{
          labels,
          datasets: [
            { data: weightTrend.map((w) => w ?? 0), color: () => "#000" },
          ], // Black line for weight
        }}
        width={screenWidth - 40}
        height={200}
        yAxisSuffix="kg"
        fromZero
        yAxisInterval={5} // Reduces extreme jumps
        chartConfig={{
          backgroundGradientFrom: "#F5F5F5",
          backgroundGradientTo: "#F5F5F5",
          decimalPlaces: 1,
          color: () => "#000",
          labelColor: () => "#555",
          propsForDots: { r: "5", strokeWidth: "2", stroke: "#000" }, // Black Dots
          propsForBackgroundLines: { stroke: "#DDD", strokeDasharray: "4 4" },
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </>
  );
};

export default WeightTrends;
