import { Tabs } from "expo-router";
import {
  Image,
  ImageSourcePropType,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import icons from "@/constants/icons";
import { useRouter } from "expo-router";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => (
  <View className="flex-1 mt-3 flex flex-col items-center">
    <Image
      source={icon}
      tintColor={focused ? "white" : "#666876"}
      resizeMode="contain"
      className="size-6"
    />
    <Text
      className={`${
        focused ? "text-white font-rubik-medium" : "text-gray-400 font-rubik"
      } text-xs w-full text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  const router = useRouter();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#000", // Black theme
            position: "relative",
            borderTopColor: "#333", // Subtle grey border
            borderTopWidth: 1,
            minHeight: 70,
            paddingHorizontal: 10, // Extra padding for spacing
            paddingVertical: 10,
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
          },
          headerTitleAlign: "center",
        }}
      >
        {/* Home Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            href: "/",
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.home} title="Home" />
            ),
          }}
        />
        {/* Daily Tab */}
        <Tabs.Screen
          name="daily"
          options={{
            title: "Daily",
            headerShown: false,
            href: "/daily",
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.cutlery} title="Daily" />
            ),
          }}
        />
        <Tabs.Screen
          name="empty"
          options={{
            title: "Dashboard",
            headerShown: false,
            href: "/empty",
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.cutlery} title="Daily" />
            ),
          }}
        />

        {/* Weekly Tab */}
        <Tabs.Screen
          name="weekly"
          options={{
            title: "Weekly",
            headerShown: false,
            href: "/weekly",
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.calendar} title="Weekly" />
            ),
          }}
        />

        {/* Settings Tab */}
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: false,
            href: "/settings",
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.person} title="Settings" />
            ),
          }}
        />
      </Tabs>

      {/* Floating Middle Button (Logging/Chat) */}
      <TouchableOpacity
        onPress={() => router.push("/chat")}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-lg"
        style={{
          width: 70,
          height: 70,
          justifyContent: "center",
          alignItems: "center",
          elevation: 10, // Android shadow
          shadowColor: "#fff", // iOS shadow
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          borderRadius: 100,
          borderWidth: 1,
          borderColor: "black",
        }}
      >
        <Image
          source={icons.chat}
          style={{ width: 40, height: 40, tintColor: "black" }} // White button, black icon
        />
      </TouchableOpacity>
    </>
  );
};

export default TabsLayout;
