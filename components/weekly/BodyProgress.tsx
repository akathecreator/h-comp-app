import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Plus, X } from "lucide-react-native";
import { storage, db } from "@/lib/firebase"; // Make sure Firebase is initialized
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useGlobalContext } from "@/lib/global-provider";
import useProgressPhotos from "@/hooks/useProgressPhotos";
import { FlatList } from "react-native-gesture-handler";
import dayjs from "dayjs";
const BodyProgress = () => {
  const { photos, setPhotos } = useProgressPhotos();
  const { user } = useGlobalContext();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!user) return;

  const deleteImage = async (index: number, id: string) => {
    const updatedImages = photos.filter((_, i) => i !== index);
    setPhotos(updatedImages);
    const imageRef = doc(db, "users", user.uid, "progress_photos", id);
    await deleteDoc(imageRef);
  };

  // Open Image in Fullscreen Modal
  const openImage = (index: number) => setSelectedIndex(index);
  const closeModal = () => {
    setSelectedIndex(null);
  };

  const handleAddPhoto = async () => {
    Alert.alert("Upload Photo", "Choose a photo source", [
      { text: "Take Photo", onPress: () => pickImage("camera") },
      { text: "Upload from Gallery", onPress: () => pickImage("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };
  const confirmDelete = (index: number, id: string) => {
    Alert.alert(
      "Remove Image?",
      "Are you sure you want to delete this image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteImage(index, id),
          style: "destructive",
        },
      ]
    );
  };

  const pickImage = async (source: "camera" | "gallery") => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Denied",
        `Access to your ${source} is required to upload a photo.`
      );
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.7,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 1,
          });

    if (!result.canceled) await uploadImage(result.assets[0].uri);
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `progress_photos/${user.uid}/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "users", user.uid, "progress_photos"), {
        url: downloadURL,
        uploadedAt: Timestamp.now(),
        userId: user.uid,
      });

      Alert.alert("Success", "Photo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Upload Failed", "There was an issue uploading your photo.");
    }
  };

  return (
    <View className="p-4 bg-white rounded-lg">
      {/* Full-Screen Image Viewer Modal */}
      <Modal
        visible={selectedIndex !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-black items-center justify-center">
          {/* Close Button */}
          <TouchableOpacity
            className="absolute top-20 right-5 rounded-full z-50"
            onPress={closeModal}
          >
            <X size={32} color="white" />
          </TouchableOpacity>
          {/* Full-Screen Image */}
          <KeyboardAvoidingView
            behavior="padding"
            className="w-full h-full items-center justify-center"
          >
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentOffset={{ x: selectedIndex * 500, y: 0 }} // Adjust width dynamically
            >
              {photos.map((photo, index) => (
                <View
                  key={index}
                  className="w-screen h-full items-center justify-center"
                >
                  {/* Date on Top */}
                  <Text className="absolute top-20 text-white text-lg font-bold">
                    {dayjs(photo.uploadedAt.toDate()).format("MMM D, YYYY")}
                  </Text>

                  {/* Full-Screen Image */}
                  <Image
                    source={{ uri: photo.url }}
                    className="w-full h-5/6 rounded-lg"
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      <Text className="text-black font-bold text-lg">Body Progress</Text>

      {photos.length === 0 && (
        <Text className="text-grey text-sm mb-2">
          You can track your body progress daily or weekly here!
        </Text>
      )}

      <ScrollView showsHorizontalScrollIndicator={false} className="flex-row">
        {/* Add Photo Button */}
        <TouchableOpacity
          onPress={handleAddPhoto}
          className="mt-2 w-24 h-24 border-dashed border-2 border-newblue rounded-full flex items-center justify-center mr-3"
        >
          <Plus size={32} color="#847d3b" />
        </TouchableOpacity>

        {/* Display Progress Photos */}
        <FlatList
          data={photos}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          contentContainerStyle={{ paddingVertical: 16 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => openImage(index)}
              onLongPress={() => confirmDelete(index, item.id)}
            >
              <View className="relative w-28 h-28 items-center justify-center mx-1">
                {/* Date Above Image */}
                <Text className="absolute -top-4 text-gray-500 text-xs">
                  {dayjs(item.uploadedAt.toDate()).format("MMM D")}
                </Text>

                {/* Circular Image */}
                <Image
                  source={{ uri: item.url }}
                  className="w-24 h-24 rounded-full border border-gray-300"
                  resizeMode="cover"
                />

                {/* Date Below Image */}
                <Text className="absolute -bottom-4 text-gray-500 text-xs">
                  {dayjs(item.uploadedAt.toDate()).format("hh:mm A")}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
      <ImageBackground    
        source={require("@/assets/images/body.png")}
        className="flex-1 items-center justify-center h-40"
        imageStyle={{ borderRadius: 15 }}
      >
        {/* <Text className="text-white text-2xl font-bold">That's You</Text> */}
      </ImageBackground>
    </View>
  );
};

export default BodyProgress;
