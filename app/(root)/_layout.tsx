import { Redirect, Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/lib/global-provider";
import { ActivityIndicator } from "react-native-paper";

export default function AppLayout() {
  const { loading, isLogged, userProfile } = useGlobalContext();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLogged) return;

    const checkOnboarding = async () => {
      try {
        // Check if user has required metrics (meaning they completed onboarding)
        const hasRequiredMetrics = Boolean(userProfile?.metrics?.bmi);
        console.log(
          "hasRequiredMetrics",
          userProfile,
          hasRequiredMetrics,
          "is logged",
          isLogged
        );
        if (hasRequiredMetrics) {
          // If user has metrics, they've completed onboarding
          await AsyncStorage.setItem("isOnboarded", "true");
          setIsOnboarded(true);
        } else {
          // If no metrics, check AsyncStorage as fallback
          const onboarded = await AsyncStorage.getItem("isOnboarded");
          setIsOnboarded(onboarded === "true");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsOnboarded(false);
      }
    };

    checkOnboarding();
  }, [isLogged, userProfile]);

  // Show loading state while checking
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

  if (!isOnboarded && userProfile) {
    return <Redirect href="/onboarding" />;
  }

  return <Slot />;
}
