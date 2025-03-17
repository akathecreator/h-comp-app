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
  id: string;
  fullName: string;
  nickName: string;
  email: string;
  activityLevel: string; // e.g., "High", "Moderate"
  age: number;
  gender: string; // e.g., "Male", "Female"
  dietaryPreferences: string; // e.g., "Vegetarian", "None"
  foodAllergies: string; // e.g., "nuts", "none"
  healthGoal: string; // e.g., "Lose Weight", "Maintain Weight"
  height: string; // e.g., "178cm"
  weight: string; // e.g., "83.5kg"
  notifications: {
    hydrationReminders: boolean;
    mealReminders: boolean;
  };
  createdAt: Date | null;
  bmi: {
    status: string; // e.g., "overweight"
    value: number; // e.g., 26.2
    createdAt: Date | null;
  };
  daily_calories: {
    goal: number; // e.g., 1984
    maintenance: number; // e.g., 2480
  };
  streaks: {
    on_going: number;
  };
  level_meta: {
    level: number;
    experience: number;
    next_level: number;
  };
  macronutrients: {
    max: {
      carbs_g: number; // e.g., 225
      fats_g: number; // e.g., 83
      protein_g: number; // e.g., 150
    };
    suggested: {
      carbs_g: number; // e.g., 180
      fats_g: number; // e.g., 66
      protein_g: number; // e.g., 125
    };
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
  // finance | health | gym | habits
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

  // Fetch user profile from Firestore
  // const fetchUserProfile = async (userId: string) => {
  //   try {
  //     const userDocRef = doc(db, "users", userId); // Ensure `users` is your Firestore collection
  //     const userDoc = await getDoc(userDocRef);
  //     if (userDoc.exists()) {
  //       const profileData = userDoc.data();
  //       setUserProfile(profileData as UserProfile);
  //     } else {
  //       console.error("User profile not found in Firestore.");
  //       setUserProfile(null);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch user profile:", error);
  //   }
  // };
  const fetchUserProfile = (userId: string) => {
    const userDocRef = doc(db, "users", userId);
  
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data() as UserProfile);
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
