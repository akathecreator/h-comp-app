import React, { useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, router } from "expo-router";
import { useIdTokenAuthRequest as useGoogleIdTokenAuthRequest } from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { OnboardingSlider } from "@/components/auth/OnboardingSlider";
import icons from "@/constants/icons";
import * as AppleAuthentication from "expo-apple-authentication";
import { OAuthProvider } from "firebase/auth";

const signInWithApple = async () => {
  try {
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    console.log("✅ Apple Sign-In success:", appleCredential);
    AppleAuthentication.isAvailableAsync().then(console.log);
    alert(JSON.stringify(appleCredential, null, 2));
    const { identityToken, nonce } = appleCredential;

    if (!identityToken) throw new Error("Missing identity token");

    const provider = new OAuthProvider("apple.com");
    const credential = provider.credential({
      idToken: identityToken,
      rawNonce: nonce,
    });

    await signInWithCredential(auth, credential);
    // refetchUserProfile();
  } catch (error) {
    console.log("Full Apple login error:", JSON.stringify(error, null, 2));
    // alert("Apple Sign-In failed: " + error?.message ?? error);
  }
};
const { width, height } = Dimensions.get("window");

const Auth = () => {
  const { refetchUserProfile, loading, isLogged } = useGlobalContext();

  const [request, googleResponse, promptAsyncGoogle] =
    useGoogleIdTokenAuthRequest({
      selectAccount: true,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });

  const player = useVideoPlayer(
    require("@/assets/videos/signin.mp4"),
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const credentials = GoogleAuthProvider.credential(
        googleResponse.params.id_token
      );
      signInWithCredential(auth, credentials);
    }
  }, [googleResponse]);

  const signInWithEmail = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        "gunpod@leafi.ai",
        "12341234"
      );
      refetchUserProfile();
      // alert("Logged in");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (!loading && isLogged) return <Redirect href="/" />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 🎥 Background Video */}
      <VideoView
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      {/* 🔲 Optional: overlay for readability */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(0, 0, 0, 0.4)" },
        ]}
      />

      {/* 🌱 Foreground content */}
      <View style={styles.overlay}>
        <OnboardingSlider />

        <View className="px-10 mt-4">
          <Text className="text-xl text-center font-semibold text-white mt-5 font-sans-bold">
            I’m Leafi, your food companion 🌱
          </Text>
          {/* <Text className="text-lg text-center font-bold text-white mt-4 font-sans-bold">
            Ready when you are! 🌱
          </Text> */}
          {/* onPress={signInWithEmail} */}
          {/* onPress={() => promptAsyncGoogle()} */}
          <TouchableOpacity
            disabled={!request}
            onPress={() => promptAsyncGoogle()}
            className="bg-black shadow-md  rounded-full w-full py-4 mt-5"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg ml-2 text-white font-medium">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!request}
            onPress={() => signInWithApple()}
            className="bg-black shadow-md  rounded-full w-full py-4 mt-5"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.apple}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg ml-2 text-white font-medium">
                Continue with Apple
              </Text>
            </View>
          </TouchableOpacity>
          {/* 👇 Disclaimer */}
          <View className="mt-4 px-10">
            <Text className="text-center text-white text-xs">
              By continuing, you agree to our{" "}
              <Text
                className="underline"
                onPress={() => router.push("/legal/terms")}
              >
                Terms of Use
              </Text>{" "}
              and{" "}
              <Text
                className="underline"
                onPress={() => router.push("/legal/privacy")}
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "relative",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 20,
  },
});

export default Auth;
