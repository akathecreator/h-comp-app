import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useGlobalContext } from "@/lib/global-provider";
import { updateProfile, logout } from "@/lib/firebase";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfilePage = () => {
  const { userProfile } = useGlobalContext(); // Get the current use
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleSave = async () => {
    try {
      await updateProfile(editedProfile); // Assume this updates Firestore
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!userProfile) {
    return (
      <View className="flex-1 justify-center items-center bg-bone-light">
        <Text className="text-black-muted font-rubik text-lg">
          Loading Profile...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bone">
      <ScrollView className="flex-1 bg-bone-light">
        {/* Header Section */}
        <View className="bg-bone-dark p-6 rounded-b-3xl shadow-md">
          <Text className="text-black font-rubik-bold text-3xl">Profile</Text>
        </View>

        {/* Profile Info */}
        <View className="mt-6 px-6">
          <Text className="text-black-muted text-sm">Full Name</Text>
          {isEditing ? (
            <TextInput
              className="text-black font-rubik-medium text-lg mb-4 bg-white p-2 rounded-md border border-gray"
              value={editedProfile.fullName}
              onChangeText={(text) =>
                setEditedProfile({ ...editedProfile, fullName: text })
              }
            />
          ) : (
            <Text className="text-black font-rubik-medium text-lg mb-4">
              {userProfile.fullName}
            </Text>
          )}

          <Text className="text-black-muted text-sm">Nickname</Text>
          {isEditing ? (
            <TextInput
              className="text-black font-rubik-medium text-lg mb-4 bg-white p-2 rounded-md border border-gray"
              value={editedProfile.nickName}
              onChangeText={(text) =>
                setEditedProfile({ ...editedProfile, nickName: text })
              }
            />
          ) : (
            <Text className="text-black font-rubik-medium text-lg mb-4">
              {userProfile.nickName}
            </Text>
          )}

          <Text className="text-black-muted text-sm">Email</Text>
          {isEditing ? (
            <TextInput
              className="text-black font-rubik-medium text-lg mb-4 bg-white p-2 rounded-md border border-gray"
              value={editedProfile.email}
              onChangeText={(text) =>
                setEditedProfile({ ...editedProfile, email: text })
              }
            />
          ) : (
            <Text className="text-black font-rubik-medium text-lg mb-4">
              {userProfile.email}
            </Text>
          )}
        </View>

        {/* Health Stats */}
        <View className="mt-6 px-6">
          <Text className="text-black font-rubik-bold text-xl mb-4">
            Health Stats
          </Text>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-black-muted text-sm">Height</Text>
            {isEditing ? (
              <TextInput
                className="text-black font-rubik-medium text-lg bg-white p-2 rounded-md border border-gray w-24"
                value={editedProfile.height}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, height: text })
                }
              />
            ) : (
              <Text className="text-black font-rubik-medium text-lg">
                {userProfile.height}
              </Text>
            )}
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-black-muted text-sm">Weight</Text>
            {isEditing ? (
              <TextInput
                className="text-black font-rubik-medium text-lg bg-white p-2 rounded-md border border-gray w-24"
                value={editedProfile.weight}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, weight: text })
                }
              />
            ) : (
              <Text className="text-black font-rubik-medium text-lg">
                {userProfile.weight}
              </Text>
            )}
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-black-muted text-sm">Activity Level</Text>
            {isEditing ? (
              <TextInput
                className="text-black font-rubik-medium text-lg bg-white p-2 rounded-md border border-gray w-24"
                value={editedProfile.activityLevel}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, activityLevel: text })
                }
              />
            ) : (
              <Text className="text-black font-rubik-medium text-lg">
                {userProfile.activityLevel}
              </Text>
            )}
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-black-muted text-sm">Health Goal</Text>
            {isEditing ? (
              <TextInput
                className="text-black font-rubik-medium text-lg bg-white p-2 rounded-md border border-gray w-48"
                value={editedProfile.healthGoal}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, healthGoal: text })
                }
              />
            ) : (
              <Text className="text-black font-rubik-medium text-lg">
                {userProfile.healthGoal}
              </Text>
            )}
          </View>
        </View>

        {/* Edit Profile Button */}
        <View className="mt-10 px-6">
          {isEditing ? (
            <TouchableOpacity
              className="bg-success py-4 rounded-lg shadow-md"
              onPress={handleSave}
            >
              <Text className="text-white text-center font-rubik-bold text-lg">
                Save Changes
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-accent-dustyBlue py-4 rounded-lg shadow-md"
              onPress={() => setIsEditing(true)}
            >
              <Text className="text-white text-center font-rubik-bold text-lg">
                Edit Profile
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Logout Button */}
        <View className="mt-4 px-6 mb-10">
          <TouchableOpacity className="bg-danger py-4 rounded-lg shadow-md">
            <Text
              className="text-white text-center font-rubik-bold text-lg"
              onClick={logout}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;
