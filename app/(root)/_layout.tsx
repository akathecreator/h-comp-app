import { Redirect, Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { useGlobalContext } from "@/lib/global-provider";
import { ActivityIndicator } from "react-native-paper";

export default function AppLayout() {
  const { loading, isLogged } = useGlobalContext();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkOnboarding = async () => {
      // await AsyncStorage.setItem("isOnboarded", "true"); // Mark onboarding as complete
      const onboarded = await AsyncStorage.getItem("isOnboarded");
      setIsOnboarded(onboarded === "true"); // Convert string to boolean
    };

    checkOnboarding();
  }, []);

  if (loading || isOnboarded === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#333" />
      </SafeAreaView>
    );
  }

  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});