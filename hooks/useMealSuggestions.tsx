import { useEffect, useState } from "react";
import {
  onSnapshot,
  query,
  where,
  collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Meal {
  name: string;
  calories: number;
  ingredients: string[];
  timestamp: string | number;
  type: "suggested" | string;
  user_id: string;
  image_url?: string;
  id?: string;
  day?: number;
  month?: number;
  year?: number;
  status: "show" | "hide";
}

const useMealSuggestions = (userId: string, date: Date = new Date()) => {
  const [mealSuggestions, setMealSuggestions] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  console.log(date)
  useEffect(() => {
    if (!userId || !date) return;

    const day = date.getDate();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const year = date.getFullYear();

    const mealsRef = collection(db, "meal_suggestions");
    const q = query(
      mealsRef,
      where("owner_id", "==", userId),
      where("day", "==", day),
      where("month", "==", month),
      where("year", "==", year)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const suggestions = snapshot.docs.map((doc) => {
        const data = doc.data() as Meal;
        return {
          ...data,
          id: doc.id,
          day: day,
          month: month,
          year: year,
        };
      });
      const filteredSuggestions = suggestions.filter(
        (meal) => meal.status !== "hide"
      );
      setMealSuggestions(filteredSuggestions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, date]);

  return { mealSuggestions, loading };
};

export default useMealSuggestions;
