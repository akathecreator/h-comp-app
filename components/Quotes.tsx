import React, { useState } from "react";
import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const stoicQuotes = [
  // 🔥 Discipline Over Motivation
  "Motivation gets you started. Discipline keeps you going.",
  "You don’t have to be extreme. Just consistent.",
  "You’re not always going to feel like it. Do it anyway.",
  "It doesn’t get easier. You just get stronger.",
  "Small efforts, every day. That’s the secret.",

  // 🍎 Food Mindset Shifts
  "You are not a dog. Don’t reward yourself with food.",
  "Every bite is a vote for the person you want to become.",
  "If hunger isn’t the problem, food isn’t the answer.",
  "Eat to fuel, not to fill.",
  "Your body deserves better than 5 minutes of dopamine.",

  // 🧠 Mental Health + Self-Compassion
  "Losing weight is hard. Being overweight is hard. Choose your hard.",
  "One bad meal won’t make you fat. One good meal won’t make you fit.",
  "Talk to yourself like someone you care about.",
  "Progress, not perfection.",
  "Be kind to yourself. You’re showing up. That’s enough today.",

  // 🧭 Progress-Oriented Quotes
  "A month from now, you’ll wish you started today.",
  "Weight loss is a marathon, not a sprint.",
  "Slow progress is still progress.",
  "Celebrate non-scale victories too.",
  "The scale can’t measure strength, resilience, or confidence.",

  // 💪 Raw, Honest, and Tough-Love
  "No one is coming to do it for you.",
  "Your body won’t change if your habits don’t.",
  "You can’t out-train a bad diet.",
  "Consistency beats intensity.",
  "Don’t stop when you’re tired. Stop when you’re done.",
  "Cravings are temporary. Regret lasts longer.",
  "Sweat now, shine later.",
  "Excuses burn zero calories.",
  "You didn’t gain it overnight. You won’t lose it overnight.",
  "Comfort is the enemy of change.",
];

const StoicQuotes = ({ date }: { date: Date }) => {
  const [quote, setQuote] = useState(
    stoicQuotes[Math.floor(Math.random() * stoicQuotes.length)]
  );
  useEffect(() => {
    setQuote(stoicQuotes[Math.floor(Math.random() * stoicQuotes.length)]);
  }, [date]);

  return (
    <View className="flex items-center justify-center p-4 bg-earthseaweed">
      <Text className="text-white text-md text-center san-medium">
        "{quote}"
      </Text>
    </View>
  );
};

export default StoicQuotes;
