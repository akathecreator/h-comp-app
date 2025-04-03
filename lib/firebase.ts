import {
  getAuth,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
  signInWithCredential,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  Firestore,
  addDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  FieldValue,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { initializeApp, FirebaseApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { startOfDay, endOfDay, subDays, format } from "date-fns";
// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
// const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage = getStorage(app);

const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Export Firebase references for reuse
export { auth, db, storage, FieldValue };
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
// Login Function
export async function loginWithGoogle() {
  try {
    const [request, response, promptAsync] = Google.useAuthRequest({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      scopes: ["profile", "email"],
      redirectUri: makeRedirectUri({
        scheme: "com.archbishop.c6companion",
        path: "oauthredirect",
      }),
    });

    // Prompt the Google login popup
    const result = await promptAsync();

    if (result.type === "success" && result.authentication) {
      const { idToken } = result.authentication;

      // Use the token to sign in with Firebase
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential.user;
    }

    throw new Error("Google login failed");
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
}
interface ConsolidatedData {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalBurn: number;
}
export const fetchDailyMacros = async (
  userId: string,
  date: Date
): Promise<ConsolidatedData> => {
  try {
    const mealsRef = collection(db, "logs");

    // Calculate start and end of the day
    const start = Timestamp.fromDate(startOfDay(date)); // Midnight of the day
    const end = Timestamp.fromDate(endOfDay(date)); // End of the day
    // Query Firestore
    const q = query(
      mealsRef,
      where("user_id", "==", userId),
      where("timestamp", ">=", start),
      where("timestamp", "<=", end)
    );

    const querySnapshot = await getDocs(q);

    // Consolidate macros and calories
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalBurn = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalCalories += data.total_calories || 0;
      totalProtein += data.total_protein || 0;
      totalCarbs += data.total_carbs || 0;
      totalFats += data.total_fat || 0;
      totalBurn += data.calories_burned || 0;
    });

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      totalBurn,
    };
  } catch (error) {
    console.error("Error fetching daily macros:", error);
    throw new Error("Failed to fetch daily macros.");
  }
};
// Logout Function
export async function logout(): Promise<boolean> {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
}

// Get Current User
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => resolve(user), reject);
  });
}

export const fetchRecentMeals = async (
  userId: string,
  date: Date,
  all: string = "false"
): Promise<Meal[]> => {
  try {
    console.log(date);
    const mealsRef = collection(db, "logs");
    // Define the start and end of the given day
    // Define start and end of the day using Firestore Timestamp
    const start = Timestamp.fromDate(startOfDay(date)); // Midnight of the day
    const end = Timestamp.fromDate(endOfDay(date)); // End of the day
    let q;

    if (all === "true") {
      q = query(
        mealsRef,
        where("user_id", "==", userId),
        // where("timestamp", ">=", start),
        // where("timestamp", "<=", end),
        orderBy("timestamp", "desc") // Order meals by time of day
      );
    } else {
      q = query(
        mealsRef,
        where("user_id", "==", userId),
        where("timestamp", ">=", start),
        where("timestamp", "<=", end)
      );
    }
    // Construct the query

    const querySnapshot = await getDocs(q);

    // Map the documents to the Meal interface
    const meals = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Ensure all fields in the Meal interface are present
      return {
        id: doc.id,
        description: data.description,
        meal_name: data.meal_name,
        image_url: data.image_url,
        timestamp: data.timestamp?.toDate() || new Date(),
        total_calories: data.total_calories,
        total_protein: data.total_protein,
        total_carbs: data.total_carbs,
        total_fat: data.total_fat,
        user_id: data.user_id,
        type: data.type,
      } as Meal;
    });

    return meals.filter((meal) => meal.type === "food");
  } catch (error) {
    console.error("Error fetching recent meals:", error);
    return [];
  }
};

