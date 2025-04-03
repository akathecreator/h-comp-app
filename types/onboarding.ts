interface OnboardingForm {
    nickname: string;
    gender: "male" | "female";
    age: string;
    height: string;
    weight: string;   
    targetWeight: string;
    activityLevel: string;
    dietType: string;
    eatingStyle: string[];
    preferredWorkouts: string[];
    tone: "supportive" | "informative" | "funny" | "tough_love";
    country: string;
    mealTimes: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
    primaryGoal: string;
}

export { OnboardingForm };
