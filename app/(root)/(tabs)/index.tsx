import React from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
} from "react-native";
import Header from "@/components/home/Header";
import ExpBar from "@/components/home/ExpBar";
import DailyQuests from "@/components/home/DailyQuests";
import WeeklyQuests from "@/components/home/WeeklyQuests";
import HabitTracker from "@/components/home/Habits";
import { useGlobalContext } from "@/lib/global-provider";
import { ActivityIndicator } from "react-native-paper";

const HomeScreen = () => {
  const { user, userProfile, loading, date } = useGlobalContext();
  if (loading || !userProfile)
    return (
      // <SafeAreaView className="flex-1 bg-white">
      //   <ActivityIndicator size="large" color="newblue" />
      // </SafeAreaView>
      null
    );
  const { level_meta, streaks } = userProfile;
  const { level, experience, next_level } = level_meta;
  const { on_going } = streaks;

  const sections = [
    { id: "header", component: <Header streak={on_going} /> },
    {
      id: "expBar",
      component: <ExpBar level={level} exp={experience} maxExp={next_level} />,
    },

    {
      id: "habits",
      component: <HabitTracker />,
    },

    { id: "dailyQuests", component: <DailyQuests /> },
    // {
    //   id: "quotes",
    //   component: <StoicQuotes date={date} />,
    // },
    // { id: "dailyCalories", component: <DailyCalories /> },
    { id: "weeklyQuests", component: <WeeklyQuests /> },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className={`mt-4 ${
              [
                "header",
                "expBar",
                "habits",
                "dailyQuests",
                "weeklyQuests",
                "quotes",
              ].includes(item.id)
                ? "px-6"
                : ""
            }`}
          >
            {item.component}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
