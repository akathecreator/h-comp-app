interface HabitData {
  habit_id: string;
  name: string;
  description: string;
  type: "good" | "bad";
  created_at: string; // ISO date string
  goal: string;
  streak_count: number;
  longest_streak: number;
  last_updated: string; // ISO date string
  reminders: string[]; // Array of time strings in "HH:mm" format
  status: "active" | "inactive" | "completed";
  day_till_complete: number; //as habit expert how many days should they maintain streak to complete this habit
  owner_id: string;
}
interface HabitStreak {
  streak_id: string;
  habit_id: string;
  streak_count: number;
  streak_type: "good" | "bad";
  year_month: string;
  logs: {
    date: "success" | "fail" | "skip";
  };
}

export { HabitData, HabitStreak };
