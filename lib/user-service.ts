import { db } from "./firebase";
import { collection } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";

export const updateUserProfile = async (uid: string, updatedDoc: any) => {
  const userRef = doc(collection(db, "users"), uid);
  await updateDoc(userRef, updatedDoc);
};
