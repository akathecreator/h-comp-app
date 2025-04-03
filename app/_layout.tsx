import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect, useState, useRef } from "react";
import GlobalProvider from "@/lib/global-provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "NotoSansThai-Regular": require("../assets/fonts/NotoSansThai-Regular.ttf"),
    "NotoSansThai-Bold": require("../assets/fonts/NotoSansThai-Bold.ttf"),
    "NotoSansThai-Medium": require("../assets/fonts/NotoSansThai-Medium.ttf"),
    "NotoSansThai-SemiBold": require("../assets/fonts/NotoSansThai-SemiBold.ttf"),
    "NotoSansThai-Light": require("../assets/fonts/NotoSansThai-Light.ttf"),
    "NotoSansThai-ExtraBold": require("../assets/fonts/NotoSansThai-ExtraBold.ttf"),
    "NotoSansThai-Black": require("../assets/fonts/NotoSansThai-Black.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </GestureHandlerRootView>
    </GlobalProvider>
  );
}
