import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator } from "react-native";
import { ProgressBar } from "react-native-paper";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-provider";

const flameIcon = icons.flame;
const rightArrowIcon = icons.rightArrow;

const WeeklyQuests = () => {
  const { user } = useGlobalContext();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchweeklyGoals = async () => {
      if (!user) return;
      try {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        today.setHours(0, 0, 0, 0);

        const q = query(
          collection(db, "goals"),
          where("owner_id", "==", user.uid),
          where("goal_type", "==", "weekly"),
          where("start_date", ">=", today),
          where("start_date", "<=", tomorrow),
          limit(2)
        );

        const querySnapshot = await getDocs(q);
        const weeklyGoals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().goal_name,
          progress: doc.data().goal_current_progress || 0,
          target: doc.data().goal_max_progress || 1,
        }));
        console.log("weeklyGoals", weeklyGoals);
        setQuests(weeklyGoals);
      } catch (error) {
        console.error("Error fetching daily goals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchweeklyGoals();
  }, [user.uid]); // Fetch when userId changes

  if (loading) {
    return <ActivityIndicator size="large" color="black" />;
  }

  return (
    <View>
      <Text className="text-xl font-bold text-black">Weekly Quests</Text>

      <FlatList
        data={quests}
        className="mt-2"
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const progress = item.progress / item.target;
          const isCompleted = item.progress >= item.target;

          return (
            <View className="p-3 rounded-lg shadow-md mb-1 flex-row items-center">
              {/* Left: Quest Icon */}
              <Image
                source={isCompleted ? flameIcon : rightArrowIcon}
                style={{ width: 30, height: 30, marginRight: 12 }}
              />

              {/* Middle: Quest Info */}
              <View className="flex-1 gap-2">
                <Text className="text-black font-medium">{item.title}</Text>
                <ProgressBar
                  progress={progress}
                  color="black"
                  style={{ height: 6, borderRadius: 8, marginTop: 6 }}
                />
                <Text className="text-xs text-gray-500 m-1">
                  {item.progress} / {item.target} completed
                </Text>
              </View>

              {/* Right: Status */}
              <Text
                className={`text-sm font-semibold mx-2 ${
                  isCompleted ? "text-green-500" : "text-gray-500"
                }`}
              >
                {isCompleted ? "✓ Done" : "In Progress"}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default WeeklyQuests;