export const fetchMostRecentMeal = async (
  userId: string,
  meal_id?: string
): Promise<Meal[]> => {
  try {
    const mealsRef = collection(db, "logs");
    if (meal_id) {
      // Fetch meal by document ID
      const mealDocRef = doc(mealsRef, meal_id);
      const mealDoc = await getDoc(mealDocRef);

      if (mealDoc.exists()) {
        const data = mealDoc.data();

        // Fetch subcollection 'meal_items'
        const foodsRef = collection(mealDocRef, "meal_items");
        const foodsSnapshot = await getDocs(foodsRef);

        // Extract food items
        const items = foodsSnapshot.docs.map(
          (foodDoc) => foodDoc.data().food_name
        );

        // Construct and return the meal object
        return [
          {
            id: mealDoc.id,
            description: data.description,
            meal_name: data.meal_name,
            image_url: data.image_url,
            timestamp: data.timestamp,
            total_calories: data.total_calories,
            total_protein: data.total_protein,
            total_carbs: data.total_carbs,
            total_fat: data.total_fat,
            user_id: data.user_id,
            items,
            type: data.type,
          },
        ];
      } else {
        console.warn("No meal found for the provided ID.");
        return [];
      }
    } else {
      // Query to get the most recent meal
      const q = query(
        mealsRef,
        where("user_id", "==", userId),
        orderBy("timestamp", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      // Map the documents to the Meal interface
      const meals = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          console.log(data);
          // Fetch the subcollection 'foods'
          const foodsRef = collection(doc.ref, "meal_items");
          const foodsSnapshot = await getDocs(foodsRef);

          // Extract `food_name` fields into an array
          const items = foodsSnapshot.docs.map(
            (foodDoc) => foodDoc.data().food_name
          );

          // Construct the Meal object
          return {
            id: doc.id,
            description: data.description,
            meal_name: data.meal_name,
            image_url: data.image_url,
            timestamp: data.timestamp,
            total_calories: data.total_calories,
            total_protein: data.total_protein,
            total_carbs: data.total_carbs,
            total_fat: data.total_fat,
            user_id: data.user_id,
            items, // Include the `food_name` array
            type: data.type,
          } as Meal;
        })
      );

      return meals;
    }
  } catch (error) {
    console.error("Error fetching recent meals:", error);
    return [];
  }
};

export const removeMeal = async (meal_id: string): Promise<void> => {
  try {
    // Reference the document in the "meals" collection using meal_id
    const mealDocRef = doc(db, "logs", meal_id);

    // Delete the document
    await deleteDoc(mealDocRef);

    console.log(`Meal with ID ${meal_id} has been deleted successfully.`);
  } catch (error) {
    console.error("Error removing meal:", error);
    throw new Error("Failed to delete the meal. Please try again.");
  }
};

// Define a type for your Firestore documents.
interface Property {
  id?: string;
  name: string;
  type: string;
  createdAt: string;
}

/**
 * Updates the user profile in Firestore.
 * @param profile - The updated profile object.
 */
export const updateProfile = async (profile: any) => {
  try {
    // Reference to the Firestore document
    const profileRef = doc(db, "users", profile.id);

    // Update the document
    await updateDoc(profileRef, {
      fullName: profile.fullName,
      nickName: profile.nickName,
      email: profile.email,
      height: profile.height,
      weight: profile.weight,
      activityLevel: profile.activityLevel,
      healthGoal: profile.healthGoal,
      notifications: {
        hydrationReminders: profile.notifications.hydrationReminders,
        mealReminders: profile.notifications.mealReminders,
      },
    });

    console.log("Profile updated successfully");
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
export async function getLatestProperties(): Promise<Property[]> {
  try {
    const propertiesRef = collection(db, "properties");
    const q = query(propertiesRef, orderBy("createdAt", "asc"), limit(5));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Property)
    );
  } catch (error) {
    console.error("Error fetching latest properties:", error);
    return [];
  }
}
/**
 * Fetch chat messages for a specific chat room.
 * @param chatRoomId - The ID of the chat room to fetch messages for.
 * @param setMessages - Function to update state with fetched messages.
 * @returns Function to unsubscribe from the Firestore listener.
 */
export const fetchUserMessages = (
  userId: string,
  setMessages: (messages: any[]) => void
) => {
  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("roomId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    console.log("snapshot", snapshot.size);
    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        _id: doc.id || `${Date.now()}-${Math.random()}`,
        text: data.text || "",
        createdAt: data.createdAt?.toDate() || new Date(),
        image: data.imageUrl || undefined,
        user: {
          _id: data.user?._id || "unknown",
          name: data.user?.name || "Unknown",
          avatar: data.user?.avatar || "",
        },
      };
    });

    const uniqueMessages = [
      ...new Map(messages.map((msg) => [msg._id, msg])).values(),
    ];
    setMessages(uniqueMessages);
  });

  return unsubscribe;
};
export const fetchUserMessagesOnce = async (userId: string) => {
  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("roomId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  const messages = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      _id: doc.id,
      text: data.text || "",
      createdAt: data.createdAt?.toDate() || new Date(),
      image: data.imageUrl || undefined,
      user: {
        _id: data.user?._id || "unknown",
        name: data.user?.name || "Unknown",
        avatar: data.user?.avatar || "",
      },
    };
  });

  return messages;
};
export const saveMessageToFirestore = async (message: {
  text?: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  userId: string;
  image?: string | null;
  roomId?: string;
}): Promise<string | boolean> => {
  try {
    const chatsRef = collection(db, "chats");
    const docRef = await addDoc(chatsRef, {
      text: message.text || "",
      userId: message.userId,
      userName: message.user.name,
      avatar: message.user.avatar,
      createdAt: serverTimestamp(),
      imageUrl: message.image || null,
      roomId: message.roomId,
      user: {
        // Added nested user object to match fetch format
        _id: message.user._id,
        name: message.user.name,
        avatar: message.user.avatar,
      },
    });

    console.log("Message saved successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

export const fetchWeightLogs = async ({ userId }: { userId: string }) => {
  const weightLogsRef = collection(db, "logs");

  let q = query(
    weightLogsRef,
    where("user_id", "==", userId),
    where("type", "==", "weight"),
    orderBy("timestamp", "desc")
  );

  // Apply pagination if lastVisible is provided

  // One-time fetch
  const snapshot = await getDocs(q);
  const logs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate(),
  }));
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];
  return { logs, lastVisible };
};

