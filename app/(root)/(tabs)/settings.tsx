import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useGlobalContext } from "@/lib/global-provider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { router } from "expo-router";
const SettingsPage = () => {
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureRequest, setFeatureRequest] = useState("");
  const [editField, setEditField] = useState<string | null>(null);
  const [editableValue, setEditableValue] = useState("");
  const [editingMealTimeKey, setEditingMealTimeKey] = useState<string | null>(
    null
  );
  const { userProfile } = useGlobalContext();

  const [userDoc, setUserDoc] = useState({
    nickname: userProfile?.nickname,
    age: userProfile?.age,
    gender: userProfile?.gender,
    goals: {
      primary_goal: userProfile?.goals.primary_goal,
      target_weight_kg: userProfile?.goals.target_weight_kg,
      current_weight_kg: userProfile?.goals.current_weight_kg,
      height_cm: userProfile?.goals.height_cm,
    },
    diet: {
      eating_style: userProfile?.diet.eating_style,
      diet_type: userProfile?.diet.diet_type,
      meal_times: userProfile?.diet.meal_times,
    },
    activity: {
      activity_level: userProfile?.activity.activity_level,
      preferred_workouts: userProfile?.activity.preferred_workouts,
    },
    personalization: {
      tone: userProfile?.personalization.tone,
      language: userProfile?.personalization.language,
      country: userProfile?.personalization.country,
    },
    notifications: {
      reminder_times: userProfile?.notifications.reminder_times,
      reminder_types: userProfile?.notifications.reminder_types,
    },
  });

  const handleSendFeature = () => {
    if (!featureRequest.trim())
      return Alert.alert("Please write something first!");
    Alert.alert("Thank you!", "Your suggestion has been received.");
    setFeatureRequest("");
    setShowFeatureModal(false);
  };

  // const handleSaveEdit = () => {
  //   if (editField) {
  //     const updatedDoc = { ...userDoc };
  //     if (editField === "nickname") updatedDoc.nickname = editableValue;
  //     else if (editField === "diet_type")
  //       updatedDoc.diet.diet_type = editableValue;
  //     else if (editField === "tone")
  //       updatedDoc.personalization.tone = editableValue;
  //     else if (editField === "language")
  //       updatedDoc.personalization.language = editableValue as "en" | "th";
  //     else if (editField === "goal")
  //       updatedDoc.goals.primary_goal = editableValue;
  //     setUserDoc(updatedDoc);
  //   } else if (editingMealTimeKey) {
  //     const updatedDoc = { ...userDoc };
  //     updatedDoc.diet.meal_times[editingMealTimeKey] = editableValue;
  //     setUserDoc(updatedDoc);
  //   }
  //   setEditField(null);
  //   setEditableValue("");
  //   setEditingMealTimeKey(null);
  // };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="bg-white flex-1 p-4">
        <Text className="text-2xl font-bold text-black mb-4">Settings</Text>

        {/* Personal Info */}
        <Text className="text-lg font-semibold mb-2 text-black">Your Info</Text>
        <EditableItem
          label="Nickname"
          value={userDoc.nickname}
          onEdit={() => {
            setEditField("nickname");
            setEditableValue(userDoc.nickname);
          }}
        />
        <EditableItem
          label="Goal"
          value={userDoc.goals.primary_goal}
          onEdit={() => {
            setEditField("goal");
            setEditableValue(userDoc.goals.primary_goal);
          }}
        />

        <EditableItem
          label="Gender"
          value={userDoc.gender}
          onEdit={null}
          disabled
        />
        <EditableItem
          label="Age"
          value={userDoc.age.toString()}
          onEdit={null}
          disabled
        />
        <EditableItem
          label="Height"
          value={`${userDoc.goals.height_cm} cm`}
          onEdit={null}
          disabled
        />

        {/* Diet Settings */}
        <Text className="text-lg font-semibold mt-6 mb-2 text-black">
          Diet & Meals
        </Text>
        <EditableItem
          label="Diet Type"
          value={userDoc.diet.diet_type}
          onEdit={() => {
            setEditField("diet_type");
            setEditableValue(userDoc.diet.diet_type);
          }}
        />

        {/* <Text className="text-base font-semibold text-gray-800 mb-1">
          Meal Times
        </Text>
        {Object.entries(userDoc.diet.meal_times).map(([key, val]) => (
          <EditableItem
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={val}
            onEdit={() => {
              setEditingMealTimeKey(key);
              setEditableValue(val);
            }}
          />
        ))} */}

        {/* Preferences */}
        <Text className="text-lg font-semibold mt-6 mb-2 text-black">
          Preferences
        </Text>
        <EditableItem
          label="Tone"
          value={userDoc.personalization.tone}
          onEdit={() => {
            setEditField("tone");
            setEditableValue(userDoc.personalization.tone);
          }}
        />
        <EditableItem
          label="Language"
          value={userDoc.personalization.language}
          onEdit={() => {
            setEditField("language");
            setEditableValue(userDoc.personalization.language);
          }}
        />

        {/* FAQ */}
        <Text className="text-lg font-semibold mt-6 mb-2 text-black">FAQ</Text>
        <SettingLink
          label="How does the AI calculate calories?"
          onPress={() =>
            Alert.alert("We use BMR, TDEE, and your food logs to calculate.")
          }
        />
        <SettingLink
          label="Can I change my goal or tone later?"
          onPress={() =>
            Alert.alert("Yes! Just tap to edit any setting above.")
          }
        />
        <SettingLink
          label="How are reminders personalized?"
          onPress={() =>
            Alert.alert("They're based on your habits and meal times.")
          }
        />

        {/* Suggest Feature */}
        <Text className="text-lg font-semibold mt-6 mb-2 text-black">
          Feedback
        </Text>
        <TouchableOpacity
          onPress={() => setShowFeatureModal(true)}
          className="p-4 rounded-xl border border-gray-300 "
        >
          <Text className="text-black text-center">Suggest a Feature ✨</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            signOut(auth);
            router.replace("/sign-in");
          }}
          className="p-4 rounded-xl bg-newblue border border-gray-300 mb-10 mt-4"
        >
          <Text className="text-white text-center">Logout</Text>
        </TouchableOpacity>

        {/* Edit Modal */}
        {/* <Modal
          visible={!!editField || !!editingMealTimeKey}
          transparent
          animationType="slide"
        >
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white w-11/12 p-6 rounded-xl">
              <Text className="text-lg font-bold mb-2 text-black">
                Edit {editField || editingMealTimeKey}
              </Text>
              <TextInput
                placeholder={`Enter new value`}
                value={editableValue}
                onChangeText={setEditableValue}
                className="h-12 bg-gray-100 p-3 rounded-lg text-black"
              />
              <TouchableOpacity
                onPress={handleSaveEdit}
                className="mt-4 bg-newblue p-3 rounded-xl"
              >
                <Text className="text-center text-white font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}

        {/* Feature Modal */}
        <Modal visible={showFeatureModal} transparent animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white w-11/12 p-6 rounded-xl">
              <Text className="text-lg font-bold mb-2 text-black">
                Have an idea?
              </Text>
              <TextInput
                placeholder="Tell us what you'd like to see..."
                multiline
                className="h-32 bg-gray-100 p-3 rounded-lg text-black"
                value={featureRequest}
                onChangeText={setFeatureRequest}
              />
              <TouchableOpacity
                onPress={handleSendFeature}
                className="mt-4 bg-newblue p-3 rounded-xl"
              >
                <Text className="text-center text-white font-bold">Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const EditableItem = ({
  label,
  value,
  onEdit,
  disabled = false,
}: {
  label: string;
  value: string;
  onEdit: (() => void) | null;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    onPress={onEdit ?? (() => {})}
    disabled={disabled}
    className="flex-row justify-between items-center py-3 border-b border-gray-200"
  >
    <Text className="text-gray-700 font-medium w-1/2 capitalize">{label}</Text>
    <Text className="text-gray-900 text-right w-1/2">{value}</Text>
  </TouchableOpacity>
);

const SettingLink = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row justify-between items-center py-3"
  >
    <Text className="text-blue-600 font-medium text-base">{label}</Text>
    <ChevronRight size={18} color="gray" />
  </TouchableOpacity>
);

export default SettingsPage;
