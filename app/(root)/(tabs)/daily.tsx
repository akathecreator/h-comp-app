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

const Dashboard = () => {
  const { date, setDate, lifeGroup, setLifeGroup, user } = useGlobalContext();
  const { userProfile } = useGlobalContext();
  

  if (!userProfile) return null;
  return (
    <KeyboardAvoidingView className="flex-1 h-full pt-16">
      <View className="flex-1">
        <ScrollView style={{ flexGrow: 1 }}>
          <View className="px-6 my">
            <Header streak={userProfile.streaks.on_going} />
          </View>

          <WeeklySlider
            selectedDate={dayjs(date)}
            setSelectedDate={(dayjsDate) => setDate(dayjsDate.toDate())}
          />

          <View className="px-6 mt-3">
            <Text className="text-xl font-bold text-black">
              Today's Progress
            </Text>
          </View>

          <CaloriesTracker date={date} />

          {/* Small Chat Input Box */}
          <QuickLogBox date={date} />
          <MealSuggestions date={date} />

          <Quotes date={date} />
          <RecentLogs date={date} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Dashboard;
