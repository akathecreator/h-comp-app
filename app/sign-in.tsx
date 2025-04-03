import React, { useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { makeRedirectUri } from "expo-auth-session";
import {
  GoogleAuthProvider,
  OAuthCredential,
  signInWithCredential,
} from "firebase/auth";
import { useIdTokenAuthRequest as useGoogleIdTokenAuthRequest } from "expo-auth-session/providers/google";
import { auth } from "@/lib/firebase"; // Ensure Firebase is correctly set up
import { Redirect } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { signInWithEmailAndPassword } from "firebase/auth";
import { OnboardingSlider } from "@/components/auth/OnboardingSlider";
const Auth = () => {
  const { refetchUserProfile, loading, isLogged } = useGlobalContext();
  // Redirect if already logged in
  if (!loading && isLogged) return <Redirect href="/" />;

  // ✅ Correct client IDs for each platform
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  //   scopes: ["profile", "email"],
  //   redirectUri: makeRedirectUri({
  //     native:
  //       "com.googleusercontent.apps.491833149622-218tq9r1n71ooub7sq466scl07o8vijc:/oauthredirect", // Replace with your app’s iOS scheme
  //     scheme: "com.archbishop.c6companion",
  //     path: "oauthredirect",
  //   }),
  // });

  const [request, googleResponse, promptAsyncGoogle] =
    useGoogleIdTokenAuthRequest({
      selectAccount: true,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });

  // Handles the login via the Google Provider
  const handleLoginGoogle = async () => {
    await promptAsyncGoogle();
  };

  // Function that logs into firebase using the credentials from an OAuth provider
  const loginToFirebase = useCallback(async (credentials: OAuthCredential) => {
    const signInResponse = await signInWithCredential(auth, credentials);
  }, []);

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const credentials = GoogleAuthProvider.credential(
        googleResponse.params.id_token
      );
      loginToFirebase(credentials);
    }
  }, [googleResponse]);

  const signInWithEmail = async () => {
    try {
      // Login the user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        "gunpod@sasss.com",
        "12341234"
      );

      // The logged-in user
      const user = userCredential.user;

      console.log("User logged in successfully:", user);
      Alert.alert("Success", "You are now logged in!");

      // Refetch global context data
      refetchUserProfile();

      return user; // Return the user for further use
    } catch (error) {
      console.error("Login failed:", error);
      // Show error message
      return null;
    }
  };
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        {/* <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        /> */}
        <OnboardingSlider />

        <View className="px-10">
          <Text className="text-xl text-semibold text-center uppercase san text-black-300 mt-5">
            Hi! I’m Leafi, your health companion 🌱
          </Text>

          <Text className="text-lg san-bold text-black-300 text-center mt-4">
            Ready when you are!
          </Text>

          {/* <Text className="text-lg san text-black-200 text-center mt-4">
            Login to H-Companion with Google
          </Text> */}
          {/* handleLoginGoogle */}
          <TouchableOpacity
            disabled={!request}
            onPress={handleLoginGoogle}
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg san-medium text-black-300 ml-2">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;
