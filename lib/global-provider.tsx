import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Ensure you have Firestore initialized

interface UserProfile {
  nickname: string;
  age: number;
  gender: "male" | "female";
  goals: {
    primary_goal: "lose_weight" | "gain_muscle" | "maintain" | string;
    target_weight_kg: number;
    current_weight_kg: number;
    height_cm: number;
  };
  isOnboarded: boolean;
  diet: {
    eating_style: string[]; // e.g. ["delivery", "outside"]
    diet_type: "normal" | "vegetarian" | "vegan" | string;
    diet_type_custom: string;
    disliked_foods: string[];
    allergies: string[];
    meal_times: {
      breakfast: string; // "HH:mm"
      lunch: string;
      dinner: string;
    };
  };
  activity: {
    activity_level: "none" | "light" | "moderate" | "heavy";
    preferred_workouts: string[];
    limitations: string[];
  };
  personalization: {
    tone: "supportive" | "informative" | "funny" | "tough_love";
    language: "en" | "th";
    country: string;
    suggestive_preference: string; // e.g. "I want meal plans"
  };
  notifications: {
    reminder_times: string[]; // e.g. ["morning", "evening"]
    reminder_types: string[]; // e.g. ["meals", "water", "workouts"]
  };
  created_at: any; // Firebase FieldValue.serverTimestamp
  last_updated: any; // Firebase FieldValue.serverTimestamp
  metrics: {
    bmi: number;
    bmi_category: "underweight" | "normal" | "overweight" | "obese" | string;
    bmr: number;
    tdee: number;
    calorie_target: number;
    last_calculated: any; // Firebase FieldValue.serverTimestamp
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
  userProfile: UserProfile;
  loading: boolean;
  lifeGroup: string;
  date: Date;
  refetchUserProfile: () => Promise<void>;
  setDate: (date: Date) => void;
  setLifeGroup: (lifeGroup: string) => void;
  dialogVisible: boolean;
  setDialogVisible: (dialogVisible: boolean) => void;
  loadingFood: boolean;
  setLoadingFood: (loadingFood: boolean) => void;
}

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
  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser.uid);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    console.log("fetching profile");
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        console.log("profile fetched", doc.data());
        const profile = doc.data() as UserProfile;
        setUserProfile(profile);
      } else {
        console.error("User profile not found.");
        setUserProfile(null);
      }
    });

    return unsubscribe; // Allow cleanup
  };

  const refetchUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    }
  };

  const isLogged = !!user;

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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;
