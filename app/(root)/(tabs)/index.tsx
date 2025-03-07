import React from "react";
import { SafeAreaView, FlatList, View } from "react-native";
import Header from "@/components/home/Header";
import ExpBar from "@/components/home/ExpBar";
import StreakTracker from "@/components/home/StreakTracker";
import Achievements from "@/components/home/Achievements";
import DailyQuests from "@/components/home/DailyQuests";
import WeeklyQuests from "@/components/home/WeeklyQuests";
import { useGlobalContext } from "@/lib/global-provider";

const HomeScreen = () => {
  const { user, userProfile } = useGlobalContext();
  console.log(user, userProfile);
  const { level_meta, streaks } = userProfile;
  const { level, experience, next_level } = level_meta;
  const { on_going } = streaks;
  const sections = [
    { id: "header", component: <Header streak={on_going} /> },
    {
      id: "expBar",
      component: <ExpBar level={level} exp={experience} maxExp={next_level} />,
    },
    // {
    //   id: "streakTracker",
    //   component: (
    //     <StreakTracker
    //       logs={[
    //         streaks[0],
    //         streaks[1],
    //         streaks[2],
    //         streaks[3],
    //         streaks[4],
    //         streaks[5],
    //         streaks[6],
    //       ]}
    //     />
    //   ),
    // },
    { id: "dailyQuests", component: <DailyQuests /> },
    { id: "weeklyQuests", component: <WeeklyQuests /> },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-6 mt-4">{item.component}</View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
