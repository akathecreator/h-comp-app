import React, { useEffect } from "react";
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
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Ensure Firebase is correctly set up
import { Redirect } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { signInWithEmailAndPassword } from "firebase/auth";

const Auth = () => {
  const { refetch, loading, isLogged } = useGlobalContext();

  // Redirect if already logged in
  if (!loading && isLogged) return <Redirect href="/" />;

  // ✅ Correct client IDs for each platform
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    scopes: ["profile", "email"],
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  const login = async () => {
    try {
      console.log("Initiating Google login...");
      const result = await promptAsync();
      console.log("Prompt async result:", result);

      if (result.type === "success" && result.authentication) {
        const { idToken } = result.authentication;
        console.log("Google ID Token:", idToken);

        // ✅ Now sign in with Firebase
        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);
        console.log("Firebase user:", userCredential.user);

        // Refresh context after login
        refetch();
      } else {
        console.error("Login cancelled or failed:", result);
        Alert.alert("Error", "Google login was cancelled or failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "An error occurred during Google login.");
    }
  };

  useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      login();
    }
  }, [response]);
  const signInWithEmail = async () => {
    try {
      // Login the user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        "g.lertkom@gmail.com",
        "12341234"
      );

      // The logged-in user
      const user = userCredential.user;

      console.log("User logged in successfully:", user);
      Alert.alert("Success", "You are now logged in!");

      // Refetch global context data
      refetch();

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
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />

        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome To H-Companion
          </Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You Closer To {"\n"}
            <Text className="text-primary-300">Your Ideal Health Goals</Text>
          </Text>

          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            Login to H-Companion with Google
          </Text>

          <TouchableOpacity
            disabled={!request}
            onPress={signInWithEmail}
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik-medium text-black-300 ml-2">
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
