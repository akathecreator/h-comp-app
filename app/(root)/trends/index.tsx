import CaloricTrends from "@/components/CaloricTrends";
import Macronutrients from "@/components/Macronutrients";
import WeightGraph from "@/components/WeightGraph";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { LineChart, BarChart, ProgressChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

const StatsPage = () => {
  const [selectedGraph, setSelectedGraph] = useState<"calories" | "weight">(
    "calories"
  );

  return (
    // <SafeAreaView className="flex-1 bg-bone">
    //   <ScrollView>
    //     <View className="p-6 bg-bone-dark rounded-b-3xl shadow-md">
    //       <Text className="text-black font-rubik-bold text-3xl">Stats</Text>
    //     </View>

    //     {/* Graph Display */}
    //     <View className="mt-6 px-6">
    //       <CaloricTrends />
    //       <WeightGraph />
    //       {/* <Macronutrients /> */}
    //       {/* {selectedGraph === "calories" ? <CaloricTrends /> : <WeightGraph />} */}
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
    <SafeAreaView className="flex-1 bg-bone">
      <ScrollView>
        {/* Header with Back Button */}
        <View className="p-6 bg-bone-dark rounded-b-3xl shadow-md flex-row items-center">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.replace("/")}
            className="mr-4"
          >
            <Text className="text-neon text-lg">← Track</Text>
          </TouchableOpacity>
        </View>
        

        {/* Graph Display */}
        <View className="mt-6 px-6">
          <CaloricTrends />
          <WeightGraph />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsPage;
