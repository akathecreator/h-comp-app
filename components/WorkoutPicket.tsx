import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const WorkoutPicker = ({
  value,
  onChange
}: {
  value: string[];
  onChange: (newVal: string[]) => void;
  options?: string[];
}) => {
  const [customWorkout, setCustomWorkout] = useState("");
  const [options, setOptions] = useState<string[]>(["home gym", "local gym", "running", "walking","yoga"]);
  const toggleOption = (workout: string) => {
    const exists = value.includes(workout);
    const updated = exists
      ? value.filter((w) => w !== workout)
      : [...value, workout];
    onChange(updated);
  };

  const addCustomWorkout = () => {
    const w = customWorkout.trim().toLowerCase();
    if (w && !value.includes(w)) {
      onChange([...value, w]);
      setOptions([...options, w]);
      setCustomWorkout("");
    }
  };

  return (
    <View>
      <Text className="text-lg font-bold text-newblue mt-4 mb-2">
        Preferred Workouts
      </Text>
      {options.map((w) => (
        <TouchableOpacity
          key={w}
          className={`p-3 border rounded-lg mb-2 ${
            value.includes(w)
              ? "border-newblue bg-newblue/10"
              : "border-gray-300"
          }`}
          onPress={() => toggleOption(w)}
        >
          <Text className="capitalize text-gray-700">{w}</Text>
        </TouchableOpacity>
      ))}

      {/* Custom Input */}
      <TextInput
        value={customWorkout}
        onChangeText={setCustomWorkout}
        placeholder="Add custom workout"
        className="bg-gray-100 p-3 rounded-lg mb-2"
      />
      <TouchableOpacity
        onPress={addCustomWorkout}
        className="bg-newblue p-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">+ Add</Text>
      </TouchableOpacity>

      {/* Display all selected (optional) */}
      {value.length > 0 && (
        <Text className="text-gray-600 mt-2 text-sm">
          Selected: {value.join(", ")}
        </Text>
      )}
    </View>
  );
};

export default WorkoutPicker;