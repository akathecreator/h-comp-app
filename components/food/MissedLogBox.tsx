import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActionSheetIOS,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import dayjs from "dayjs";
import { useCameraPermissions } from "expo-camera";
import { useGlobalContext } from "@/lib/global-provider";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { saveMessageToFirestore, storage } from "@/lib/firebase";
import { IMessage } from "react-native-gifted-chat";

const c6_user = {
  _id: "2", // Convert to string
  name: "C6",
  avatar: "https://placeimg.com/140/140/tech",
};

const QuickLogBox = ({ date }: { date: Date }) => {
  const agentId = process.env.EXPO_PUBLIC_AGENT_ID;
  const { user, setDialogVisible, setLoadingFood } = useGlobalContext();
  const [showChatBox, setShowChatBox] = useState(false);
  const [imageId, setImageId] = useState<string>("");
  const [textLog, setTextLog] = useState("");
  const [image, setImage] = useState<string | null>(null); // Store selected image
  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(
    null
  );
  const [permission, requestPermission] = useCameraPermissions();
  const isToday = dayjs(date).isSame(dayjs(), "day");
  const takePhotoWithCamera = async () => {
    try {
      // const [status, requestPermission] =

      if (!permission?.granted) {
        requestPermission();
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri;
        setImage(selectedImageUri);
        setSelectedFile({ uri: selectedImageUri });
        // await uploadImage(selectedImageUri);
      }
    } catch (error) {
      console.error("Error taking a photo:", error);
    }
  };
  const selectImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri;
        setImage(selectedImageUri);
        setSelectedFile({ uri: selectedImageUri });
        setShowChatBox(true);
        // await uploadImage(selectedImageUri);
      }
    } catch (error) {
      console.error("Error picking image from gallery:", error);
    }
  };
  const pickImage = async () => {
    try {
      // Show an Action Sheet to choose between Camera or Gallery
      const options = isToday
        ? ["Cancel", "Choose from Gallery", "Take a Photo"]
        : ["Cancel", "Choose from Gallery"];

      const androidOptions = isToday
        ? [
            {
              text: "Choose from Gallery",
              onPress: async () => await selectImageFromGallery(),
            },
            {
              text: "Take a Photo",
              onPress: async () => await takePhotoWithCamera(),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        : [
            {
              text: "Choose from Gallery",
              onPress: async () => await selectImageFromGallery(),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ];
      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex: 0,
          },
          async (buttonIndex) => {
            if (buttonIndex === 1) {
              // Choose from Gallery
              await selectImageFromGallery();
            } else if (buttonIndex === 2) {
              // Take a Photo
              await takePhotoWithCamera();
            }
          }
        );
      } else {
        // For Android or other platforms, use an Alert as an alternative
        Alert.alert("Select an Option", "Choose an action:", androidOptions);
      }
    } catch (error) {
      console.error("Error picking or uploading image:", error);
      Alert.alert("Failed to upload image.");
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const imageRef = ref(storage, `images/${uniqueId}.jpg`);

      setImageId(uniqueId);
      await uploadBytes(imageRef, blob);

      const imageURL = await getDownloadURL(imageRef);
      console.log("Uploaded Image URL:", imageURL);
      return {
        imageUrl: imageURL,
        uniqueId: uniqueId,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Failed to upload image.");
    }
  };
  const sendMessageToBackend = async () => {
    console.log("Submitted meal:", textLog);
    setLoadingFood(true);
    setShowChatBox(false);
    if (!textLog.trim() || !user) {
      console.log("no text or user");
      return;
    }
    const payload = {
      text:
        `${textLog} ${date.toISOString()}` || `FOOD_LOG ${date.toISOString()}`,
      userId: user.uid,
      roomId: `default-room-${agentId}`,
    };
    console.log("userid sent", user.uid);
    if (selectedFile) {
      const fileName = selectedFile.uri.split("/").pop() || "image.jpg";
      const fileType = fileName.split(".").pop() || "jpg";
      console.log("uri", selectedFile.uri);
      const image_meta = await uploadImage(selectedFile.uri);
      if (!image_meta) return;
      const { uniqueId } = image_meta;
      payload.imageUrl = uniqueId;
    }

    try {
      const base = "https://dazzling-simplicity-production.up.railway.app";
      // const base = `http://192.168.1.200:3002`;
      // console.la);

      const response = await fetch(`${base}/${agentId}/message`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const botResponses = await response.json();
      for (const botMessage of botResponses) {
        saveMessageToFirestore({
          text: botMessage.text,
          user: c6_user,
          userId: c6_user._id,
          roomId: user.uid,
        });
        if (botMessage.action === "FOOD_LOG") {
          setDialogVisible(true);
          //set universal food dialog
        }
      }
      setTextLog("");
      setLoadingFood(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setLoadingFood(false);
    }
  };
  return (
    <View className="flex-1">
      {/* Upload Box */}
      <View className="px-4 mb-2 flex flex-row gap-4 justify-center mx-2">
        {/* <TouchableOpacity
            onPress={pickImage}
            className="border-2 border-dashed border-newblue rounded-lg p-5 items-center justify-center"
          >
            <Text className="text-newblue">+ Capture Your Meal</Text>
          </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => setShowChatBox(true)}
          className="w-1/2"
        >
          <View
            className="border border-dotted border-[#A3A3A3] rounded-xl overflow-hidden"
            style={{ aspectRatio: 2.4 }} // Keeps it nicely rectangular
          >
            <ImageBackground
              source={require("@/assets/images/onboarding3.png")}
              className="flex-1 items-center justify-center"
              imageStyle={{ borderRadius: 12 }}
            >
              <Text className="text-white font-semibold text-lg bg-black/50 px-4 py-2 rounded-md">
                + Manual Log
              </Text>
            </ImageBackground>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} className="w-1/2">
          <View
            className="border border-dotted border-[#A3A3A3] rounded-xl overflow-hidden"
            style={{ aspectRatio: 2.4 }} // Keeps it nicely rectangular
          >
            <ImageBackground
              source={require("@/assets/images/onboarding2.png")}
              className="flex-1 items-center justify-center"
              imageStyle={{ borderRadius: 12 }}
            >
              <Text className="text-white font-semibold text-lg bg-black/50 px-4 py-2 rounded-md">
                {isToday ? "+ Snap a Meal" : "+ Missed a Meal?"}
              </Text>
            </ImageBackground>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
            onPress={() => setShowChatBox(true)}
            className="border-2 border-dashed border-newblue rounded-lg p-5 items-center justify-center"
          >
            <Text className="text-newblue text-center">+ Write Manual Log</Text>
          </TouchableOpacity> */}
      </View>

      {/* Chat Box */}
      {showChatBox && (
        <View className="bg-white mx-6 mt-4 my-4 p-4 rounded-xl shadow">
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: "100%",
                height: 150,
                borderRadius: 10,
                marginBottom: 10,
              }}
              resizeMode="cover"
            />
          )}
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Describe your meal:
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            value={textLog}
            onChangeText={setTextLog}
            className="p-3 bg-gray-100 rounded-md text-gray-800"
            placeholder="e.g. Grilled chicken and brown rice"
          />
          <View className="flex-row justify-end mt-3 gap-2">
            <TouchableOpacity
              onPress={() => {
                setShowChatBox(false);
                setImage(null);
                setTextLog("");
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              <Text className="text-gray-700">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sendMessageToBackend}
              className="px-4 py-2 bg-newblue rounded-lg"
            >
              <Text className="text-white font-semibold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default QuickLogBox;
