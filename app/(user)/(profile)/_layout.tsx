import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="personal-info" options={{ headerShown: false }} />
    </Stack>

  );
};

export default Layout;