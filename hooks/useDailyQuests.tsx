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
import { sendForMoreGoals } from "@/lib/chat";
type Quest = {
  id: string;
  title: string;
  progress: number;
  target: number;
  owner: string;
  status: string;
  type: string;
  completed_at: Date | null;
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

const useGoals = (type: string) => {
  const { user } = useGlobalContext();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const updateQuest = async (goal: Quest) => {
    try {
      //   const goalRef = doc(db, "goals", goal.id);
      //   const goalDoc = await getDoc(goalRef);

      //   if (!goalDoc.exists()) {
      //     console.error("Goal not found.");
      //     return;
      //   }

      //   const { goal_current_progress, goal_max_progress, status } =
      //     goalDoc.data();
      const { progress, target, status, id, owner, type } = goal;

      if (status === "completed") {
        console.log("✅ Goal is already completed. No update needed.");
        return;
      }

      let updatedProgress = progress + 1;
      let updatedStatus = status;

      if (updatedProgress >= target) {
        updatedStatus = "completed";
        console.log(quests);
        // 🔄 Update quests state so UI reflects the change immediately
        setQuests((prevQuests) =>
          prevQuests.map((quest) =>
            quest.id === goal.id
              ? { ...quest, progress: updatedProgress, status: updatedStatus }
              : quest
          )
        );
        const goalRef = doc(db, "goals", id);
        await updateDoc(goalRef, {
          goal_current_progress: increment(1),
          status: "completed",
          completed_at: new Date(),
        });
        console.log("🎉 Goal completed!");
        const the_type = `${type}_quest_complete` as keyof typeof tasks;
        await updateUserLevels(owner, the_type);
      } else {
        // 🔄 Update quests state so UI reflects the change immediately
        console.log(quests);
        setQuests((prevQuests) =>
          prevQuests.map((quest) =>
            quest.id === id
              ? { ...quest, progress: updatedProgress, status: updatedStatus }
              : quest
          )
        );
        const goalRef = doc(db, "goals", id);
        await updateDoc(goalRef, {
          goal_current_progress: increment(1),
        });
        const the_type = `${type}_quest_complete` as keyof typeof tasks;
        await updateUserLevels(owner, the_type);
        console.log("📈 Goal progress updated.");
      }
    } catch (error) {
      console.error("❌ Error updating quest progress:", error);
    }
  };

  useEffect(() => {
    const fetchDailyGoals = async () => {
      if (!user) return;
      try {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        today.setHours(0, 0, 0, 0);

        let q = query(
          collection(db, "goals"),
          where("owner_id", "==", user.uid),
          where("goal_type", "==", type),
          where("start_date", ">=", today),
          where("start_date", "<", tomorrow),
          limit(2)
        );

        let querySnapshot = await getDocs(q);
        // console.log(querySnapshot.docs.length);
        if (querySnapshot.docs.length === 0) {
          await sendForMoreGoals(user.uid, "daily");
          querySnapshot = await getDocs(q);
        }
        const dailyGoals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().goal_name,
          progress: doc.data().goal_current_progress || 0,
          target: doc.data().goal_max_progress || 1,
          owner: doc.data().owner_id,
          status: doc.data().status,
          type: doc.data().goal_type,
          completed_at: doc.data().completed_at || null,
        }));
        setQuests(dailyGoals);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyGoals();
  }, [db, user?.uid]); // Dependencies include db and user.uid

  return { quests, loading, updateQuest };
};
export const updateUserStreak = async (userId: string) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDate = now.getDate();

  try {
    const streakQuery = query(
      collection(db, "streaks"),
      where("user_id", "==", userId),
      where("year", "==", currentYear),
      where("month", "==", currentMonth),
      where("date", "==", currentDate)
    );

    const streakSnapshot = await getDocs(streakQuery);
    if (!streakSnapshot.empty) {
      console.log("✅ Streak already logged for today. No action needed.");
      return;
    }

    await addDoc(collection(db, "streaks"), {
      user_id: userId,
      year: currentYear,
      month: currentMonth,
      date: currentDate,
      timestamp: new Date(),
      type: "usage",
    });

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const { streaks } = userDoc.data() || {};
      const newStreak = (streaks?.on_going || 0) + 1;
      await updateDoc(userRef, {
        "streaks.on_going": newStreak,
      });
      console.log(`🔥 Streak updated! New ongoing streak: ${newStreak}`);
    }
  } catch (error) {
    console.error("❌ Error updating streak:", error);
  }
};

export const updateUserLevels = async (
  userId: string,
  task: keyof typeof tasks
) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) return;
  const { level_meta } = userDoc.data();
  const { experience, next_level, level } = level_meta;
  const newExperience = tasks[task];

  if (experience + newExperience > next_level) {
    await updateDoc(userRef, {
      "level_meta.level": Number(level) + 1,
      "level_meta.experience": experience + newExperience,
      "level_meta.next_level": next_level * 2,
    });
  } else {
    await updateDoc(userRef, {
      "level_meta.experience": experience + newExperience,
    });
  }
  await updateUserStreak(userId);
};

export default useGoals;
