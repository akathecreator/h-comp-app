import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signOut,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth, db } from "@/lib/firebase"; // Your Firebase setup
import Purchases, { LOG_LEVEL} from 'react-native-purchases';
import * as Device from "expo-device";
// --- Interfaces ---

interface UserProfile {
  nickname: string;
  age: number;
  gender: "male" | "female";
  goals: {
    primary_goal: string;
    target_weight_kg: number;
    current_weight_kg: number;
    height_cm: number;
  };
  isOnboarded: boolean;
  diet: {
    eating_style: string[];
    diet_type: string;
    diet_type_custom: string;
    disliked_foods: string[];
    allergies: string[];
    meal_times: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
  };
  activity: {
    activity_level: string;
    preferred_workouts: string[];
    limitations: string[];
  };
  personalization: {
    tone: string;
    language: string;
    country: string;
    suggestive_preference: string;
  };
  notifications: {
    reminder_times: string[];
    reminder_types: string[];
  };
  created_at: any;
  last_updated: any;
  metrics: {
    bmi: number;
    bmi_category: string;
    bmr: number;
    tdee: number;
    calorie_target: number;
    last_calculated: any;
  };
  daily_calories: {
    goal: number;
    maintenance: number;
  };
  macronutrients: {
    max: {
      carbs_g: number;
      fats_g: number;
      protein_g: number;
    };
    suggested: {
      carbs_g: number;
      fats_g: number;
      protein_g: number;
    };
  };
  uuid: string;
  streaks: {
    on_going: number;
    consecutive_days: number;
  };
}

interface GlobalContextType {
  isLogged: boolean;
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  lifeGroup: string;
  date: Date;
  refetchUserProfile: () => Promise<void>;
  setDate: (date: Date) => void;
  setLifeGroup: (lifeGroup: string) => void;
  dialogVisible: boolean;
  setDialogVisible: (visible: boolean) => void;
  loadingFood: boolean;
  setLoadingFood: (loading: boolean) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  clearAndLogout: () => Promise<void>; // 👈 NEW
}

// --- Context Setup ---

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [date, setDate] = useState<Date>(new Date());
  const [lifeGroup, setLifeGroup] = useState<string>("Health");
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [loadingFood, setLoadingFood] = useState<boolean>(false);

  const isLogged = !!user;

  // 👇 This handles logout + storage clearing
  const clearAndLogout = async () => {
    try {
      console.log("🚨 Clearing storage and signing out...");
      await AsyncStorage.clear();
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error("❌ Failed to clear and logout:", err);
    }
  };

  // Monitor Firebase auth
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  //     setUser(currentUser);
  //     if (currentUser) {
  //       await fetchUserProfile(currentUser.uid);
  //     }
  //     setLoading(false);
  //   });
  //   return () => unsubscribe();
  // }, []);
  //with rev
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser.uid);

        // ✅ RevenueCat setup here
        try {
          Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
          await Purchases.configure({
            apiKey: "appl_VLmHcPZampSHPqkoVEzGcKurCNm",
            appUserID: currentUser.uid,
          });
          console.log("🔑 RevenueCat initialized");
        } catch (e) {
          console.warn("⚠️ RevenueCat init failed:", e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    console.log("📡 Fetching user profile...");

    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const profile = doc.data() as UserProfile;
        // console.log("✅ Profile loaded", profile);
        setUserProfile(profile);
      } else {
        console.warn("⚠️ No user profile found.");
        setUserProfile(null);
        clearAndLogout();
      }
    });

    return unsubscribe;
  };

  const refetchUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        user,
        userProfile,
        setUserProfile,
        loading,
        lifeGroup,
        date,
        setDate,
        setLifeGroup,
        refetchUserProfile,
        dialogVisible,
        setDialogVisible,
        loadingFood,
        setLoadingFood,
        clearAndLogout, // 👈 Make available globally
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// --- Hook to use context ---

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  return context;
};

export default GlobalProvider;
