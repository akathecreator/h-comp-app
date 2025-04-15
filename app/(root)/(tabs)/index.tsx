import MealSuggestions from "@/components/food/MealSuggestions";
import Header from "@/components/home/Header";
import { useGlobalContext } from "@/lib/global-provider";
import { isToday } from "date-fns";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import LearningCard from "@/components/LearningCards";
import { findAMatch } from "@/lib/log-service";
import { Alert } from "react-native";
import { router } from "expo-router";

export default function HomePage() {
  const [activeTrack, setActiveTrack] = useState("Lose Weight");
  const { userProfile, user } = useGlobalContext();
  const [mealModal, setMealModal] = useState(false);
  const [offerings, setOfferings] = useState<any>(null);

  const manageFindMatch = async () => {
    if (!user?.uid) return;
    await findAMatch(user?.uid);
  };
  if (!userProfile) return null;
  router.push({
    pathname: "/onboarding/loading",
    params: {
      uid: user?.uid,
      data: encodeURIComponent(JSON.stringify(userProfile)),
    },
  });
  return (
    <KeyboardAvoidingView className="flex-1 h-full pt-16">
      <View className="px-6 my-1">
        <Header streak={userProfile?.streaks.on_going} />
      </View>

      <ScrollView className="pt-2 px-6">
        {/* <Text className="text-2xl font-bold mb-4">Empowerment Hub</Text> */}

        {/* Section 1: What's Happening Now */}

        {/* Section 2: 30 Days to a Better You */}
        {/* <View className="mb-6">
          <Text className="text-xl font-semibold mb-2">Today's Insight</Text>
          <TouchableOpacity
            className="bg-blue-100 rounded-xl p-4"
            onPress={() => alert(learningTip.content)}
          >
            <Text className="font-semibold mb-1">{learningTip.title}</Text>
            <View className="flex-row justify-between mt-3">
              <TouchableOpacity className="bg-green-500 rounded px-3 py-1">
                <Text className="text-white">Interested</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-red-500 rounded px-3 py-1">
                <Text className="text-white">Not Interested</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View> */}
        {/* 
        <View className="mb-6 my-4">
          <Text className="text-xl font-semibold mb-2">
            Community Exemplary
          </Text>
        </View> */}
        <View className="mb-6 my-4">
          <Text className="text-xl font-bold mb-2 text-earthseaweed ">
            30 Days To a Better You
          </Text>
        </View>
        <LearningCard />

        {/* Section 3: Meal Ideas */}
        {/* <View className="mb-6">
          <Text className="text-xl font-semibold mb-2">Meal Ideas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockedFeedMeals.map((meal) => (
              <View
                key={meal.id}
                className="bg-gray-100 rounded-xl p-3 mr-4 items-center"
              >
                <Image
                  source={{ uri: meal.image }}
                  className="w-40 h-40 rounded-lg"
                />
                <Text className="mt-2 font-semibold">{meal.title}</Text>
                <Text className="text-sm text-gray-600">
                  {meal.calories} kcal
                </Text>
              </View>
            ))}
          </ScrollView>
        </View> */}
        {/* Section 4: Accountability Match */}
        <View className="mb-4">
          <TouchableOpacity className="w-full" onPress={manageFindMatch}>
            <View
              className="border border-dotted border-[#A3A3A3] rounded-xl overflow-hidden"
              style={{ aspectRatio: 2.4 }} // Keeps it nicely rectangular
            >
              <ImageBackground
                source={require("@/assets/images/together.png")}
                className="flex-1 items-center justify-center"
                imageStyle={{ borderRadius: 12 }}
              >
                {userProfile && userProfile?.find_match == false ? (
                  <Text className="text-white font-semibold text-md bg-black/50 px-4 py-2 rounded-md">
                    Find an Accountability Buddy
                  </Text>
                ) : (
                  <Text className="text-white font-semibold text-md bg-black/50 px-4 py-2 rounded-md">
                    We're finding you the right match...
                  </Text>
                )}
              </ImageBackground>
            </View>
          </TouchableOpacity>
        </View>

        <MealSuggestions date={new Date()} />

        {/* Meal Modal */}
        <Modal visible={mealModal} transparent animationType="slide">
          <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
            <View className="bg-white rounded-xl p-6 w-10/12">
              <Text className="text-xl font-semibold mb-2">
                Thai Chicken Salad Recipe
              </Text>
              <Text className="text-gray-600 mb-4">
                Step by step recipe breakdown goes here...
              </Text>
              <TouchableOpacity
                className="bg-green-500 py-2 rounded-xl"
                onPress={() => setMealModal(false)}
              >
                <Text className="text-white text-center font-semibold">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* <View className="mb-10">
          <Text className="text-xl font-semibold mb-2">
            Accountability Buddy
          </Text>
          <TouchableOpacity
            className="bg-purple-500 py-2 rounded-xl"
            onPress={() =>
              alert(
                "We will match you with someone with similar goals and set a friendly competition!"
              )
            }
          >
            <Text className="text-white text-center font-semibold">
              Find a Buddy
            </Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
