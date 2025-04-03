// This is a full onboarding flow broken into 5 steps, each one wrapped under a single component with step navigation and shared state.
// You will need Tailwind support with NativeWind or equivalent and routing/navigation.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ProgressBar } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { sendOnboardingData } from "@/lib/chat";
import { saveOnboardingData } from "@/lib/onboarding";
import {
  registerForPushNotificationsAsync,
  savePushTokenToUser,
} from "@/lib/noti";
import { useGlobalContext } from "@/lib/global-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StepBasics,
  StepBodyStats,
  StepLifestyle,
  StepEatingHabits,
  StepPreferences,
} from "@/components/steps";

import { OnboardingForm } from "@/types/onboarding";

const defaultForm: OnboardingForm = {
  nickname: "",
  gender: "male",
  age: "",
  height: "",
  weight: "",
  targetWeight: "",
  activityLevel: "Lightly Active",
  dietType: "normal",
  eatingStyle: [],
  preferredWorkouts: [],
  tone: "funny",
  country: "thailand",
  mealTimes: {
    breakfast: "07:30",
    lunch: "12:30",
    dinner: "19:00",
  },
  primaryGoal: "lose weight",
};

const steps = [
  "Basics",
  "Body Stats",
  "Lifestyle",
  "Eating Habits",
  "Preferences",
];
const calculateMacros = (calories: number, isSuggested = true) => {
  const pct = isSuggested
    ? { protein: 0.3, carbs: 0.4, fats: 0.3 }
    : { protein: 0.25, carbs: 0.5, fats: 0.25 };

  return {
    protein_g: Math.round((calories * pct.protein) / 4),
    carbs_g: Math.round((calories * pct.carbs) / 4),
    fats_g: Math.round((calories * pct.fats) / 9),
  };
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleInput = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const calculateDerivedMetrics = () => {
    const weight = parseFloat(form.weight);
    const targetWeight = parseFloat(form.targetWeight);
    const height = parseFloat(form.height);
    const age = parseInt(form.age);
    const gender = form.gender.toLowerCase();
    const heightM = height / 100;
    const bmi = +(weight / (heightM * heightM)).toFixed(1);
    const bmiCategory =
      bmi < 18.5
        ? "underweight"
        : bmi < 25
        ? "normal"
        : bmi < 30
        ? "overweight"
        : "obese";
    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    const activityMultiplier =
      form.activityLevel === "Very Active"
        ? 1.55
        : form.activityLevel === "Lightly Active"
        ? 1.375
        : 1.2;
    const tdee = bmr * activityMultiplier;
    const calorieTarget = tdee - 500;

    return {
      bmi,
      bmi_category: bmiCategory,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calorie_target: Math.round(calorieTarget),
      last_calculated: new Date(),
    };
  };

  const completeOnboarding = async () => {
    const uid = user?.uid;
    if (!uid) return Alert.alert("User not found");

    const metrics = calculateDerivedMetrics();
    const onboardingData = {
      nickname: form.nickname,
      age: parseInt(form.age),
      gender: form.gender,
      goals: {
        primary_goal: form.primaryGoal,
        target_weight_kg: parseFloat(form.targetWeight),
        current_weight_kg: parseFloat(form.weight),
        height_cm: parseFloat(form.height),
      },
      diet: {
        eating_style: form.eatingStyle,
        diet_type: form.dietType,
        diet_type_custom: "",
        disliked_foods: [],
        allergies: [],
        meal_times: form.mealTimes,
      },
      activity: {
        activity_level: form.activityLevel.toLowerCase(),
        preferred_workouts: form.preferredWorkouts,
        limitations: [],
      },
      personalization: {
        tone: form.tone,
        language: "th",
        country: form.country,
        suggestive_preference: "I want meal plans",
      },
      notifications: {
        reminder_times: ["morning", "evening"],
        reminder_types: ["meals", "water", "workouts"],
      },
      metrics: {
        ...metrics,
        last_calculated: new Date(),
      },
      daily_calories: {
        goal: metrics.calorie_target,
        maintenance: metrics.tdee,
      },
      macronutrients: {
        max: { carbs_g: 180, fats_g: 70, protein_g: 170 },
        suggested: { carbs_g: 280, fats_g: 87, protein_g: 135 },
      },
      streaks: {
        on_going: 0,
        consecutive_days: 0,
      },
    };
    const maintenance = metrics.tdee;
    const goal =
      form.primaryGoal === "lose weight"
        ? metrics.calorie_target - 500
        : form.primaryGoal === "gain weight"
        ? metrics.calorie_target + 500
        : metrics.calorie_target;
    onboardingData.macronutrients.max = calculateMacros(goal, true);
    onboardingData.macronutrients.suggested = calculateMacros(
      maintenance,
      false
    );
    setLoading(true);
    // await sendOnboardingData(uid, onboardingData);
    const token = await registerForPushNotificationsAsync();
    if (token) await savePushTokenToUser(token);
    await AsyncStorage.setItem("isOnboarded", "true");
    await AsyncStorage.setItem("onboardingStatus", "completed");
    // Simulate upload and progress (skip API for now)
    let currentProgress = 0;
    const duration = 5000; // 5 seconds
    const interval = 100; // update every 100ms
    const increment = interval / duration;

    const progressInterval = setInterval(() => {
      currentProgress += increment;
      setProgress(currentProgress);
      if (currentProgress >= 1) {
        clearInterval(progressInterval);
        setLoading(false);
        router.replace("/");
      }
    }, interval);
    saveOnboardingData(onboardingData, uid).catch((error) => {
      console.error("Error saving onboarding data:", error);
      // Optionally handle error
    });
    // setLoading(false);
    // router.replace("/");
  };
  const stepComponents = [
    <StepBasics form={form as any} handleInput={handleInput} key="step-1" />,
    <StepBodyStats form={form as any} handleInput={handleInput} key="step-2" />,
    <StepLifestyle form={form as any} handleInput={handleInput} key="step-3" />,
    <StepEatingHabits
      form={form as any}
      handleInput={handleInput}
      key="step-4"
    />,
    <StepPreferences
      form={form as any}
      handleInput={handleInput}
      key="step-5"
    />,
  ];
  // const StepComponent = () => {
  //   switch (step) {
  //     case 0:
  //       return <StepBasics form={form as any} handleInput={handleInput} />;
  //     case 1:
  //       return <StepBodyStats form={form as any} handleInput={handleInput} />;
  //     case 2:
  //       return <StepLifestyle form={form as any} handleInput={handleInput} />;
  //     case 3:
  //       return <StepEatingHabits form={form as any} handleInput={handleInput} />;
  //     case 4:
  //       return <StepPreferences form={form as any} handleInput={handleInput} />;
  //   }
  // };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView>
        <View className="px-6 py-4">
          <Text className="text-xl font-semibold text-newblue mb-2">
            Step {step + 1} of {steps.length} — {steps[step]}
          </Text>
          <ProgressBar
            progress={(step + 1) / steps.length}
            color="#594715"
            className="mb-4 h-2 rounded-full"
          />

          {stepComponents[step]}

          <View className="flex-row justify-between mt-8">
            {step > 0 && (
              <TouchableOpacity
                onPress={() => setStep(step - 1)}
                className="bg-gray-200 p-4 rounded-lg w-1/2 mr-2 flex-1"
              >
                <Text className="text-center">Back</Text>
              </TouchableOpacity>
            )}
            {step < steps.length - 1 ? (
              <TouchableOpacity
                onPress={() => setStep(step + 1)}
                className="bg-newblue p-4 rounded-lg w-full flex-1"
              >
                <Text className="text-white text-center font-semibold">
                  Next
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={completeOnboarding}
                className="bg-newblue p-4 rounded-lg w-full flex-1"
              >
                <Text className="text-white text-center font-semibold">
                  Finish
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
      {loading && (
        <View className="absolute inset-0 bg-black/40 justify-center items-center z-50">
          <View className="bg-white p-6 rounded-xl w-64 items-center shadow-lg">
            <ProgressBar
              progress={progress}
              color="#4F46E5" // This is your 'newblue' hex
              style={{ width: 200, height: 12, borderRadius: 6 }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ⚠️ To complete the setup, implement and import the components:
// StepBasics, StepBodyStats, StepLifestyle, StepEatingHabits, StepPreferences
// Each of them should accept `form` and `handleInput` props and return input fields for that step.

// If you'd like, I can now generate the components for each step, with fields and styling ready to use.
