import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
const TermsScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-6">
        {/* 🔙 Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-4"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-black mb-4">Terms of Use</Text>

        <Text className="text-base text-gray-800 mb-4">
          Welcome to our health companion app ("Leafi"). By accessing or using
          our App, you agree to be bound by these Terms of Use ("Terms"). If you
          do not agree to these Terms, please do not use the App.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          1. Use of the App
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          The App is intended to help users track their health and wellness
          habits. It is not a substitute for professional medical advice. Always
          consult with a healthcare provider before making any changes to your
          diet or exercise routines.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          2. User Accounts
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          You are responsible for maintaining the confidentiality of your login
          credentials and all activities that occur under your account. We may
          terminate or suspend your access if you misuse the app or violate
          these Terms.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          3. Data & Privacy
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          We collect and use your personal data as described in our Privacy
          Policy. By using the App, you consent to our data practices.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          4. Content
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          Any content you submit to the App (such as meal logs, goals, or
          feedback) remains yours, but you grant us a license to use it to
          provide and improve the App.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          5. Limitation of Liability
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          We do our best to provide accurate and helpful guidance, but we are
          not liable for any health outcomes based on your use of the App.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          6. Changes to Terms
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          We may update these Terms from time to time. Continued use of the App
          after changes means you accept the new Terms.
        </Text>

        <Text className="text-lg font-semibold text-black mt-4 mb-2">
          7. Contact
        </Text>
        <Text className="text-base text-gray-800 mb-4">
          If you have any questions about these Terms, please contact us at
          labsarchangel@gmail.com.
        </Text>

        <Text className="text-sm text-gray-500 mt-6">
          Last updated: April 12, 2025
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsScreen;
