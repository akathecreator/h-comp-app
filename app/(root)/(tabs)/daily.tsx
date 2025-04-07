import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useGlobalContext } from "@/lib/global-provider";
import { Ionicons } from "@expo/vector-icons";
import Quotes from "@/components/Quotes";
import Header from "@/components/home/Header";
import RecentLogs from "@/components/food/RecentLogs";
import CaloriesTracker from "@/components/food/AnimatedGen2";
import WeeklySlider from "@/components/food/Weekly";
import MealSuggestions from "@/components/food/MealSuggestions";
import QuickLogBox from "@/components/food/QuickLogBox";
import dayjs from "dayjs";
import "dayjs/locale/en";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import MissedLogBox from "@/components/food/MissedLogBox";
const Dashboard = () => {
  const { date, setDate, lifeGroup, setLifeGroup, user } = useGlobalContext();
  const { userProfile } = useGlobalContext();
  const router = useRouter();
  const isToday = dayjs(date).isSame(dayjs(), "day");
  if (!userProfile) return null;

  const handleInfoPress = () => {
    router.push("/metrics"); // Adjust path if inside a folder like /app/(tabs)
  };
  return (
    <KeyboardAvoidingView className="flex-1 h-full pt-16">
      <View className="px-6 my-1">
        <Header streak={userProfile.streaks.on_going} />
      </View>
      <View className="flex-1">
        <ScrollView style={{ flexGrow: 1 }}>
          <WeeklySlider
            selectedDate={dayjs(date)}
            setSelectedDate={(dayjsDate) => setDate(dayjsDate.toDate())}
          />

          <View className="px-6 mt-3 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-black">
              Today's Progress
            </Text>
          </View>
          <CaloriesTracker date={date} />
          <MissedLogBox date={date} />

          {/* Small Chat Input Box */}
          {/* <MealSuggestions date={date} /> */}

          {/* <Quotes date={date} /> */}
          <RecentLogs date={date} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Dashboard;
