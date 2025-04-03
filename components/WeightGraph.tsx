import { useEffect, useState, useMemo } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useWindowDimensions } from "react-native";
import { fetchWeightData } from "@/lib/firebase";
import { useGlobalContext } from "@/lib/global-provider";

interface WeightData {
  timestamp: Date; // Ensure this is already converted to a Date object
  weight: number;
}

export default function WeightGraph() {
  const [weightData, setWeightData] = useState<WeightData[]>([]);
  const [loading, setLoading] = useState(true);
  const { width: screenWidth } = useWindowDimensions();
  const { user } = useGlobalContext();

  useEffect(() => {
    const loadWeightData = async () => {
      try {
        if (!user?.uid) return;

        const data = await fetchWeightData(user.uid);

        if (!Array.isArray(data)) {
          console.error("Invalid weight data:", data);
          return;
        }

        const validData = data
          .filter((item) => item.weight !== undefined && item.timestamp)
          .map((item) => ({
            weight: isNaN(item.weight) || !isFinite(item.weight) ? 0 : item.weight,
            timestamp: new Date(item.timestamp), // Convert timestamp to Date
          }));

        setWeightData(validData);
      } catch (error) {
        console.error("Error loading weight data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWeightData();
  }, [user?.uid]);

  // Memoized labels and data for better performance
  const chartData = useMemo(() => {
    const labels = weightData.map((item) =>
      item.timestamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );
    const weights = weightData.map((item) => item.weight);
    return { labels, weights };
  }, [weightData]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6C757D" />
        <Text>Loading weight trends...</Text>
      </View>
    );
  }

  if (!chartData.labels.length || !chartData.weights.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No weight data available to display.</Text>
      </View>
    );
  }

  return (
    <>
      <Text className="text-black san-bold text-xl mb-4">
        Weight Trends
      </Text>
      <LineChart
        data={{
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.weights,
              color: () => "#6C757D",
            },
          ],
        }}
        width={screenWidth > 0 ? screenWidth - 40 : 300} // Fallback width
        height={260}
        chartConfig={{
          backgroundColor: "#F4F2ED",
          backgroundGradientFrom: "#E8E4D9",
          backgroundGradientTo: "#D6D1C4",
          decimalPlaces: 1,
          color: () => `#6C757D`,
          labelColor: () => `#666876`,
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </>
  );
}