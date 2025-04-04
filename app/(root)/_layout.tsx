import { Redirect, Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/lib/global-provider";
import { ActivityIndicator } from "react-native-paper";

export default function AppLayout() {
  const { loading, isLogged, userProfile } = useGlobalContext();
  const [isOnboarded_, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLogged && !userProfile) return;

    const checkOnboarding = async () => {
      try {
        // Check if user has required metrics (meaning they completed onboarding)
        console.log("hasRequiredMetrics", userProfile, "is logged", isLogged);
        if (userProfile?.isOnboarded) {
          // If user has metrics, they've completed onboarding
          setIsOnboarded(true);
        } else {
          // If no metrics, check AsyncStorage as fallback
          setIsOnboarded(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsOnboarded(false);
      }
    };

    checkOnboarding();
  }, [isLogged, userProfile]);

  // Show loading state while checking
  if (loading || !userProfile) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

  if (isLogged && userProfile && !userProfile?.isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Slot />;
}
