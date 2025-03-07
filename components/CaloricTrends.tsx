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

  const { userProfile, user } = useGlobalContext();
  const screenWidth = Dimensions.get("window").width;

  if (!user) return null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch caloric data
        const data = await getCaloricData(user?.uid);

        // Prepare the last 7 days
        const dates: string[] = [];
        const calories: number[] = [];

        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          const formattedDate = format(date, "MM/dd");
          dates.push(formattedDate);

          // Find matching data for the day
          const dayData = data.find((d) => d.date === formattedDate);

          // Push calories or 0 if no data
          calories.push(dayData?.calories || 0);
        }

        setLabels(dates);
        setCaloriesData(calories);
      } catch (err) {
        console.error("Error fetching caloric data:", err);
        setError("Failed to fetch caloric data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid]);

  if (!userProfile) return null;

  const { daily_calories } = userProfile;
  const { goal, maintenance } = daily_calories;
  const [selectedData, setSelectedData] = useState<{ date: string; calories: number } | null>(null);
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center min-h[400px]">
        <ActivityIndicator size="large" color="#C4A484" />
        <Text>Loading caloric trends...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-black">{error}</Text>
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
    <View className="flex-1">
      <Text className="text-black font-rubik-bold text-xl mb-4">
        Daily Caloric Intake
      </Text>
      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: caloriesData,
              color: () => "#FF8C00",
              strokeWidth: 2,
            },
            {
              data: Array(caloriesData.length).fill(goal),
              color: () => "#32CD32",
              strokeWidth: 2,
            },
            {
              data: Array(caloriesData.length).fill(maintenance),
              color: () => "#FF4500",
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth - 40}
        height={260}
        fromZero
        chartConfig={{
          backgroundColor: "#F4F2ED",
          backgroundGradientFrom: "#E8E4D9",
          backgroundGradientTo: "#D6D1C4",
          decimalPlaces: 0,
          color: () => `#333333`,
          labelColor: () => `#333333`,
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
          propsForBackgroundLines: {
            stroke: "#E0E0E0",
            strokeDasharray: "",
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
        <View className="mt-4 p-2 bg-gray-200 rounded">
          <Text>Date: {selectedData.date}</Text>
          <Text>Calories: {selectedData.calories} kcal</Text>
        </View>
      )}
      <View className="flex-row justify-between mt-4">
        <Text className="text-black">Suggested: {goal} kcal</Text>
        <Text className="text-black">Max: {maintenance} kcal</Text>
      </View>
    </View>
  );
};

export default CaloricTrends;
