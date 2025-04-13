import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { sendForMealSuggestions } from "./chat";

//write a function to save user onbaording data  to firestore
export const saveOnboardingData = async (userData: any, uid: string) => {
  const userRef = doc(collection(db, "users"), uid);
  await updateDoc(userRef, userData);
  // await sendForMealSuggestions(uid);
};
