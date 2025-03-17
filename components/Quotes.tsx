import React, { useState } from "react";
import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const stoicQuotes = [
  "The happiness of your life depends upon the quality of your thoughts. – Marcus Aurelius",
  "We suffer more often in imagination than in reality. – Seneca",
  "He who fears death will never do anything worthy of a living man. – Seneca",
  "Waste no more time arguing what a good man should be. Be one. – Marcus Aurelius",
  "You have power over your mind – not outside events. Realize this, and you will find strength. – Marcus Aurelius",
  "It is not death that a man should fear, but he should fear never beginning to live. – Marcus Aurelius",
  "The best revenge is not to be like your enemy. – Marcus Aurelius",
  "Difficulties strengthen the mind, as labor does the body. – Seneca",
  "Man conquers the world by conquering himself. – Zeno of Citium",
  "No man is free who is not master of himself. – Epictetus",
];

const StoicQuotes = ({ date }: { date: Date }) => {
  const [quote, setQuote] = useState(
    stoicQuotes[Math.floor(Math.random() * stoicQuotes.length)]
  );
  useEffect(() => {
    setQuote(stoicQuotes[Math.floor(Math.random() * stoicQuotes.length)]);
  }, [date]);

  return (
    <View className="flex items-center justify-center p-4 bg-black">
      <Text className="text-white text-md text-center font-rubik-medium">
        "{quote}"
      </Text>
    </View>
  );
};

export default StoicQuotes;
