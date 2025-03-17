import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from "react-native";
import { useGlobalContext } from "@/lib/global-provider";
import { updateProfile, logout } from "@/lib/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native-paper";
import Header from "@/components/home/Header";
import ExpBar from "@/components/home/ExpBar";

const ProfilePage = () => {
  const { userProfile } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    userProfile.notifications || false
  );

  const handleSave = async () => {
    try {
      await updateProfile({
        ...editedProfile,
        notifications: notificationsEnabled,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!userProfile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
        <Text className="text-gray-400 mt-4">Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="border-b border-gray-700 pb-4">
          <Text className="text-black font-rubik-bold text-3xl">Profile</Text>
        </View>
        <View className=" my-4">
          <ExpBar
            level={userProfile.level_meta.level}
            exp={userProfile.level_meta.experience}
            maxExp={userProfile.level_meta.next_level}
          />
        </View>
        {/* Profile Info */}
        <View className="mb-6">
          <Text className="text-gray-400 text-sm">Full Name</Text>
          {isEditing ? (
            <TextInput
              className="text-gray-800 text-lg bg-white p-3 rounded-md border border-gray-600 mb-4"
              value={editedProfile.fullName}
              onChangeText={(text) =>
                setEditedProfile({ ...editedProfile, fullName: text })
              }
            />
          ) : (
            <Text className="text-gray-800 text-lg mb-4">
              {userProfile.fullName}
            </Text>
          )}

          <Text className="text-gray-400 text-sm">Email</Text>
          <Text className="text-gray-800 text-lg mb-4">
            {userProfile.email}
          </Text>
        </View>

        {/* Health Stats */}
        <View className="mb-6">
          <Text className="text-gray-800 font-rubik-bold text-xl mb-4">
            Health Stats
          </Text>

          {[
            { label: "Height (cm)", field: "height" },
            { label: "Weight (kg)", field: "weight" },
            { label: "Age", field: "age" },
            { label: "Activity Level", field: "activityLevel" },
            { label: "Health Goal", field: "healthGoal" },
          ].map(({ label, field }) => (
            <View
              className="flex-row justify-between items-center mb-4"
              key={field}
            >
              <Text className="text-gray-400">{label}</Text>
              {isEditing ? (
                <TextInput
                  className="text-gray-800 text-lg bg-white p-3 rounded-md border border-gray-600 w-24"
                  value={editedProfile[field]}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, [field]: text })
                  }
                />
              ) : (
                <Text className="text-gray-800 text-lg">
                  {userProfile[field]}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Notifications Toggle */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-gray-400">Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => setNotificationsEnabled(value)}
            trackColor={{ false: "#555", true: "#00C853" }}
            thumbColor={notificationsEnabled ? "#fff" : "#888"}
          />
        </View>

        {/* Buttons */}
        <View className="mt-6">
          {isEditing ? (
            <TouchableOpacity
              className="bg-green-500 py-4 rounded-lg shadow-md"
              onPress={handleSave}
            >
              <Text className="text-gray-800 text-center font-rubik-bold text-lg">
                Save Changes
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-newblue py-4 rounded-lg shadow-md"
              onPress={() => setIsEditing(true)}
            >
              <Text className="text-white text-center font-rubik-bold text-lg">
                Edit Profile
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="bg-red-600 py-4 rounded-lg shadow-md mt-4"
            onPress={logout}
          >
            <Text className="text-white text-center font-rubik-bold text-lg">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-10"></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;
