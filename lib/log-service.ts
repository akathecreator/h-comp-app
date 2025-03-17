import {
  getDocs,
  orderBy,
  Timestamp,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { startOfDay, endOfDay, subDays, format, addDays } from "date-fns";
import WeeklyData from "@/types/weeklyData";

//fetch weight logs
//fetch meals to calculate calories
//fetch activity to tag activity

export const fetchWeeklyLogs = async (
  userId: string,
  startWeek: Date,
  endWeek: Date
) => {
  console.log(startWeek, endWeek);
  const activityRef = collection(db, "logs");
  const start = Timestamp.fromDate(startOfDay(startWeek)); // Midnight of the day
  const end = Timestamp.fromDate(endOfDay(endWeek)); // End of the day
  const q = query(
    activityRef,
    where("user_id", "==", userId),
    where("timestamp", ">=", start),
    where("timestamp", "<=", end)
  );
  const querySnapshot = await getDocs(q);
  const logsByDate = {};

  // 🔹 Process fetched logs
  querySnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const date = format(data.timestamp.toDate(), "yyyy-MM-dd"); // Format to YYYY-MM-DD

    if (!logsByDate[date]) {
      logsByDate[date] = {
        date,
        calories: 0,
        burned: 0,
        sleep: 0,
        weight: null,
      };
    }

    if (data.type === "food") {
      logsByDate[date].calories += data.total_calories || 0;
    } else if (data.type === "activity") {
      logsByDate[date].burned += data.calories_burned || 0;
    } else if (data.type === "sleep") {
      logsByDate[date].sleep = data.sleep_hours ?? logsByDate[date].sleep; // Update sleep if available
    } else if (data.type === "weight") {
      logsByDate[date].weight = data.weight ?? logsByDate[date].weight; // Update weight if available
    }
  });

  // 🔹 Generate a full 7-day array (Monday-Sunday)
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = format(addDays(startWeek, i), "yyyy-MM-dd");
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
//   console.log(weeklyData);

  return weeklyData;
};
