import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getCaloricData } from "@/lib/firebase";
import { useGlobalContext } from "@/lib/global-provider";
import { format, subDays } from "date-fns";

const CaloricTrends: React.FC = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [caloriesData, setCaloriesData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<{ date: string; calories: number } | null>(null);

  const { userProfile, user } = useGlobalContext();
  const screenWidth = Dimensions.get("window").width;

  if (!user) return null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCaloricData(user?.uid);

        const dates: string[] = [];
        const calories: number[] = [];

        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          const formattedDate = format(date, "MM/dd");
          dates.push(formattedDate);
          const dayData = data.find((d) => d.date === formattedDate);
          calories.push(dayData?.calories || 0);
        }

        setLabels(dates);
        setCaloriesData(calories);
      } catch (err) {
        console.error("Error fetching caloric data:", err);
        setError("Failed to fetch caloric data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid]);

  if (!userProfile) return null;
  const { daily_calories } = userProfile;
  const { goal, maintenance } = daily_calories;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black min-h-[400px]">
        <ActivityIndicator size="large" color="#A0A0A0" />
        <Text className="text-gray-400">Loading caloric trends...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-red-400">{error}</Text>
      </View>
    );
  }

  const handleDataPointClick = (dataIndex: number) => {
    setSelectedData({
      date: labels[dataIndex],
      calories: caloriesData[dataIndex],
    });
  };

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-white san-bold text-xl mb-4">Daily Caloric Intake</Text>

      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: caloriesData,
              color: () => "#FFFFFF", // White for caloric intake
              strokeWidth: 2,
            },
            {
              data: Array(caloriesData.length).fill(goal),
              color: () => "#A0A0A0", // Light grey for goal
              strokeWidth: 2,
            },
            {
              data: Array(caloriesData.length).fill(maintenance),
              color: () => "#555555", // Dark grey for max limit
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth - 40}
        height={260}
        fromZero
        chartConfig={{
          backgroundGradientFrom: "#000000",
          backgroundGradientTo: "#000000",
          decimalPlaces: 0,
          color: () => `#FFFFFF`,
          labelColor: () => `#A0A0A0`,
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#FFFFFF",
          },
          propsForBackgroundLines: {
            stroke: "#333333",
            strokeDasharray: "4 4",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        onDataPointClick={({ index }) => handleDataPointClick(index)}
      />

      {selectedData && (
        <View className="mt-4 p-4 rounded-lg bg-gray-800 bg-opacity-80 shadow-lg">
          <Text className="text-gray-400 text-lg">📅 {selectedData.date}</Text>
          <Text className="text-white text-lg">🔥 {selectedData.calories} kcal</Text>
        </View>
      )}

      <View className="flex-row justify-between mt-4">
        <Text className="text-gray-500">Goal: {goal} kcal</Text>
        <Text className="text-gray-500">Max: {maintenance} kcal</Text>
      </View>
    </View>
  );
};

export default CaloricTrends;