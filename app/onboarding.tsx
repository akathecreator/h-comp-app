import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Correct Picker import
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendOnboardingData } from "@/lib/chat";
import { useGlobalContext } from "@/lib/global-provider";
import { ProgressBar } from "react-native-paper";
import { sendForMoreGoals } from "@/lib/chat";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, userProfile } = useGlobalContext();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
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
  // useEffect(() => {
  //   setLoading(true); // Show loading screen
  //   setProgress(0.2);
  // }, []);

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
    sendForMoreGoals(user.uid, "daily");
    sendForMoreGoals(user.uid, "weekly");
    setLoading(true); // Show loading screen
    setProgress(0.0); // Start progress from 0

    const onboardingData = {
      nickname: form.nickname,
      gender: form.gender,
      age: form.age,
      height: form.height,
      weight: form.weight,
      activityLevel: form.activityLevel,
      healthGoals: form.healthGoals,
    };
    // Progress animation loop (increments every 100ms for a smooth effect)
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 0.01; // Increase smoothly
      setProgress(currentProgress);
      if (currentProgress >= 0.9) {
        clearInterval(interval); // Stop before 100%, final step is manual
      }
    }, 100); // Updates every 100ms (total ~9 seconds)

    await sendOnboardingData(uid, onboardingData);
    clearInterval(interval); // Ensure interval stops when the function completes
    setProgress(1.0); // Ensure it reaches 100%

    await AsyncStorage.setItem("isOnboarded", "true"); // Mark onboarding as complete
    // router.replace("/"); // Redirect user to home
    setTimeout(() => {
      setLoading(false); // Hide loading screen
      router.replace("/"); // Redirect user to home
    }, 500); // Small delay for smooth transition
  };

  const handleSelect = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        enableOnAndroid={true} // 👈 Makes sure it works on Android
        extraHeight={150} // 👈 Pushes content up when keyboard is open
        extraScrollHeight={100} // 👈 Prevents overlap
        keyboardShouldPersistTaps="handled" // 👈 Dismisses keyboard on tap outside
      >
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
              {["Chill", "Lightly Active", "Very Active"].map(
                (activityLevel) => (
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
                )
              )}
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
      </KeyboardAwareScrollView>
      {/* Loading Screen */}
      <Modal transparent visible={loading} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Personalizing your experience...
            </Text>
            <ProgressBar
              progress={progress}
              color="#4F46E5"
              style={{ height: 10, borderRadius: 5 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
