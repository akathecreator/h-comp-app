import React, { useState, useRef, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "@/lib/firebase";
import { useGlobalContext } from "@/lib/global-provider";
// Define types for messages and attachments
type Attachment = {
  url: string;
  contentType: string;
  title?: string;
};

type Message = {
  text: string;
  user: string;
  attachments?: Attachment[];
};

export default function Chat() {
  // const { agentId } = useLocalSearchParams<{ agentId: string }>();
  const agentId = "9fc93aca-a44f-0f64-bfae-2ed40110f88b";
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [imageId, setImageId] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(
    null
  );
  const { user } = useGlobalContext();

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const imageRef = ref(storage, `images/${uniqueId}.jpg`);

      setImageId([...imageId, uniqueId]);
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
  // Send text or image to backend
  const sendMessageToBackend = async () => {
    console.log("sending message to backend", input);
    if ((!input.trim() && !selectedFile) || !user) return;

    const formData = new FormData();
    formData.append("text", input);
    formData.append("userId", user.uid);
    formData.append("roomId", `default-room-${agentId}`);
    console.log("userid sent", user.uid);
    if (selectedFile) {
      const fileName = selectedFile.uri.split("/").pop() || "image.jpg";
      const fileType = fileName.split(".").pop() || "jpg";
      console.log("uri", selectedFile.uri);
      const image_meta = await uploadImage(selectedFile.uri);
      if (!image_meta) return;
      const { imageUrl, uniqueId } = image_meta;

      formData.append("file", {
        uri: imageUrl,
        name: uniqueId,
        type: `image/${fileType}`,
      } as any);
      console.log("selectedFile", selectedFile);
    }

    try {
      const res = await fetch(`http://192.168.1.174:3000/${agentId}/message`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data: Message[] = await res.json();
      setMessages((prev) => [...prev, ...data]);
      setSelectedFile(null);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle image selection
  const pickImage = async () => {
    try {
      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["Cancel", "Choose from Gallery", "Take a Photo"],
            cancelButtonIndex: 0,
          },
          async (buttonIndex) => {
            if (buttonIndex === 1) await selectImageFromGallery();
            else if (buttonIndex === 2) await takePhotoWithCamera();
          }
        );
      } else {
        Alert.alert("Select an Option", "Choose an action:", [
          { text: "Choose from Gallery", onPress: selectImageFromGallery },
          { text: "Take a Photo", onPress: takePhotoWithCamera },
          { text: "Cancel", style: "cancel" },
        ]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  // Pick image from gallery
  const selectImageFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted")
      return Alert.alert("Gallery permission required!");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) setSelectedFile({ uri: result.assets[0].uri });
  };

  // Take a photo with camera
  const takePhotoWithCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted")
      return Alert.alert("Camera permission required!");

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) setSelectedFile({ uri: result.assets[0].uri });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ padding: 10 }}>
        {/* Back Button in Top Left */}
        <TouchableOpacity
          onPress={() => router.back()} // Navigate back
          style={{
            position: "absolute",
            top: 80, // Adjust for status bar
            left: 15,
            zIndex: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={{ color: "black", fontSize: 18, marginLeft: 5 }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        inverted
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.user === "user" ? "flex-end" : "flex-start",
              backgroundColor: item.user === "user" ? "#1A1A1A" : "#E8E4D9",
              padding: 10,
              margin: 5,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: item.user === "user" ? "white" : "black" }}>
              {item.text}
            </Text>
            {item.attachments?.map((attachment, i) =>
              attachment.contentType.startsWith("image/") ? (
                <Image
                  key={i}
                  source={{
                    uri: attachment.url.startsWith("http")
                      ? attachment.url
                      : `http://localhost:3000/media/generated/${attachment.url
                          .split("/")
                          .pop()}`,
                  }}
                  style={{
                    width: 150,
                    height: 150,
                    marginTop: 5,
                    borderRadius: 10,
                  }}
                />
              ) : null
            )}
          </View>
        )}
      />

      {/* Input Section */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderTopWidth: 1,
          borderColor: "#ddd",
        }}
      >
        <TouchableOpacity onPress={pickImage} style={{ padding: 10 }}>
          <Ionicons name="image" size={24} color="black" />
        </TouchableOpacity>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginHorizontal: 10,
          }}
        />

        <TouchableOpacity
          onPress={sendMessageToBackend}
          style={{ padding: 10, backgroundColor: "#1A1A1A", borderRadius: 8 }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview Before Sending */}
      {selectedFile && (
        <View style={{ padding: 10, alignItems: "center" }}>
          <Image
            source={{ uri: selectedFile.uri }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
          <TouchableOpacity
            onPress={() => setSelectedFile(null)}
            style={{ marginTop: 5 }}
          >
            <Text style={{ color: "red" }}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
