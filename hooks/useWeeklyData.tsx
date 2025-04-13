import { useState, useEffect } from "react";
import { startOfWeek, addDays, format, subWeeks, addWeeks } from "date-fns";
import { fetchWeeklyLogs } from "@/lib/log-service"; // 🔹 Assume this function fetches logs per day
interface WeeklyLog {
  date: string;
  calories?: number;
  weight?: number;
}

const useWeeklyLogs = (userId?: string, weekStart?: Date) => {
  const [weeklyLogs, setWeeklyLogs] = useState<WeeklyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      setLoading(true);
      const _weekStart = startOfWeek(weekStart, { weekStartsOn: 1 }); // ✅ Get Monday
      const _weekEnd = addDays(_weekStart, 6);
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        return format(addDays(_weekStart, i), "yyyy-MM-dd");
      });

      try {
        // 🔹 Fetch logs ONCE for the whole week
        const logs = await fetchWeeklyLogs(userId, _weekStart, _weekEnd);
        console.log("Fetched logs:", logs);

        // 🔹 Create an object to group logs by date
        const logsByDate = {};
        logs.forEach((log) => {
          const date = format(new Date(log.date), "yyyy-MM-dd");
          if (!logsByDate[date]) {
            logsByDate[date] = {
              date,
              calories: 0,
              burned: 0,
              sleep: null,
              weight: null,
            };
          }
          logsByDate[date].calories += log.calories || 0;
          logsByDate[date].burned += log.burned || 0;
          logsByDate[date].sleep = log.sleep ?? logsByDate[date].sleep;
          logsByDate[date].weight = log.weight ?? logsByDate[date].weight;
        });

        // 🔹 Ensure the array always includes Monday-Sunday
        const fullWeek = Array.from({ length: 7 }, (_, i) => {
          const date = format(addDays(_weekStart, i), "yyyy-MM-dd");
          return (
            logsByDate[date] || {
              date,
              calories: 0,
              burned: 0,
              sleep: null,
              weight: null,
            }
          );
        });

        setWeeklyLogs(fullWeek);
      } catch (error) {
        console.error("Error fetching weekly logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [weekStart]);

  return { weeklyLogs, loading };
};

export default useWeeklyLogs;
