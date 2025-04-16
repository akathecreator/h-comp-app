import { Tabs } from "expo-router";
import {
  Image,
  ImageSourcePropType,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useRouter } from "expo-router";
import NutritionDialog from "@/components/food/NutritionDialog";
import { useGlobalContext } from "@/lib/global-provider";
import { useRequirePro } from "@/lib/useRequirePro";

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
      tintColor={focused ? "#f9eacc" : "#f9eacc"}
      resizeMode="contain"
      className="size-6"
    />
    <Text
      className={`${
        focused ? "text-white san-medium" : "text-gray-400 san"
      } text-xs w-full text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  const router = useRouter();
  const { dialogVisible, setDialogVisible } = useGlobalContext();
  useRequirePro();
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#594715", // Black theme
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
              <></>
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
          borderColor: "#f9eacc",
          backgroundColor: "#f9ddad",
        }}
      >
        <Image
          source={images.chat2}
          style={{
            width: 60,
            height: 65,
            borderRadius: 50,
            // Remove tintColor to show original image colors
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Nutrition Summary Popup */}
      {dialogVisible && (
        <NutritionDialog
          visible={dialogVisible}
          onClose={() => setDialogVisible(false)}
          meal_id=""
        />
      )}
    </>
  );
};

export default TabsLayout;
