import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView } from "react-native";
import { useGlobalContext } from "@/lib/global-provider";

import Quotes from "@/components/Quotes";
import Header from "@/components/home/Header";
// import RecentActivityList from "@/components/activity/RecentActivityList";
import RecentLogs from "@/components/food/RecentLogs";
import CaloriesTracker from "@/components/food/AnimatedGen2";
import WeeklySlider from "@/components/food/Weekly";
import dayjs from "dayjs";
import "dayjs/locale/en";

const Dashboard = () => {
  const { date, setDate, lifeGroup, setLifeGroup, user } = useGlobalContext();
  const { userProfile } = useGlobalContext();
  // const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf("day"));
  // Function to move date forward/backward
  const changeDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
  };
  if (!userProfile) return null;
  return (
    <KeyboardAvoidingView className="flex-1 h-full pt-16">
      <View className="flex-1">
        <ScrollView style={{ flexGrow: 1 }}>
          {/* Life Group Dropdown */}
          <View className="px-6 my">
            <Header streak={userProfile.streaks.on_going} />
          </View>

          <WeeklySlider
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          {/* Horizontal Date Picker */}
          <View className="px-6 mt-3">
            <Text className="text-xl font-bold text-black">
              Today's Progress
            </Text>
          </View>
          {/* <AnimatedProgress date={selectedDate} /> */}
          <CaloriesTracker date={selectedDate} />
          <Quotes date={date} />
          <RecentLogs date={selectedDate} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Dashboard;
