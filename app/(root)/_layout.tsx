// import { Redirect, Slot, usePathname } from "expo-router";
// import { StyleSheet } from "react-native";
// import { ActivityIndicator } from "react-native-paper";
// import { useGlobalContext } from "@/lib/global-provider";
// import { useEffect, useState } from "react";
// import { useVideoPlayer, VideoView } from "expo-video";

// export default function AppLayout() {
//   const { loading, isLogged, userProfile } = useGlobalContext();
//   const [profileLoading, setProfileLoading] = useState(true);
//   const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
//   const pathname = usePathname();

//   // ✅ Allow public access to legal pages
//   const isPublicRoute =
//     pathname?.startsWith("/legal/privacy") ||
//     pathname?.startsWith("/legal/terms");

//   useEffect(() => {
//     if (!loading && isLogged) {
//       if (userProfile) {
//         setIsOnboarded(userProfile?.isOnboarded === true);
//         setProfileLoading(false);
//       }
//     }

//     if (!loading && !isLogged) {
//       setProfileLoading(false);
//     }
//   }, [loading, isLogged, userProfile]);
//   const player = useVideoPlayer(
//     require("@/assets/videos/signin.mp4"),
//     (player) => {
//       player.loop = true;
//       player.play();
//     }
//   );
//   // ✅ Bypass auth check for public pages
//   if (isPublicRoute) return <Slot />;

//   if (loading || profileLoading || isOnboarded === null) {
//     return (
//       // <View className="flex-1 justify-center items-center">
//       //   <ActivityIndicator color="black" size="large" />
//       // </View>
//       <VideoView
//         player={player}
//         allowsFullscreen={false}
//         allowsPictureInPicture={false}
//         style={StyleSheet.absoluteFill}
//         contentFit="cover"
//       />
//     );
//   }

//   if (!isLogged) return <Redirect href="/sign-in" />;
//   if (!isOnboarded) return <Redirect href="/onboarding" />;

//   return <Slot />;
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     position: "relative",
//     justifyContent: "space-between",
//     paddingTop: 50,
//     paddingBottom: 20,
//   },
// });
import { Redirect, Slot, usePathname } from "expo-router";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useGlobalContext } from "@/lib/global-provider";
import { useEffect, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";

export default function AppLayout() {
  const { loading, isLogged, userProfile, clearAndLogout } = useGlobalContext();
  const [profileChecked, setProfileChecked] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const pathname = usePathname();

  const isPublicRoute =
    pathname?.startsWith("/legal/privacy") ||
    pathname?.startsWith("/legal/terms");

  const player = useVideoPlayer(
    require("@/assets/videos/signin.mp4"),
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  // ✅ Safely handle userProfile delay
  useEffect(() => {
    if (!loading && isLogged) {
      if (userProfile !== undefined) {
        setIsOnboarded(userProfile?.isOnboarded === true);
        setProfileChecked(true);
      } else {
        clearAndLogout();
      }
    }

    if (!loading && !isLogged) {
      setProfileChecked(true); // not logged in, but done checking
      if (!userProfile) {
        setIsOnboarded(false);
        clearAndLogout();
      }
    }
  }, [loading, isLogged, userProfile]);

  // ✅ Allow public access to legal pages
  if (isPublicRoute) return <Slot />;

  // ✅ Wait for full check
  if (!profileChecked || isOnboarded === null) {
    return (
      <VideoView
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
    );
  }

  if (!isLogged) return <Redirect href="/sign-in" />;
  if (!isOnboarded) return <Redirect href="/onboarding" />;

  return <Slot />;
}
