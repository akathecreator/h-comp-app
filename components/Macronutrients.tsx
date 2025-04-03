import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";
import { useGlobalContext } from "@/lib/global-provider";
import { getMacronutrientData } from "@/lib/firebase"; // Function defined above
import { format, subDays } from "date-fns";

const screenWidth = Dimensions.get("window").width;

const Macronutrients: React.FC = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    legend: ["Protein", "Carbs", "Fats"],
    data: [],
    barColors: ["#4CAF50", "#2196F3", "#FF9800"], // Green for Protein, Blue for Carbs, Orange for Fats
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useGlobalContext();

  if (!user) return null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch macronutrient data
        const data = await getMacronutrientData(user?.uid);

        // Prepare the last 7 days
        const labels: string[] = [];
        const macronutrientSegments: number[][] = [];

        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          const formattedDate = format(date, "MM/dd");
          labels.push(formattedDate);

          // Find matching data for the day
          const dayData = data.find((d) => d.date === formattedDate);

          // Populate segments for the chart
          macronutrientSegments.push([
            dayData?.protein || 0,
            dayData?.carbs || 0,
            dayData?.fats || 0,
          ]);
        }

        setChartData({
          labels,
          legend: ["Protein", "Carbs", "Fats"],
          data: macronutrientSegments,
          barColors: ["#4CAF50", "#2196F3", "#FF9800"],
        });
      } catch (err) {
        console.error("Error fetching macronutrient data:", err);
        setError("Failed to fetch macronutrient data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#C4A484" />
        <Text>Loading macronutrient data...</Text>
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

  return (
    <View>
      <Text className="text-black san-bold text-xl mb-4">
        Daily Macronutrient Intake
      </Text>
      <View className="flex-row justify-around mt-2">
        <Text style={{ color: "#4CAF50" }}>● Protein</Text>
        <Text style={{ color: "#2196F3" }}>● Carbs</Text>
        <Text style={{ color: "#FF9800" }}>● Fats</Text>
      </View>

      <StackedBarChart
        data={chartData}
        width={screenWidth - 40}
        height={300}
        chartConfig={{
          backgroundColor: "#FFFFFF",
          backgroundGradientFrom: "#F0F0F0",
          backgroundGradientTo: "#E0E0E0",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        hideLegend
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default Macronutrients;
