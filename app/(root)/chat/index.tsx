import React, { useState, useCallback, useEffect } from "react";
import Constants from "expo-constants";
import {
  View,
  TextInput,
  StyleSheet,
  Button,
  Image,
  Alert,
  Text,
  Keyboard,
  ActionSheetIOS,
  Platform,
  TouchableOpacity,
} from "react-native";
import {
  Bubble,
  GiftedChat,
  IMessage,
  Actions,
} from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";
import {
  storage,
  saveMessageToFirestore,
  fetchUserMessages,
} from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useGlobalContext } from "@/lib/global-provider";
import NutritionDialog from "@/components/food/NutritionDialog";
import { v4 as uuidv4 } from "uuid";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";

type Message = {
  text: string;
  user: string;
  attachments?: Attachment[];
};
type Attachment = {
  url: string;
  contentType: string;
  title?: string;
};

export default function C6() {
  const agentId = process.env.EXPO_PUBLIC_AGENT_ID;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [image, setImage] = useState<string | null>(null); // Store selected image
  const [text, setText] = useState<string>(""); // Store text input for image message
  const [imageId, setImageId] = useState<string>("");
  const [loading_, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(
    null
  );
  const { user, isLogged, loading, userProfile } = useGlobalContext();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const c6_user = {
    _id: "2", // Convert to string
    name: "C6",
    avatar: "https://placeimg.com/140/140/tech",
  };
  useEffect(() => {
    const initializeChat = async () => {
      if (!user?.uid) {
        console.warn("User is not logged in");
        return;
      }

      // Fetch existing messages
      const fetchedMessages = await fetchUserMessages(user.uid, setMessages);

      // Transform fetched messages
      const formattedMessages = fetchedMessages.map((msg) => ({
        ...msg,
        _id: msg._id || uuidv4(), // Ensure unique _id
        createdAt: new Date(msg.createdAt),
        user: msg.user,
        image: msg.image || undefined,
      }));

      if (formattedMessages.length === 0) {
        // Save welcome message to Firestore
        const welcomeMessage: IMessage = {
          _id: uuidv4(), // Generate a unique ID for the welcome message
          text: "Welcome! What topic would you like me to assist you with?",
          createdAt: new Date(),
          user: {
            _id: "bot", // Fixed ID for the bot user
            name: "C6",
            avatar: "https://placeimg.com/140/140/tech",
          },
        };

        await saveMessageToFirestore({
          ...welcomeMessage,
          userId: "2",
          roomId: user.uid,
        });

        // Append welcome message
        setMessages((prevMessages) =>
          GiftedChat.append(prevMessages, [welcomeMessage])
        );
      } else {
        // Remove duplicates from previous messages
        const uniqueMessages = [
          ...new Map(
            [...formattedMessages].map((msg) => [msg._id, msg])
          ).values(),
        ];

        // Append fetched messages
        setMessages((prevMessages) =>
          GiftedChat.append(prevMessages, uniqueMessages)
        );
      }
    };

    initializeChat();
  }, [user?.uid]);
  // Function to send a message to the backend
  const sendMessageToBackend = async (text_: string) => {
    console.log("sending message to backend", text_);
    if (!text_.trim() || !user) {
      console.log("no text or user");
      return;
    }

    const formData = new FormData();
    formData.append("text", text_);
    formData.append("userId", user.uid);
    formData.append("roomId", `default-room-${agentId}`);
    const payload = {
      text: text_,
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
      const { imageUrl, uniqueId } = image_meta;
      payload.imageUrl = uniqueId;
      // formData.append("file", {
      //   uri: imageUrl,
      //   name: uniqueId,
      //   type: `image/${fileType}`,
      // } as any);
      formData.append("imageUrl", imageUrl);
      console.log("selectedFile", selectedFile);
    }

    try {
      // const base = "https://dazzling-simplicity-production.up.railway.app";
      const base = `http://192.168.1.164:3002`;
      console.log(formData);

      const response = await fetch(`${base}/${agentId}/message`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response", response);
      const botResponse = await response.json();
      console.log("botResponse", botResponse);
      return botResponse;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      try {
        const userMessage = newMessages[0];
        if (!user?.uid) return;

        console.log("1. Sending new message:", userMessage); // Debug log

        // 1. Update UI immediately with user message
        setMessages((previousMessages) => {
          console.log("2. Previous messages count:", previousMessages.length); // Debug log
          return GiftedChat.append(previousMessages, newMessages);
        });

        // 2. Save user message to Firestore
        const userMessageData = {
          text: userMessage.text,
          user: {
            _id: "1",
            name: userProfile?.nickName || "User",
            avatar: "https://placeimg.com/140/140/tech",
          },
          userId: user.uid,
          roomId: user.uid,
        };
        setLoading(true);
        console.log("3. Saving to Firestore:", userMessageData); // Debug log
        saveMessageToFirestore(userMessageData);

        // 3. Get bot response
        console.log("4. Getting bot response"); // Debug log
        const botResponse = await sendMessageToBackend(userMessage.text);

        console.log("5. Bot response received:", botResponse); // Debug log
        if (!botResponse || botResponse.length === 0) {
          throw new Error("Bot response is empty or undefined");
        }
        // ✅ Ensure botResponse[0].text exists before proceeding
        if (!botResponse[0]?.text) {
          throw new Error("Invalid bot response format");
        }

        // if (!botResponse?.[0]?.text) {
        //   throw new Error("Invalid bot response");
        // }
        const splitMessageIntoBubbles = (text: string) => {
          // Split at the first full stop but keep it in the first part
          const splitIndex = text.indexOf(". ");
          if (splitIndex !== -1) {
            return [
              text.substring(0, splitIndex + 1), // First sentence (including ".")
              text.substring(splitIndex + 2), // Remaining text
            ];
          }
          return [text]; // If no full stop, return as a single message
        };

        const botResponses = splitMessageIntoBubbles(botResponse[0].text);

        // 4. Create bot message
        // const botMessage: IMessage = {
        //   _id: `bot-${Date.now()}-${Math.random()}`,
        //   text: botResponse[0].text,
        //   createdAt: new Date(),
        //   user: c6_user,
        //   roomId: user.uid,
        // };
        for (const botMessage of botResponses) {
          console.log("botMessage", botMessage);
          const _botMessage: IMessage = {
            _id: `bot-${Date.now()}-${Math.random()}`,
            text: botMessage,
            createdAt: new Date(),
            user: c6_user,
            roomId: user.uid,
          };
          // 5. Update UI with bot message
          setMessages((previousMessages) => {
            console.log(
              "6. Adding bot message, current count:",
              previousMessages.length
            ); // Debug log
            return GiftedChat.append(previousMessages, [_botMessage]);
          });

          // 6. Save bot message to Firestore
          console.log("7. Saving bot message to Firestore"); // Debug log
          saveMessageToFirestore({
            text: botMessage,
            user: c6_user,
            userId: c6_user._id,
            roomId: user.uid,
          });
        }
        setLoading(false);

        setSelectedFile(null);
      } catch (error) {
        console.error("Error in onSend:", error);
        // Show error message to user
        const errorMessage: IMessage = {
          _id: `error-${Date.now()}`,
          text: "Sorry, something went wrong. Please try again.",
          createdAt: new Date(),
          user: c6_user,
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [errorMessage])
        );
      }
    },
    [user, userProfile, c6_user]
  );
  const pickImage = async () => {
    try {
      // Show an Action Sheet to choose between Camera or Gallery
      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["Cancel", "Choose from Gallery", "Take a Photo"],
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
        Alert.alert("Select an Option", "Choose an action:", [
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
        ]);
      }
    } catch (error) {
      console.error("Error picking or uploading image:", error);
      Alert.alert("Failed to upload image.");
    }
  };

  const selectImageFromGallery = async () => {
    try {
      // const [status, requestPermission] =
      //   await ImagePicker.useMediaLibraryPermissions();
      // if (status?.accessPrivileges == "none") {
      //   requestPermission();
      //   return;
      // }

      const result = await ImagePicker.launchImageLibraryAsync({
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
      console.error("Error picking image from gallery:", error);
    }
  };

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
  // Handle sending text and image together
  const handleSendImageMessage = async () => {
    if (!image || !user || !user.uid) return;

    const imageMessage = {
      _id: Math.random().toString(),
      createdAt: new Date(),
      user: {
        _id: "1",
        name: userProfile?.nickName || "User",
        avatar: "https://placeimg.com/140/140/tech",
      },
      text: text || "food",
      image,
      userId: user.uid,
      roomId: user.uid,
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [imageMessage])
    );
    saveMessageToFirestore(imageMessage);

    //https://storage.googleapis.com/c6-companion-a800c.firebasestorage.app/images/.jpg?GoogleAccessId=firebase-adminsdk-4w7ob%40c6-companion-a800c.iam.gserviceaccount.com&Expires=1742144400&Signature=I7aXaU82%2Fein7mmBlWI0TTmBXpsdNpBI%2FM7e8d%2B7uiQML%2BMlhvCmB29%2F4Cvpkt4dOT8XpPCA5hA9hKzYskvxMIPRUIMflgy5rYeJsQJCSfcBDfVZsRdnt1myU4%2BQmI274avWQt9gpvLsoY2f5vzHYXwpNuYrSzbaUqGz5vUtbbcIHqRDYb9dsj3CUUDrvy57dJ%2Bh9phCmq7H1O%2F0aGQfSaGB%2BdkeGAssZmNxtbGgE25I50tjfk28mGjc74kuWyDYegGVGZ5dBR442AWWlj8ZXwvFcidYcJqcI3HKClSGjc%2FcF%2BNbGL7nNHobWnhZMTad776yI2rFLrd%2F17xTunpjFw%3D%3D

    setLoading(true);
    // Send to backend
    const tempText = text;
    const tempImageId = imageId;
    setImage(null);
    setText("");
    // Keyboard.dismiss();
    const replyText = await sendMessageToBackend(tempText);

    let count = 0;
    for (var reply of replyText) {
      if (reply.action === "FOOD_LOG") {
        setDialogVisible(true);
      }
      // Create backend reply message
      if (count > 0) {
        const replyMessage: IMessage = {
          _id: Math.random().toString(),
          text: reply.text,
          createdAt: new Date(),
          user: {
            _id: "2",
            name: "C6",
            avatar: "https://placeimg.com/140/140/tech",
          },
        };
        await saveMessageToFirestore({
          text: replyMessage.text,
          user: c6_user,
          userId: c6_user._id,
          roomId: user.uid,
        });
        // Add the bot's reply to the chat
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [replyMessage])
        );
      }
      count++;
    }

    // Reset texts
    setLoading(false);
  };

  // Customize message bubble appearance
  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#4F46E5" }, // Black for user messages
        left: { backgroundColor: "#1A1A1A" }, // Bone for AI messages
      }}
      textStyle={{
        right: { color: "#FFFFFF" },
        left: { color: "#FFFFFF" },
      }}
    />
  );

  // Add action button for picking images
  const renderActions = (props: any) => (
    <Actions
      {...props}
      onPressActionButton={pickImage}
      icon={() => <AntDesign name="plus" size={24} color="black" />} // Use an emoji or a text icon
    />
  );

  // Render custom composer for text input if an image is selected
  const renderComposer = (props: any) => {
    if (image) {
      return (
        <View className="flex-1 p-1">
          <View className="p-2">
            <Image source={{ uri: image }} style={styles.previewImage} />
          </View>

          <View style={styles.imageComposer}>
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={setText}
              placeholder="Add a caption..."
            />
            <Button title="Send" onPress={handleSendImageMessage} />
          </View>
        </View>
      );
    }
    return false;
    // return (
    //   <View className="flex-1 m-2 bg-red-50">
    //     <TextInput style={styles.textInput} {...props} />
    //   </View>
    // );
  };
  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View style={{ padding: 10 }}> */}
      {/* Back Button in Top Left */}
      <TouchableOpacity
        onPress={() => router.replace("/")} // Navigate back
        style={{
          position: "absolute",
          top: 30, // Adjust for status bar
          left: 5,
          zIndex: 10,
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
          paddingTop: 20,
        }}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        {/* <Text style={{ color: "black", fontSize: 18, marginLeft: 5 }}>
            Back
          </Text> */}
      </TouchableOpacity>
      {/* </View> */}
      <View style={{ flex: 1, backgroundColor: "#F4F2ED" }}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: "1", // Current user ID
          }}
          renderBubble={renderBubble}
          renderActions={renderActions}
          renderComposer={renderComposer}
          isTyping={loading_}
        />
        {/* Nutrition Summary Popup */}
        {dialogVisible && (
          <NutritionDialog
            visible={dialogVisible}
            onClose={() => setDialogVisible(false)}
            meal_id=""
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageComposer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    display: "flex",
    minWidth: "100%",
  },
  textInput: {
    flex: 1, // Makes the TextInput take up remaining space
    borderWidth: 1, // Optional: Add a border
    borderColor: "#ccc", // Optional: Border color
    borderRadius: 8, // Optional: Rounded corners
    paddingHorizontal: 10, // Optional: Padding inside the TextInput
    height: 40, // Adjust the height to match the Button
  },
  previewImage: {
    width: 100,
    height: 100,
    marginRight: 8,
  },
  sendButtonImage: {
    flex: 1,
  },
});
// https://d001-2405-9800-bca0-c7b7-1c87-d6f8-bf6a-552c.ngrok-free.app
// curl -X POST "https://d001-2405-9800-bca0-c7b7-1c87-d6f8-bf6a-552c.ngrok-free.app/9fc93aca-a44f-0f64-bfae-2ed40110f88b/message" \
//      -H "Content-Type: application/json" \
//      -d '{"text": "Hello!", "userId": "test-user"}'
