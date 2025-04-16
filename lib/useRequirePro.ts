import { useEffect } from "react";
import { useRouter } from "expo-router";
import Purchases from "react-native-purchases";

export const useRequirePro = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      const info = await Purchases.getCustomerInfo();
      const isPro = info.entitlements.active["Pro"];

      if (!isPro) {
        router.replace("/onboarding/locked" as any);
      }
    };

    checkAccess();
  }, []);
};