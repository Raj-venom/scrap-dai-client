import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="personal-info" options={{ headerShown: false }} />
      <Stack.Screen name="my-order" options={{ headerShown: true }} />
    </Stack>

  );
};

export default Layout;