import React from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import Header from "@/components/home/Header";
import ExpBar from "@/components/home/ExpBar";
import DailyQuests from "@/components/home/DailyQuests";
import WeeklyQuests from "@/components/home/WeeklyQuests";
import HabitTracker from "@/components/home/Habits";
import DynamicHabitTracker from "@/components/home/WaterTracker";
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
  const { nickname, goals, metrics, daily_calories, macronutrients, activity } =
    userProfile;
  const { streaks } = userProfile;
  // const { level, experience, next_level } = level_meta;
  const { on_going } = streaks;

  const sections = [
    { id: "header", component: <Header streak={on_going} /> },
    // {
    //   id: "expBar",
    //   component: <ExpBar level={level} exp={experience} maxExp={next_level} />,
    // },

    // {
    //   id: "habits",
    //   component: <HabitTracker />,
    // },

    {
      id: "water",
      component: <DynamicHabitTracker />,
    },

    // { id: "dailyQuests", component: <DailyQuests /> },
    // {
    //   id: "quotes",
    //   component: <StoicQuotes date={date} />,
    // },
    // { id: "dailyCalories", component: <DailyCalories /> },
    // { id: "weeklyQuests", component: <WeeklyQuests /> },
  ];

  const weightLossKg = goals.current_weight_kg - goals.target_weight_kg;
  const kcalPerKg = 7700;
  const totalCaloriesToBurn = weightLossKg * kcalPerKg;
  const avgDailyDeficit = metrics.tdee - metrics.calorie_target;
  const daysToGoal = Math.ceil(totalCaloriesToBurn / avgDailyDeficit);
  const estimatedWeeks = Math.ceil(daysToGoal / 7);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-6 bg-white">
        {/* <Text className="text-2xl font-bold text-newblue mb-4">
          👋 สวัสดี {nickname}! นี่คือแผนสุขภาพของคุณ
        </Text> */}
        <Header streak={on_going} />

        {/* GOAL SUMMARY */}
        <View className="mb-4 mt-4 bg-newblue rounded-lg p-6">
          <Text className="font-sans text-lg text-white font-semibold">
            เป้าหมายของคุณ
          </Text>
          <Text className="text-white mt-1 font-sans">
            คุณต้องการลดน้ำหนัก{" "}
            <Text className="font-bold">{weightLossKg} กก.</Text> (จาก{" "}
            {goals.current_weight_kg} กก. เหลือ {goals.target_weight_kg} กก.)
          </Text>
          <Text className="text-white mt-1 font-sans">
            จากเป้าหมายพลังงานแคลอรี่ต่อวันของคุณ คาดว่าจะใช้เวลา{" "}
            <Text className="font-bold">~{estimatedWeeks} สัปดาห์</Text>{" "}
            หากคุณทำอย่างสม่ำเสมอ
          </Text>
        </View>
        <View className="bg-black rounded-lg p-6 ">
          {/* CALORIE PLAN */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-white">
              แผนแคลอรี่รายวัน
            </Text>
            <Text className="text-white mt-1 font-sans">
              พลังงานที่ร่างกายคุณใช้ขณะพัก (BMR):{" "}
              <Text className="font-bold">{metrics.bmr} kcal</Text>
            </Text>
            <Text className="text-white mt-1 font-sans">
              พลังงานที่ใช้ทั้งหมดต่อวัน (TDEE):{" "}
              <Text className="font-bold">{metrics.tdee} kcal</Text>
            </Text>
            <Text className="text-white mt-1 font-sans">
              หากต้องการลดน้ำหนัก คุณควรบริโภคประมาณ{" "}
              <Text className="font-bold">
                {metrics.calorie_target} kcal/วัน
              </Text>
            </Text>
          </View>

          {/* MACRONUTRIENT PLAN */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-white font-sans">
              สารอาหารหลัก (เพื่อลดน้ำหนัก)
            </Text>
            <Text className="text-white mt-1 font-sans">
              โปรตีน: {macronutrients.max.protein_g} กรัม
            </Text>
            <Text className="text-white font-sans">
              ไขมัน: {macronutrients.max.fats_g} กรัม
            </Text>
            <Text className="text-white font-sans">
              คาร์บ: {macronutrients.max.carbs_g} กรัม
            </Text>
          </View>

          {/* HEALTH METRICS */}
          <View className="mb-6">
            <Text className="text-lg text-white font-semibold">
              สถิติของคุณตอนนี้
            </Text>
            <Text className="text-white mt-1 font-sans">
              BMI: {metrics.bmi} ({metrics.bmi_category})
            </Text>
            <Text className="text-white font-sans">
              ระดับกิจกรรม: {activity.activity_level}
            </Text>
          </View>
        </View>
        {/* TIPS SECTION */}
        <View className="mb-8 mt-4 rounded-lg p-6 bg-newblue">
          <Text className="text-lg text-white font-semibold">
            💡 เคล็ดลับวันนี้
          </Text>
          <Text className="text-white mt-1 font-sans">
            หากต้องกินข้างนอก ให้เลือกอาหารที่เน้นโปรตีน เช่น เนื้อย่าง
            และหลีกเลี่ยงน้ำหวานจะดีที่สุด
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
