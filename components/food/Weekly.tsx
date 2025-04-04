import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Svg, { Circle } from "react-native-svg";
import dayjs from "dayjs";
import "dayjs/locale/en";
import {
  PanGestureHandler,
  State,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
dayjs.locale("en");
dayjs.extend(weekday);
dayjs.extend(utc);

const WeeklySlider = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: dayjs.Dayjs;
  setSelectedDate: (date: dayjs.Dayjs) => void;
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf("week").add(0, "day")
  ); // Monday start
  const isCurrentWeek = currentWeekStart.isSame(
    dayjs().startOf("week").add(0, "day"),
    "week"
  );
  // Generate a week's data
  const getWeekDays = (startDate: dayjs.Dayjs) => {
    return Array.from({ length: 7 }, (_, i) => {
      // const date = startDate.add(i, "day");
      const date = startDate.clone().add(i, "day");
      return {
        day: date.format("ddd"),
        date: date.format("D"),
        fullDate: date,
      };
    });
  };

  const weekDays = getWeekDays(currentWeekStart);
  // console.log("weekDays", wee    kDays);
  return (
    <View className="bg-transparent rounded-2xl shadow-md w-full items-center py-1">
      <TouchableOpacity
        onPress={() => setCurrentWeekStart((prev) => prev.subtract(7, "day"))}
        className="absolute left-2 top-7"
      >
        <Feather name="chevron-left" size={20} color="grey" />
      </TouchableOpacity>
      <FlatList
        data={weekDays}
        horizontal
        keyExtractor={(item) => item.fullDate.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const isToday = item.fullDate.isSame(dayjs(), "day");
          const isSelected = item.fullDate.isSame(selectedDate, "day");

          return (
            <>
              <TouchableOpacity
                onPress={() => setSelectedDate(item.fullDate)}
                className="my-5 mx-3 items-center"
              >
                {/* Dotted Circle */}
                <View className="relative w-8 h-8 items-center justify-center ">
                  <Svg height="50" width="50" className="absolute">
                    <Circle
                      cx="25"
                      cy="32.5"
                      r="17"
                      stroke={isSelected ? "#c58b49" : isToday ? "#594715" : "#594715"}
                      strokeWidth="2"
                      strokeDasharray={isToday || isSelected ? "#c58b49" : "4 4"}
                      fill={
                        isSelected
                          ? "#c58b49"
                          : isToday
                          ? "#594715"
                          : "transparent"
                      }
                    />
                  </Svg>
                  <View className="absolute inset-0 flex items-center justify-center pb-1">
                    <Text
                      className={`text-lg mb-1 ${
                        (isSelected || isToday) ? "font-bold text-white" : "text-gray-600"
                      }`}
                    >
                      {item.date}
                    </Text>
                  </View>
                  <Text
                    className={`text-sm mt-1 ${
                      isToday ? "font-bold " : "text-gray-600"
                    }`}
                  >
                    {item.day}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          );
        }}
      />
      <TouchableOpacity
        onPress={() => setCurrentWeekStart((prev) => prev.add(7, "day"))}
        className="absolute right-2 top-7"
        disabled={isCurrentWeek}
      >
        <Feather name="chevron-right" size={20} color="grey" />
      </TouchableOpacity>
    </View>
  );
  // </PanGestureHandler>
};

export default WeeklySlider;
