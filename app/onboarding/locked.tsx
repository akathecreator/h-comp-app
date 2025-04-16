import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Lock } from "lucide-react-native";
import Purchases from "react-native-purchases";
import { useEffect } from "react";
export default function LockedScreen() {
  const router = useRouter();
  useEffect(() => {
    const getCustomerInfo = async () => {
      const info = await Purchases.getCustomerInfo();
      console.log("🧨 Customer info:", info);
    };
    getCustomerInfo();
  }, []);
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Lock size={64} color="#999" />
      <Text className="text-2xl font-bold mt-6">Access Locked</Text>
      <Text className="text-center text-gray-500 mt-2">
        This feature requires a subscription. Unlock full access to continue
        using Leafi.
      </Text>

      <TouchableOpacity
        onPress={() => router.replace("/onboarding")}
        className="bg-newblue px-6 py-3 rounded-xl mt-6"
      >
        <Text className="text-white font-semibold">Unlock Now</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/")} className="mt-4">
        <Text className="text-gray-400 underline">Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
