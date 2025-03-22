import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import dayjs from "dayjs";
import { X, Settings } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useHabits from "@/hooks/useHabits";
import { useGlobalContext } from "@/lib/global-provider";
import { useRouter } from "expo-router";
// Sample dynamic habits (This should come from Firebase/AI in real use cases)
interface HabitData {
  habit_id: string;
  name: string;
  description: string;
  type: "good" | "bad";
  created_at: string; // ISO date string
  goal: string;
  streak_count: number;
  longest_streak: number;
  last_updated: string; // ISO date string
  reminders: string[]; // Array of time strings in "HH:mm" format
  status: "active" | "inactive" | "completed";
  day_till_complete: number; //as habit expert how many days should they maintain streak to complete this habit
  owner_id: string;
}

// Generate a mock history for the current month
const generateMockHistory = () => {
  const daysInMonth = dayjs().daysInMonth();
  let history = {};
  for (let i = 1; i <= daysInMonth; i++) {
    history[i] = "idle"; // Initially, no progress
  }
  return history;
};
const DynamicHabitTracker = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  if (!user) return null;
  const { habits, loading, updateHabitProgress } = useHabits(user.uid);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<HabitData | null>(null);
  const [history, setHistory] = useState(generateMockHistory());

  const logHabit = (day: string, status: string) => {
    setHistory((prev) => ({ ...prev, [day]: status }));
  };
  const handleDayLog = (didRelapse) => {
    if (!selectedHabit) return;
    setModalVisible(false);

    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === selectedHabit.id) {
          let newProgress = didRelapse
            ? Math.max(0, habit.streak_count - habit.day_till_complete)
            : habit.streak_count + 1;
          if (didRelapse) {
            Alert.alert("Relapse!", habit.relapseMessage, [
              {
                text: "Restart",
                onPress: () => updateHabitProgress(habit.id, 0),
              },
              {
                text: `Keep Going (-${habit.relapsePenalty} Days)`,
                onPress: () => updateHabitProgress(habit.id, newProgress),
              },
            ]);
          } else {
            if (newProgress >= habit.goal) {
              Alert.alert("🎉 Success!", habit.completionMessage);
            } else {
              Alert.alert("✅ Progress!", habit.streakSuccessMessage);
            }
            updateHabitProgress(habit.id, newProgress);
          }
        }
        return habit;
      })
    );
  };

  return (
    <View className="flex-row space-x-2 w-full gap-1 my-2">
      {habits.length < 1 && (
        <TouchableOpacity
          onPress={() => {
            router.replace("/chat");
          }}
        >
          <View className="p-4 rounded-xl w-full bg-newblue">
            <Text className="text-left text-md font-bold text-white">
              Tell me about your bad habits and good habits to track streaks
            </Text>
          </View>
        </TouchableOpacity>
      )}
      {habits.map((habit) => (
        <View className="px-1 rounded-xl flex-1" key={habit.habit_id}>
          <TouchableOpacity
            className={`p-4 rounded-xl w-full ${
              habit.type === "bad" ? "bg-black" : "bg-newblue"
            }`}
            // onPress={() => {
            //   setSelectedHabit(habit);
            //   setModalVisible(true);
            // }}
            onPress={() => {
              updateHabitProgress(habit.habit_id, habit.streak_count + 1);
            }}
          >
            <Text
              className={`${
                habit.type === "bad" ? "text-white" : "text-white"
              } text-sm`}
            >
              {habit.name}
            </Text>
            <Text
              className={`${
                habit.type === "bad" ? "text-white" : "text-white"
              } font-bold text-lg`}
            >
              {habit.streak_count}{" "}
              {habit.type === "good"
                ? "days"
                : `/ ${habit.day_till_complete} days`}
            </Text>
            {/* Button with Icon to Open Modal */}
            {/* <TouchableOpacity
              style={{ zIndex: 100, }} // Set z-index
              onPress={() => {
                setSelectedHabit(habit);
                setModalVisible(true);
              }}
            >
              <Settings size={24} color="black" />
            </TouchableOpacity> */}
          </TouchableOpacity>
        </View>
      ))}

      {/* Modal for Logging Progress */}
      {selectedHabit && (
        <Modal
          animationType="slide"
          visible={modalVisible} // Remove `transparent`
          onRequestClose={() => setModalVisible(false)}
        >
          {/* Full-Screen View */}
          <View className="flex-1 bg-white w-full h-full p-6 my-14">
            {/* Header with Close Button */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">{selectedHabit.name}</Text>

              {/* Minimal Back Arrow Close */}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-2"
              >
                <X size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Log Habit Buttons */}
            <View className="flex-row justify-between mt-4">
              {/* Stayed on Track Button */}
              <TouchableOpacity
                className="bg-black px-4 py-2 rounded-lg flex-1 mr-2"
                onPress={() => handleDayLog(false)}
              >
                <Text className="text-white text-center">On Track</Text>
              </TouchableOpacity>

              {/* Relapse Button */}
              <TouchableOpacity
                className="bg-white px-4 py-2 rounded-lg flex-1 ml-2 border border-black"
                onPress={() => handleDayLog(true)}
              >
                <Text className="text-black text-center">Relapse</Text>
              </TouchableOpacity>
            </View>
            {/* Calendar Section */}
            <Text className="text-md font-bold mt-6 mb-2">This Month</Text>
            <ScrollView className="h-3/4">
              <View className="flex-row flex-wrap gap-2">
                {Object.keys(history).map((day) => (
                  <TouchableOpacity
                    key={day}
                    className={`m-1 w-10 h-10 items-center justify-center rounded-full border-2 ${
                      history[day] === "streak"
                        ? "bg-black "
                        : history[day] === "relapse"
                        ? "bg-red-500 border-red-700"
                        : "border-gray-300 border-dashed"
                    }`}
                    onPress={() =>
                      logHabit(
                        day,
                        history[day] === "streak"
                          ? history[day] === "idle"
                            ? "relapse"
                            : "streak"
                          : "idle"
                      )
                    }
                  >
                    <Text
                      className={`${
                        history[day] === "streak" || history[day] === "relapse"
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                className="bg-red-400 px-4 py-2 rounded-lg flex-1 ml-2 mt-5"
                onPress={() => handleDayLog(true)}
              >
                <Text className="text-white text-center">Abandon</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DynamicHabitTracker;
// import React from 'react';
// import { View, Text } from 'react-native';

// const HabitTracker = () => {
//   return (
//     <View className="flex-row space-x-2 w-full gap-4">
//       {/* No Cigarettes Badge */}
//       <View className="bg-black px-4 py-2 rounded-xl flex-1">
//         <Text className="text-white text-sm">no cigarettes</Text>
//         <Text className="text-white font-bold text-lg">9 / 21 days</Text>
//       </View>

//       {/* Yoga Badge */}
//       <View className="bg-yellow-100 px-4 py-3 rounded-xl flex-1">
//         <Text className="text-black text-sm">yoga</Text>
//         <Text className="text-black font-bold text-lg">30 min</Text>
//       </View>

//     </View>
//   );
// };

// export default HabitTracker;
