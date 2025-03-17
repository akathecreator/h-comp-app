import { useEffect, useState } from "react";

import {
  addDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { query, collection, where } from "firebase/firestore";
import { HabitData } from "@/types/habit";

const useHabits = (userId: string) => {
  const [habits, setHabits] = useState<HabitData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getYearMonthAndDate = (date = new Date()) => ({
    date_of_month: date.getDate(),
    year_month: date.toISOString().slice(0, 7),
  });
  const updateHabitProgress = async (id: string, newProgress: number) => {
    const habitRef = doc(db, "habits", id);
    //check logs if today already streak
    const { date_of_month, year_month } = getYearMonthAndDate();
    const streakRef = collection(db, "streaks");
    const q = query(
      streakRef,
      where("type", "==", "habit"),
      where("habit_id", "==", id),
      where("year_month", "==", year_month),
      where("date", "==", date_of_month)
    );
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      return;
    } else {
      await updateDoc(habitRef, {
        streak_count: newProgress,
      });
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.habit_id === id
            ? { ...habit, streak_count: newProgress }
            : habit
        )
      );
        const streakRef = collection(db, "streaks");
        await addDoc(streakRef, {
          type: "habit",
          habit_id: id,
          year_month: year_month,
          date: date_of_month,
          streak: "streak",
        });
    }
  };

  // Fetch habits in real-time using onSnapshot
  useEffect(() => {
    if (!userId) return;

    const activityRef = collection(db, "habits");
    const q = query(
      activityRef,
      where("owner_id", "==", userId),
      where("status", "==", "active")
    );

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habits_ = snapshot.docs.map((doc) => ({
        habit_id: doc.id,
        ...doc.data(),
      })) as HabitData[];

      setHabits(habits_);
      setLoading(false);
    });

    // Cleanup listener when unmounting
    return () => unsubscribe();
  }, [userId]);

  return { habits, loading, updateHabitProgress };
};

export default useHabits;
