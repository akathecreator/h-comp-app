import { Redirect, Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/lib/global-provider";
import { ActivityIndicator } from "react-native-paper";

export default function AppLayout() {
  const { loading, isLogged, userProfile } = useGlobalContext();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  // Check onboarding status once user is loaded
  useEffect(() => {
    if (!loading && isLogged && userProfile) {
      const checkOnboarding = async () => {
        try {
          // If user has completed onboarding
          if (userProfile?.isOnboarded) {
            setIsOnboarded(true);
          } else {
            setIsOnboarded(false);
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          setIsOnboarded(false);
        }
      };

      checkOnboarding();
    }
  }, [loading, isLogged, userProfile]);

  // Show loading indicator while auth or onboarding check is happening
  if (loading || isOnboarded === null) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect unauthenticated users
  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

  // Redirect onboard-incomplete users
  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  // Show main app
  return <Slot />;
}