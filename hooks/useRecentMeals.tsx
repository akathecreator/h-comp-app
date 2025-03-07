import { useEffect, useState } from "react";
import { fetchRecentMeals } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
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
const useRecentMeals = (userId: string, date: Date= new Date(), all: string = "false") => {
  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId || !date) return;

    // Create a unique cache key based on userId and date
    const cacheKey = `${userId}-${date.toISOString().split("T")[0]}`;

    // Check if the data is already cached
    if (mealCache.has(cacheKey)) {
      setRecentMeals(mealCache.get(cacheKey)!); // Retrieve from cache
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const meals = await fetchRecentMeals(userId, date, all);
        mealCache.set(cacheKey, meals); // Cache the result
        setRecentMeals(meals);
      } catch (error) {
        console.error("Error fetching recent meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, date]); // Re-fetch meals only when userId or date changes

  return { recentMeals, loading };
};

export default useRecentMeals;
