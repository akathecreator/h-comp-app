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
      tintColor={focused ? "black" : "#666876"}
      resizeMode="contain"
      className="size-6"
    />
    <Text
      className={`${
        focused
          ? "text-primary-300 font-rubik-medium"
          : "text-black-200 font-rubik"
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
            backgroundColor: "white",
            position: "relative",
            borderTopColor: "#0061FF1A",
            borderTopWidth: 1,
            minHeight: 70,
            padding: 10,
          },
          headerTitle: () => (
            <View className="flex-row items-center">
              {/* Blue Flame Logo */}
              <Image
                source={icons.wifi} // Ensure this points to your flame icon
                style={{ width: 30, height: 30, marginRight: 8 }}
              />
              {/* "SL" Text */}
              <Text className="text-xl font-bold text-black-500">Aki</Text>
            </View>
          ),
          headerTitleAlign: "center", // Center the logo & text
        }}
      >
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
        {/* <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            headerShown: false,
            href: null,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.chat} title="Explore" />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerShown: false,
            href: "/dashboard",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.filter}
                title="Dashboard"
              />
            ),
          }}
        />
      </Tabs>

      {/* Floating Middle Button */}
      <TouchableOpacity
        onPress={() => router.push("/chat")}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black p-4 rounded-full shadow-lg"
        style={{
          width: 70,
          height: 70,
          justifyContent: "center",
          alignItems: "center",
          elevation: 10, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        }}
      >
        <Image
          source={icons.chat}
          style={{ width: 40, height: 40, tintColor: "white" }}
        />
      </TouchableOpacity>
    </>
  );
};

export default TabsLayout;
