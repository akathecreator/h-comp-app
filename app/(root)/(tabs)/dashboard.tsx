import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useGlobalContext } from "@/lib/global-provider";
import { updateProfile, logout } from "@/lib/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedProgress from "@/components/Animated";
import Meallogs from "@/components/Meallogs";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Quotes from "@/components/Quotes";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/home/Header";
const lifeGroups = ["Health", "Finance", "Gym", "Habits"];

const Dashboard = () => {
  const { date, setDate, lifeGroup, setLifeGroup, user } = useGlobalContext();
  const { userProfile } = useGlobalContext();
  // const [showDropdown, setShowDropdown] = useState(false);

  // Function to move date forward/backward
  const changeDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
  };
  if (!userProfile) return null;
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Life Group Dropdown */}
          <View className="px-6 my-4">
            <Header streak={userProfile.streaks.on_going} />
          </View>

          {/* Horizontal Date Picker */}
          <View className="mb-4 flex-row items-center justify-between">
            {/* Backward Button */}
            <TouchableOpacity
              className="px-4 py-2 rounded-lg"
              onPress={() => changeDate(-1)}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Date Display */}
            <Text className="text-black text-xl font-bold">
              {date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>

            {/* Forward Button */}
            <TouchableOpacity
              className="px-4 py-2  rounded-lg"
              onPress={() => changeDate(1)}
            >
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <AnimatedProgress date={date} />
          <Quotes date={date}/>
          <Meallogs date={date} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
