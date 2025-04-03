import { useEffect, useState } from "react";

import { getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { query, collection, where } from "firebase/firestore";
import { startOfDay, endOfDay, subDays, format } from "date-fns";
const activityCache = new Map<string, Activity[]>();

interface Activity {
  activity_name: string; // Name of the activity (e.g., "badminton")
  calories_burned: number; // Calories burned during the activity
  duration_minutes: number; // Duration in minutes
  intensity: "low" | "moderate" | "high"; // Intensity level
  timestamp: string | number; // Timestamp (ISO string or UNIX timestamp)
  type: "activity"; // Type of log (fixed as "activity")
  user_id: string; // ID of the user who logged the activity
}

const useRecentActivity = (
  userId: string,
  date: any = new Date(),
  all: string = "false"
) => {
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId || !date) return;
    const fetchRecentActivity = async (
      userId: string,
      date: any,
      all: string = "false"
    ) => {
      const activityRef = collection(db, "logs");
      // Define the start and end of the given day
      // Define start and end of the day using Firestore Timestamp
      const start = Timestamp.fromDate(startOfDay(date)); // Midnight of the day
      const end = Timestamp.fromDate(endOfDay(date)); // End of the day
      let q;
      if (all === "true") {
        q = query(
          activityRef,
          where("user_id", "==", userId),
          // where("timestamp", ">=", start),
          // where("timestamp", "<=", end),
          orderBy("timestamp", "desc") // Order meals by time of day
        );
      } else {
        q = query(
          activityRef,
          where("user_id", "==", userId),
          where("timestamp", ">=", start),
          where("timestamp", "<=", end)
        );
      }
      const querySnapshot = await getDocs(q);

      // Map the documents to the Meal interface
      const activities = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Activity;
        return {
          id: doc.id,
          activity_name: data.activity_name,
          calories_burned: data.calories_burned,
          duration_minutes: data.duration_minutes,
          intensity: data.intensity,
          timestamp: data.timestamp,
          type: data.type,
          user_id: data.user_id,
        };
      });
      const rActivities = activities.filter(
        (activity) => activity.type === "activity"
      );
      setRecentActivity(rActivities);
      setLoading(false);
    };

    fetchRecentActivity(userId, date, all);
  }, [userId, date]); // Re-fetch meals only when userId or date changes

  return { recentActivity, loading };
};

export default useRecentActivity;
