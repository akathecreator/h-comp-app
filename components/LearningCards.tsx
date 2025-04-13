import { useGlobalContext } from "@/lib/global-provider";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
} from "react-native";
import Markdown from "react-native-markdown-display";

const mockTips = {
  "0": [
    {
      title: "Start With a Small Calorie Deficit",
      content: `Aim for a daily calorie deficit of 300–500 kcal. This helps you lose fat without feeling deprived.`,
    },
    {
      title: "Track What You Eat",
      content: `Let Leafi know about all your meals. Awareness is the first step to change.`,
    },
    {
      title: "Focus on Protein First",
      content: `Eating more protein helps preserve muscle while losing weight and keeps you fuller longer.`,
    },
    {
      title: "Hydration is Key",
      content: `Drink water before meals. Sometimes thirst is mistaken for hunger.`,
    },
  ],
  "1": [
    {
      title: "Build a Simple Routine",
      content: `Consistency beats perfection. Create a meal and workout routine you can actually stick to.`,
    },
    {
      title: "Don't Drink Your Calories",
      content: `Avoid sugary drinks, juices, and high-calorie coffees. Opt for water, tea, or black coffee.`,
    },
    {
      title: "Eat More Fiber",
      content: `Fiber-rich foods like veggies, oats, and legumes help with satiety and digestion.`,
    },
    {
      title: "Watch Portion Sizes",
      content: `Even healthy food can lead to weight gain if eaten in large quantities. Use smaller plates!`,
    },
  ],
  "2": [
    {
      title: "Move More During the Day",
      content: `Take stairs, walk between tasks, or stretch. Non-exercise activity helps boost daily burn.`,
    },
    {
      title: " Plan Meals Ahead",
      content: `Meal prepping reduces the chance of grabbing something unhealthy when you're busy.`,
    },
    {
      title: " Don't Skip Meals",
      content: `Skipping meals can lead to overeating later. Instead, focus on balanced meals.`,
    },
    {
      title: " Practice Mindful Eating",
      content: `Eat slowly, without distractions. This helps you notice when you're full.`,
    },
  ],
  "3": [
    {
      title: " Prioritize Sleep",
      content: `Lack of sleep messes with hunger hormones and cravings. Aim for 7–9 hours a night.`,
    },
    {
      title: " Reduce Late-Night Snacking",
      content: `Brush your teeth after dinner or drink herbal tea to avoid unnecessary snacking.`,
    },
    {
      title: " Focus on Whole Foods",
      content: `Minimize processed foods. Whole foods are more filling and nutritious.`,
    },
    {
      title: " Weigh Yourself Weekly",
      content: `Track trends, not daily fluctuations. Once a week under the same conditions is enough.`,
    },
  ],
  "4": [
    {
      title: " Add Strength Training",
      content: `Muscle burns more calories at rest. Strength training supports long-term fat loss.`,
    },
    {
      title: " Don’t Fear Healthy Fats",
      content: `Avocados, nuts, and olive oil can keep you satisfied longer. Balance is key.`,
    },
    {
      title: " Be Aware of Liquid Calories",
      content: `Smoothies and healthy drinks still have calories. Count them!`,
    },
    {
      title: " Set Process Goals",
      content: `Instead of “lose 5kg,” aim for “walk 30 min daily.” Focus on actions, not just outcomes.`,
    },
  ],
  "5": [
    {
      title: " Celebrate Non-Scale Wins",
      content: `Better sleep? More energy? Clothes fitting better? All great signs of progress.`,
    },
    {
      title: " Watch Out for Weekend Overeating",
      content: `One weekend binge can undo a week of progress. Plan your treats mindfully.`,
    },
    {
      title: " Use the 80/20 Rule",
      content: `80% nutritious, 20% enjoyment. This keeps you sane and consistent.`,
    },
    {
      title: " Don’t Compare Yourself to Others",
      content: `Everyone’s body and pace is different. Focus on your own progress.`,
    },
  ],
  "6": [
    {
      title: " Meal Timing Isn’t Everything",
      content: `Calories in vs. out matters more than when you eat. Focus on consistency.`,
    },
    {
      title: " Make It Fun",
      content: `Dance, hike, join a class — find movement you actually enjoy.`,
    },
    {
      title: " Be Kind to Yourself",
      content: `One off day doesn't ruin your progress. Get back on track the next meal.`,
    },
    {
      title: " Track Your Mood with Food",
      content: `Emotional eating is real. Note how foods make you feel — physically and mentally.`,
    },
  ],
};

const { width } = Dimensions.get("window");
import * as Haptics from "expo-haptics";
export default function LearningCard() {
  const [index, setIndex] = useState(0);
  const { userProfile } = useGlobalContext();
  const streak = userProfile?.streaks.on_going.toString() || "0";
  const learningTip = mockTips[streak as keyof typeof mockTips][index];

  const handleNext = () => {
    if (index < mockTips[streak as keyof typeof mockTips].length - 1) {
      setIndex(index + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleBack = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <View className="relative bottom-8 w-full items-center mt-4">
      <View
        className="bg-white rounded-2xl shadow-lg p-6 mx-4"
        style={{ width: width * 0.9, elevation: 5 }}
      >
        {/* Navigation */}

        <Text className="text-lg font-bold mb-2">{learningTip.title}</Text>
        <ScrollView className="min-h-[80px]">
          <Markdown
            style={{
              body: { fontSize: 15, color: "#000", fontFamily: "sans" },
              strong: { fontWeight: "bold" },
              em: { fontStyle: "italic" },
            }}
          >
            {learningTip.content}
          </Markdown>

          {/* <Markdown
            style={{
              body: { fontSize: 16, color: "#333" },
              strong: { fontWeight: "bold" },
              em: { fontStyle: "italic" },
            }}
          >
            {learningTip.content}
          </Markdown> */}
        </ScrollView>
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="py-2 rounded-xl"
            disabled={index === 0}
            onPress={handleBack}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={index === 0 ? "white" : "black"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="py-2 rounded-xl"
            disabled={
              index === mockTips[streak as keyof typeof mockTips].length - 1
            }
            onPress={handleNext}
          >
            <Ionicons
              name="arrow-forward"
              size={24}
              color={
                index === mockTips[streak as keyof typeof mockTips].length - 1
                  ? "white"
                  : "black"
              }
            />
          </TouchableOpacity>
        </View>
        {/* Interest Buttons */}
        {/* <View className="flex-row justify-between mt-4">
          <TouchableOpacity className=" rounded-xl px-4 py-2">
            <Text className="text-black font-medium">Interested</Text>
          </TouchableOpacity>
          <TouchableOpacity className=" rounded-xl px-4 py-2">
            <Text className="text-black font-medium">Not Interested</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
}
