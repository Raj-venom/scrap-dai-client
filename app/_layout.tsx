import { router, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import "../global.css";
import { useEffect } from "react";
import { Provider } from 'react-redux'
import store from '@/contexts/store/store'
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {

  const [loaded] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    Jakarta: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(user)" options={{ headerShown: false }} />
        <Stack.Screen name="(collector)" options={{ headerShown: false }} />
        <Stack.Screen
          name="rate-card"
          options={{
            headerShown: true,
            header: () => (
              <View className="pt-4 pb-3 px-4 flex-row items-center bg-white">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                  <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-lg ml-28 font-semibold">Scrap Rate</Text>
              </View>

            )
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </Provider>
  )
}
