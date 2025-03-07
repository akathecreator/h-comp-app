interface Meal {
  id: string; // Document ID
  description: string; // Description of the meal
  image_url: string; // URL of the meal image
  timestamp: Date; // Timestamp of when the meal was logged
  total_calories: number; // Total calories in the meal
  total_protein: number; // Total protein in grams
  total_carbs: number; // Total carbs in grams
  total_fat: number; // Total fat in grams
  user_id: string; // ID of the user who logged the meal
  items?: string[];
  meal_name: string;
  type: string;
}
