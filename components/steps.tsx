// This is a full onboarding flow broken into 5 steps, each one wrapped under a single component with step navigation and shared state.
// You will need Tailwind support with NativeWind or equivalent and routing/navigation.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import WorkoutPicker from "./WorkoutPicket";
import { OnboardingForm } from "@/types/onboarding";
const steps = [
  "Basics",
  "Body Stats",
  "Lifestyle",
  "Eating Habits",
  "Preferences",
];

const countries = [
  "afghanistan",
  "albania",
  "algeria",
  "argentina",
  "australia",
  "austria",
  "bangladesh",
  "belgium",
  "brazil",
  "cambodia",
  "canada",
  "china",
  "denmark",
  "egypt",
  "finland",
  "france",
  "germany",
  "greece",
  "hong kong",
  "iceland",
  "india",
  "indonesia",
  "iran",
  "iraq",
  "ireland",
  "israel",
  "italy",
  "japan",
  "kazakhstan",
  "kenya",
  "laos",
  "malaysia",
  "mexico",
  "myanmar",
  "nepal",
  "netherlands",
  "new zealand",
  "nigeria",
  "norway",
  "pakistan",
  "philippines",
  "poland",
  "portugal",
  "russia",
  "saudi arabia",
  "singapore",
  "south africa",
  "south korea",
  "spain",
  "sri lanka",
  "sweden",
  "switzerland",
  "taiwan",
  "thailand",
  "turkey",
  "ukraine",
  "united arab emirates",
  "united kingdom",
  "united states of america",
  "vietnam",
];
export const StepBasics = ({
  form,
  handleInput,
}: {
  form: OnboardingForm;
  handleInput: (key: keyof OnboardingForm, value: any) => void;
}) => (
  <View>
    <Text className="text-lg font-bold text-newblue mb-2">Nickname</Text>
    <TextInput
      value={form.nickname}
      placeholder="Your nickname"
      onChangeText={(text) => handleInput("nickname", text)}
      className="bg-gray-100 p-3 rounded-lg mb-4"
    />
    <Text className="text-lg font-bold text-newblue mb-2">Goal</Text>
    <View className="flex-row justify-between gap-2 mb-4 ">
      {["lose weight", "gain weight", "eat healthy"].map((g) => (
        <TouchableOpacity
          key={g}
          className={`p-3 w-1/2 border rounded-lg items-center flex-1 ${
            form.primaryGoal === g
              ? "border-newblue bg-newblue/10"
              : "border-gray-300"
          }`}
          onPress={() => handleInput("primaryGoal", g)}
        >
          <Text className="capitalize text-gray-700">{g}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <Text className="text-lg font-bold text-newblue mb-2">Gender</Text>
    <View className="flex-row justify-between gap-2 mb-4">
      {["male", "female"].map((g) => (
        <TouchableOpacity
          key={g}
          className={`p-3 w-1/2 border rounded-lg items-center ${
            form.gender === g
              ? "border-newblue bg-newblue/10"
              : "border-gray-300"
          }`}
          onPress={() => handleInput("gender", g)}
        >
          <Text className="capitalize text-gray-700">{g}</Text>
        </TouchableOpacity>
      ))}
    </View>
    <Text className="text-lg font-bold text-newblue mb-2">Age</Text>
    <TextInput
      value={form.age}
      onChangeText={(text) => handleInput("age", text)}
      keyboardType="numeric"
      placeholder="28"
      className="bg-gray-100 p-3 rounded-lg"
    />
    {/* <Text className="text-lg font-bold text-newblue mt-2">Country</Text>
    <Text className="text-sm text-newblue mb-2">
      will affect recommendations*
    </Text>

    <ScrollView className="max-h-[300px] mb-4">
      {countries.map((country) => (
        <TouchableOpacity
          key={country}
          className={`p-3 border rounded-lg mb-2 ${
            form.country === country
              ? "border-newblue bg-newblue/10"
              : "border-gray-300"
          }`}
          onPress={() => handleInput("country", country)}
        >
          <Text className="capitalize text-gray-700">{country}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView> */}
  </View>
);
// Macronutrients Calculation (Used in completeOnboarding)

export const StepBodyStats = ({
  form,
  handleInput,
}: {
  form: OnboardingForm;
  handleInput: (key: keyof OnboardingForm, value: any) => void;
}) => (
  <View>
    <Text className="text-lg font-bold text-newblue mb-2">Height (cm)</Text>
    <TextInput
      value={form.height}
      onChangeText={(text) => handleInput("height", text)}
      keyboardType="numeric"
      placeholder="177"
      className="bg-gray-100 p-3 rounded-lg mb-4"
    />
    <Text className="text-lg font-bold text-newblue mb-2">
      Current Weight (kg)
    </Text>
    <TextInput
      value={form.weight}
      onChangeText={(text) => handleInput("weight", text)}
      keyboardType="numeric"
      placeholder="85"
      className="bg-gray-100 p-3 rounded-lg mb-4"
    />
    <Text className="text-lg font-bold text-newblue mb-2">
      Target Weight (kg)
    </Text>
    <TextInput
      value={form.targetWeight}
      onChangeText={(text) => handleInput("targetWeight", text)}
      keyboardType="numeric"
      placeholder="75"
      className="bg-gray-100 p-3 rounded-lg"
    />
    {form.weight && form.targetWeight && (
      <View className="mt-4 bg-newblue/10 p-4 rounded-lg">
        {(() => {
          const current = parseFloat(form.weight);
          const target = parseFloat(form.targetWeight);
          const diff = Math.max(current - target, 0);
          const minWeeks = Math.ceil(diff / 1);
          const maxWeeks = Math.ceil(diff / 0.5);

          if (diff === 0)
            return (
              <Text className="text-black">You’re already at your goal!</Text>
            );

          return (
            <Text className="text-black">
              At a healthy pace of 0.5–1 kg per week, reaching your goal of{" "}
              <Text className="font-bold">{target} kg</Text> from{" "}
              <Text className="font-bold">{current} kg</Text> could take{" "}
              <Text className="font-bold">
                {minWeeks}–{maxWeeks} weeks
              </Text>
              . Let's do this!
            </Text>
          );
        })()}
      </View>
    )}
  </View>
);
const lifestyle = {
  Chill: "You are doing 0 to 1 times of exercise per week",
  "Lightly Active": "You are doing 2 to 3 times of exercise per week",
  "Very Active": "You are doing 4 to 5 times of exercise per week",
};
export const StepLifestyle = ({
  form,
  handleInput,
}: {
  form: OnboardingForm;
  handleInput: (key: keyof OnboardingForm, value: any) => void;
}) => (
  <View>
    <Text className="text-lg font-bold text-newblue mb-2">Activity Level</Text>
    {["Chill", "Lightly Active", "Very Active"].map((level) => (
      <TouchableOpacity
        key={level}
        className={`p-3 border rounded-lg mb-2 ${
          form.activityLevel === level
            ? "border-newblue bg-newblue/10"
            : "border-gray-300"
        }`}
        onPress={() => handleInput("activityLevel", level)}
      >
        <Text className="text-gray-700">{level}</Text>
        <Text className="text-gray-700 text-sm">
          {lifestyle[level as keyof typeof lifestyle]}
        </Text>
      </TouchableOpacity>
    ))}
    {/* {["home", "running", "badminton"].map((w) => (
      <TouchableOpacity
        key={w}
        className={`p-3 border rounded-lg mb-2 ${
          form.preferredWorkouts.includes(w)
            ? "border-newblue bg-newblue/10"
            : "border-gray-300"
        }`}
        onPress={() => {
          const exists = form.preferredWorkouts.includes(w);
          const updated = exists
            ? form.preferredWorkouts.filter((i) => i !== w)
            : [...form.preferredWorkouts, w];
          handleInput("preferredWorkouts", updated);
        }}
      >
        <Text className="capitalize text-gray-700">{w}</Text>
      </TouchableOpacity>
    ))} */}
    <WorkoutPicker
      value={form.preferredWorkouts}
      onChange={(value) => handleInput("preferredWorkouts", value)}
    />
  </View>
);

export const StepEatingHabits = ({
  form,
  handleInput,
}: {
  form: OnboardingForm;
  handleInput: (key: keyof OnboardingForm, value: any) => void;
}) => (
  <View>
    <Text className="text-lg font-bold text-newblue mb-2">Eating Style</Text>
    {["delivery", "outside", "home cooked", "Mixed"].map((style) => (
      <TouchableOpacity
        key={style}
        className={`p-3 border rounded-lg mb-2 ${
          form.eatingStyle.includes(style)
            ? "border-newblue bg-newblue/10"
            : "border-gray-300"
        }`}
        onPress={() => {
          const exists = form.eatingStyle.includes(style);
          const updated = exists
            ? form.eatingStyle.filter((i) => i !== style)
            : [...form.eatingStyle, style];
          handleInput("eatingStyle", updated);
        }}
      >
        <Text className="capitalize text-gray-700">{style}</Text>
      </TouchableOpacity>
    ))}
    <Text className="text-lg font-bold text-newblue mt-4 mb-2">Diet Type</Text>
    {["normal", "vegetarian", "vegan", "keto", "other"].map((diet) => (
      <TouchableOpacity
        key={diet}
        className={`p-3 border rounded-lg mb-2 ${
          form.dietType === diet
            ? "border-newblue bg-newblue/10"
            : "border-gray-300"
        }`}
        onPress={() => handleInput("dietType", diet)}
      >
        <Text className="capitalize text-gray-700">{diet}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export const StepPreferences = ({
  form,
  handleInput,
}: {
  form: OnboardingForm;
  handleInput: (key: keyof OnboardingForm, value: any) => void;
}) => (
  <View>
    <Text className="text-lg font-bold text-newblue mb-2">Tone Preference</Text>
    {["supportive", "funny", "tough_love"].map((tone) => (
      <TouchableOpacity
        key={tone}
        className={`p-3 border rounded-lg mb-2 ${
          form.tone === tone
            ? "border-newblue bg-newblue/10"
            : "border-gray-300"
        }`}
        onPress={() => handleInput("tone", tone as any)}
      >
        <Text className="capitalize text-gray-700">
          {tone.replace("_", " ")}
        </Text>
      </TouchableOpacity>
    ))}

    {/* <Text className="text-lg font-bold text-newblue mt-4 mb-2">
      Meal Times (24h format)
    </Text>
    {Object.entries(form.mealTimes).map(([key, value]) => (
      <View key={key} className="mb-2">
        <Text className="text-gray-700 capitalize mb-1">{key}</Text>
        <TextInput
          value={value}
          onChangeText={(text) =>
            handleInput("mealTimes", { ...form.mealTimes, [key]: text })
          }
          placeholder="HH:MM"
          className="bg-gray-100 p-3 rounded-lg"
        />
      </View>
    ))} */}
  </View>
);

// 🧠 These step components are used in the main OnboardingScreen function in switch(step) calls.
