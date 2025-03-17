import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, FieldValue } from "@/lib/firebase";
import { useGlobalContext } from "@/lib/global-provider";

type Quest = {
  id: string;
  title: string;
  progress: number;
  target: number;
  owner: string;
  status: string;
  type: string;
  completed_at: Date;
};

const tasks = {
  food_log: 10,
  activity_log: 10,
  weight_log: 10,
  sleep_log: 10,
  health_goal: 10,
  daily_quest_complete: 30,
  weekly_quest_complete: 50,
  manual_log: 50,
};

const useGoals = () => {
  const { user } = useGlobalContext();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedQuests = async () => {
      if (!user) return;
      try {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        today.setHours(0, 0, 0, 0);

        const q = query(
          collection(db, "goals"),
          where("owner_id", "==", user.uid),
          // where("goal_type", "==", type),
          where("status", "==", "completed")
        );

        const querySnapshot = await getDocs(q);
        const dailyGoals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().goal_name,
          progress: doc.data().goal_current_progress || 0,
          target: doc.data().goal_max_progress || 1,
          owner: doc.data().owner_id,
          status: doc.data().status,
          type: doc.data().goal_type,
          completed_at: doc.data().completed_at || new Date(),
        }));
        setQuests(dailyGoals);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedQuests();
  }, [db, user?.uid]); // Dependencies include db and user.uid

  return { quests, loading };
};

export default useGoals;
