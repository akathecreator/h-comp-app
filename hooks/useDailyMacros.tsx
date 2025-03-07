import { useState, useEffect } from "react";
import { fetchDailyMacros } from "@/lib/firebase"; // Adjust the path to your function
import { useGlobalContext } from "@/lib/global-provider";

interface DailyMacros {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalBurn: number;
}

const useDailyMacros = (date: Date) => {
  const { user } = useGlobalContext(); // Get the current user
  const [dailyMacros, setDailyMacros] = useState<DailyMacros>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    totalBurn: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMacros = async () => {
      if (!user) return;

      setLoading(true);
      setError(null); // Reset error

      try {
        const macros = await fetchDailyMacros(user.uid, date);
        setDailyMacros(macros);
      } catch (error) {
        console.error("Error fetching daily macros:", error);
        setError("Failed to fetch daily macros");
      } finally {
        setLoading(false);
      }
    };

    fetchMacros();
  }, [user, date]); // Refetch when `user` or `date` changes

  return { dailyMacros, loading, error };
};

export default useDailyMacros;
