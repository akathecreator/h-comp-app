import { useEffect, useState } from "react";
import { db, fetchRecentMeals } from "@/lib/firebase";
import {
  collection,
  Timestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { endOfDay, startOfDay } from "date-fns";

const mealCache = new Map<string, Meal[]>();

interface Meal {
  id: string; // Document ID
  description: string; // Description of the meal
  image_url: string; // URL of the meal image
  timestamp: Timestamp; // Timestamp of when the meal was logged
  total_calories: number; // Total calories in the meal
  total_protein: number; // Total protein in grams
  total_carbs: number; // Total carbs in grams
  total_fat: number; // Total fat in grams
  user_id: string; // ID of the user who logged the meal
}
const useRecentMeals = (userId: string, date: Date, all: string = "false") => {
  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId || !date) return;

    const cacheKey = `${userId}-${date.toISOString().split("T")[0]}`;

    // Serve from cache if available
    if (mealCache.has(cacheKey)) {
      setRecentMeals(mealCache.get(cacheKey)!);
      setLoading(false);
    }

    const mealsRef = collection(db, "logs");
    const start = Timestamp.fromDate(startOfDay(date));
    const end = Timestamp.fromDate(endOfDay(date));

    let q;

    if (all === "true") {
      q = query(
        mealsRef,
        where("user_id", "==", userId),
        orderBy("timestamp", "desc")
      );
    } else {
      q = query(
        mealsRef,
        where("user_id", "==", userId),
        where("timestamp", ">=", start),
        where("timestamp", "<=", end),
        orderBy("timestamp", "desc")
      );
    }

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const meals = snapshot.docs
          .map((doc) => {
            const data = doc.data();
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
          })
          .filter((meal) => meal.type === "food");

        mealCache.set(cacheKey, meals); // Update cache
        setRecentMeals(meals);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching real-time recent meals:", error);
        setRecentMeals([]);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userId, date]);

  return { recentMeals, loading };
};

export default useRecentMeals;
