import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex-row items-center mb-4 ml-4"
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        {/* <Text className="ml-2 text-base text-black font-medium">Back</Text> */}
      </TouchableOpacity>
      <ScrollView className="p-6">
        <Text className="text-2xl font-bold text-black mb-4">
          Privacy Policy
        </Text>

        <Text className="text-base text-gray-800 mb-4">
          This Privacy Policy explains how we collect, use, and protect your
          personal information when you use our health companion app ("Leafi").
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          1. Information We Collect
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          We collect information you provide, including your nickname, age,
          gender, weight, height, health goals, meal logs, and activity
          preferences. We may also collect analytics data and device information
          to improve the app experience.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          2. How We Use Your Data
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          Your data is used to personalize your health recommendations, set
          reminders, track progress, and improve app performance. We do not sell
          your personal data to third parties.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          3. Data Storage
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          All data is securely stored and managed using industry-standard
          services and encryption where applicable. We strive to protect your
          personal information at all times.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          4. Sharing Information
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          We only share anonymized or aggregated data for research, analytics,
          or product improvements. We will never share identifiable information
          without your explicit consent.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          5. Your Rights
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          You may access, update, or delete your personal information at any
          time through the app. You may also request full deletion of your
          account and data by contacting us.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          6. Children’s Privacy
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          Our app is not intended for users under the age of 13. We do not
          knowingly collect data from children without parental consent.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          7. Changes to This Policy
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          We may update this policy as needed. We encourage you to review it
          regularly to stay informed about how we are protecting your data.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          8. Contact Us
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          If you have any questions or concerns about this Privacy Policy,
          please contact us at labsarchangel@gmail.com.
        </Text>

        <Text className="text-sm text-gray-500 mt-6">
          Last updated: April 12, 2025
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;
