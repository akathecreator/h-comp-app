import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } else {
    alert("Must use physical device for Push Notifications");
    return;
  }

  return token;
}

async function savePushTokenToUser(token: string) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return;

  const db = getFirestore();
  const userRef = doc(db, "users", user.uid); // or wherever your user doc lives

  await updateDoc(userRef, {
    expoPushToken: token,
  });
}

export { registerForPushNotificationsAsync, savePushTokenToUser };