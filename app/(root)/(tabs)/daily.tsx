import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { useGlobalContext } from "@/lib/global-provider";
import { updateProfile, logout } from "@/lib/firebase";
import {
  SafeAreaFrameContext,
  SafeAreaView,
} from "react-native-safe-area-context";
import AnimatedProgress from "@/components/food/Animated";
import Meallogs from "@/components/food/Meallogs";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Quotes from "@/components/Quotes";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/home/Header";
import Shortcuts from "@/components/home/Shortcuts";
import RecentActivityList from "@/components/activity/RecentActivityList";
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Life Group Dropdown */}
          <View className="px-6 my-4">
            <Header streak={userProfile.streaks.on_going} />
          </View>

          <WeeklySlider
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          {/* Horizontal Date Picker */}
          <View className="px-6 mt-3">
            <Text className="text-xl font-bold text-black">Today's Progress</Text>
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
