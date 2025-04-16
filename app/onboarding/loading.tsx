import { useEvent, useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { saveOnboardingData } from "@/lib/onboarding";
import {
  registerForPushNotificationsAsync,
  savePushTokenToUser,
} from "@/lib/noti";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

export default function OnboardingLoadingScreen() {
  const router = useRouter();
  const { uid, data } = useLocalSearchParams<{ uid: string; data: string }>();
  const onboardingData = JSON.parse(decodeURIComponent(data));

  const showPaywallThenRoute = async () => {
    try {
      const result = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "Pro", // your actual entitlement ID
        displayCloseButton: false,
      });

      switch (result) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          // ✅ User has access
          router.replace("/");
          break;

        case PAYWALL_RESULT.CANCELLED:
        case PAYWALL_RESULT.NOT_PRESENTED:
          // ❌ User skipped, block or send to limited screen
          router.replace("/onboarding/locked"); // or show blocked state
          break;

        default:
          // fallback
          router.replace("/onboarding/locked");
          break;
      }
    } catch (error) {
      console.warn("Paywall failed to present:", error);
      router.replace("/onboarding/locked");
    }
  };

  const player = useVideoPlayer(
    require("@/assets/videos/onboarding.mp4"),
    (p) => {
      p.loop = false;
      p.play();
    }
  );

  // ✅ Save onboarding data in background
  useEffect(() => {
    const saveEverything = async () => {
      try {
        await saveOnboardingData(onboardingData, uid);
        const token = await registerForPushNotificationsAsync();
        if (token) await savePushTokenToUser(token);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        // router.replace("../paywall");
        // router.replace("/");
        await showPaywallThenRoute();
      } catch (e) {
        console.error("Error saving onboarding:", e);
        router.replace("/");
      }
    };

    saveEverything();
  }, []);
  const { status, error } = useEvent(player, "statusChange", {
    status: player.status,
  });
  useEventListener(player, "statusChange", ({ status, error }) => {});

  // // ✅ Smooth transition after video ends
  // useEvent(player, "timeUpdate", () => {
  //   if (player.duration && player.currentTime >= player.duration) {
  //     router.replace("/");
  //   }
  // });

  return (
    <View style={StyleSheet.absoluteFill}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(0,0,0,0.3)" },
        ]}
      />
    </View>
  );
}