export async function fetchWeightData(userId: string) {
  try {
    const weightsRef = collection(db, "logs");
    const q = query(
      weightsRef,
      where("user_id", "==", userId),
      where("type", "==", "weight"),
      orderBy("timestamp", "asc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      weight: doc.data().weight,
      timestamp: doc.data().timestamp?.toDate(),
    }));
  } catch (error) {
    console.error("Error fetching weight data:", error);
    return [];
  }
}

export const getCaloricData = async (userId: string) => {
  try {
    const mealsRef = collection(db, "meals");

    // Calculate date range: 7 days ago to today
    const sevenDaysAgo = subDays(new Date(), 7);
    const start = Timestamp.fromDate(startOfDay(sevenDaysAgo));
    const end = Timestamp.fromDate(endOfDay(new Date()));

    const q = query(
      mealsRef,
      where("user_id", "==", userId),
      where("timestamp", ">=", start),
      where("timestamp", "<=", end),
      orderBy("timestamp", "asc")
    );

    const snapshot = await getDocs(q);

    // Process and aggregate data
    const dailyCalories: Record<string, number> = {};

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const date = format(data.timestamp.toDate(), "MM/dd"); // Format timestamp as MM/dd

      if (!dailyCalories[date]) {
        dailyCalories[date] = 0;
      }
      dailyCalories[date] += data.total_calories || 0; // Add calories for this meal
    });

    // Convert the aggregated data into an array of objects
    const result = Object.keys(dailyCalories).map((date) => ({
      date,
      calories: dailyCalories[date],
    }));
    console.log(result);

    return result;
  } catch (error) {
    console.error("Error fetching caloric data:", error);
    return [];
  }
};

export const getMacronutrientData = async (userId: string) => {
  try {
    const mealsRef = collection(db, "meals");

    // Calculate date range: 7 days ago to today
    const sevenDaysAgo = subDays(new Date(), 7);
    const start = Timestamp.fromDate(startOfDay(sevenDaysAgo));
    const end = Timestamp.fromDate(endOfDay(new Date()));

    const q = query(
      mealsRef,
      where("user_id", "==", userId),
      where("timestamp", ">=", start),
      where("timestamp", "<=", end),
      orderBy("timestamp", "asc")
    );

    const snapshot = await getDocs(q);

    // Process and aggregate data
    const dailyMacros: Record<
      string,
      { protein: number; carbs: number; fats: number }
    > = {};

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const date = format(data.timestamp.toDate(), "MM/dd"); // Format timestamp as MM/dd

      if (!dailyMacros[date]) {
        dailyMacros[date] = { protein: 0, carbs: 0, fats: 0 };
      }

      // Add protein, carbs, and fats for this meal
      dailyMacros[date].protein += data.total_protein || 0;
      dailyMacros[date].carbs += data.total_carbs || 0;
      dailyMacros[date].fats += data.total_fat || 0;
    });

    // Convert the aggregated data into an array of objects
    const result = Object.keys(dailyMacros).map((date) => ({
      date,
      protein: dailyMacros[date].protein,
      carbs: dailyMacros[date].carbs,
      fats: dailyMacros[date].fats,
    }));
    console.log(result);

    return result;
  } catch (error) {
    console.error("Error fetching macronutrient data:", error);
    return [];
  }
};

export const saveExpoPushToken = async (
  userId: string,
  expoPushToken: string
) => {
  try {
    // Reference to the user document
    const userRef = doc(db, "users", userId);

    // Update the user's document with the Expo Push Token
    await setDoc(
      userRef,
      { expoPushToken }, // Save the token
      { merge: true } // Merge with existing data
    );

    console.log("Expo Push Token saved successfully.");
  } catch (error) {
    console.error("Error saving Expo Push Token:", error);
  }
};
