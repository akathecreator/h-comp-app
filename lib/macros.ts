import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { startOfDay, endOfDay } from "date-fns";

export const subscribeToDailyMacros = (
  userId: string,
  date: Date,
  callback: (data: ConsolidatedData) => void,
  onError: (error: any) => void
) => {
  const mealsRef = collection(db, "logs");

  const start = Timestamp.fromDate(startOfDay(date));
  const end = Timestamp.fromDate(endOfDay(date));

  const q = query(
    mealsRef,
    where("user_id", "==", userId),
    where("timestamp", ">=", start),
    where("timestamp", "<=", end)
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFats = 0;
      let totalBurn = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalCalories += data.total_calories || 0;
        totalProtein += data.total_protein || 0;
        totalCarbs += data.total_carbs || 0;
        totalFats += data.total_fat || 0;
        totalBurn += data.calories_burned || 0;
      });

      callback({
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFats,
        totalBurn,
      });
    },
    (error) => {
      console.error("Real-time daily macros error:", error);
      onError(error);
    }
  );

  return unsubscribe;
};
