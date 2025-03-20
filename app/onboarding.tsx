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
import { Picker } from "@react-native-picker/picker"; // Correct Picker import
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendOnboardingData } from "@/lib/chat";
import { useGlobalContext } from "@/lib/global-provider";
export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [form, setForm] = useState({
    nickname: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
    healthGoals: "",
  });
  // Function to check if all fields are filled
  const isFormComplete = () => {
    return Object.values(form).every((value) => value !== "" && value !== null);
  };

  const completeOnboarding = async () => {
    if (!isFormComplete()) {
      Alert.alert("Missing Fields", "Please fill in all the required fields.");
      return;
    }

    const uid = user?.uid;
    if (!uid) {
      Alert.alert("Error", "User ID not found.");
      return;
    }

    const onboardingData = {
      nickname: form.nickname,
      gender: form.gender,
      age: form.age,
      height: form.height,
      weight: form.weight,
      activityLevel: form.activityLevel,
      healthGoals: form.healthGoals,
    };

    await sendOnboardingData(uid, onboardingData);

    await AsyncStorage.setItem("isOnboarded", "true"); // Mark onboarding as complete
    router.replace("/"); // Redirect user to home
  };

  const handleSelect = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 px-6 py-1 bg-white">
          <Text className="text-2xl font-bold mb-4 text-newblue">
            Tell us about yourself
          </Text>
          <Text className="text-gray-600 mb-6">
            We'll use this information to personalize your experience
          </Text>
          <Text className="text-lg font-bold text-newblue mb-2">Nickname</Text>
          <TextInput
            placeholder="Enter your nickname"
            value={form.nickname}
            onChangeText={(text) => handleSelect("nickname", text)}
            className="mb-4 p-3 bg-gray-100 rounded-lg w-full text-gray-800 "
          />
          <Text className="text-lg font-bold text-newblue mb-2">Gender</Text>
          {/* Gender Selection */}
          <View className="flex-row justify-between mb-4 gap-2">
            {["Male", "Female", "Other"].map((gender) => (
              <TouchableOpacity
                key={gender}
                className={`p-3 w-1/3 border rounded-lg items-center ${
                  form.gender === gender
                    ? "border-newblue bg-newblue/10"
                    : "border-gray-300"
                }`}
                onPress={() => handleSelect("gender", gender)}
              >
                <Text className="text-gray-700">{gender}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Age */}
          <Text className="text-lg font-bold text-newblue mb-2">Age</Text>
          <TextInput
            placeholder="Enter your age"
            keyboardType="numeric"
            value={form.age}
            onChangeText={(text) => handleSelect("age", text)}
            className="mb-4 p-3 bg-gray-100 rounded-lg w-full text-gray-800"
          />

          {/* Height */}
          <Text className="text-lg font-bold text-newblue mb-2">Height</Text>
          <View className="flex-row mb-4 items-center">
            <TextInput
              placeholder="Enter your height"
              keyboardType="numeric"
              value={form.height}
              onChangeText={(text) => handleSelect("height", text)}
              className="flex-1 p-3 bg-gray-100 rounded-lg text-gray-800 mr-2"
            />
            <Text className="text-gray-600">cm</Text>
          </View>

          {/* Weight */}
          <Text className="text-lg font-bold text-newblue mb-2">Weight</Text>
          <View className="flex-row mb-4 items-center">
            <TextInput
              placeholder="Enter your weight"
              keyboardType="numeric"
              value={form.weight}
              onChangeText={(text) => handleSelect("weight", text)}
              className="flex-1 p-3 bg-gray-100 rounded-lg text-gray-800 mr-2"
            />
            <Text className="text-gray-600">kg</Text>
          </View>

          <Text className="text-lg font-bold text-newblue mb-2">
            Activity Level
          </Text>
          {/* Activity Level */}
          <View className="">
            {/* Act Selection */}
            <View className="flex-row justify-between mb-4 gap-2">
              {["Chill", "Lightly Active", "Very Active"].map((activityLevel) => (
                <TouchableOpacity
                  key={activityLevel}
                  className={`p-3 w-1/3 border rounded-lg items-center ${
                    form.activityLevel === activityLevel
                      ? "border-newblue bg-newblue/10"
                      : "border-gray-300"
                  }`}
                  onPress={() => handleSelect("activityLevel", activityLevel)}
                >
                  <Text className="text-gray-700">{activityLevel}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text className="text-lg font-bold text-newblue mb-2">
            Health Goals
          </Text>
          <TextInput
            placeholder="Enter your health goals"
            value={form.healthGoals}
            onChangeText={(text) => handleSelect("healthGoals", text)}
            className="mb-4 p-3 bg-gray-100 rounded-lg w-full text-gray-800"
          />
          {/* Submit Button */}
          <TouchableOpacity
            onPress={completeOnboarding}
            className="p-4 bg-newblue rounded-xl items-center mt-5"
          >
            <Text className="text-white font-bold">Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
