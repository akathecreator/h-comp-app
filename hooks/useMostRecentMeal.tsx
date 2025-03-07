import { useEffect, useState } from "react";
import { fetchMostRecentMeal } from "@/lib/firebase";
const mealCache = new Map<string, Meal[]>();

interface Meal {
  id: string; // Document ID
  description: string; // Description of the meal
  image_url: string; // URL of the meal image
  timestamp: Object; // Timestamp of when the meal was logged
  total_calories: number; // Total calories in the meal
  total_protein: number; // Total protein in grams
  total_carbs: number; // Total carbs in grams
  total_fat: number; // Total fat in grams
  user_id: string; // ID of the user who logged the meal
  items?: string[];
}
const useMostRecentMeal = (userId: string, meal_id?: string) => {
  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    // Create a unique cache key based on userId and date

    const fetchData = async () => {
      setLoading(true);
      try {
        const meals = await fetchMostRecentMeal(userId, meal_id);
        setRecentMeals(meals);
      } catch (error) {
        console.error("Error fetching recent meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, meal_id]); // Re-fetch meals only when userId or date changes

  return { recentMeals, loading };
};

export default useMostRecentMeal;
