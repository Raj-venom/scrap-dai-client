

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";

const TabIcon = ({ name, label, focused }: { name: any; label: string; focused: boolean }) => (
    // <View className="flex-col  items-center justify-center">
    <View className={`flex flex-col justify-center items-center rounded-full mt-[-25px] `}>
        {focused ? (
            <View className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                <Ionicons name={name} size={24} color="white" />
            </View>
        ) : (
            <Ionicons name={name} size={24} color="gray" />
        )}
        <Text className={`${focused ? "text-green-500" : "text-gray-500"} text-sm w-20 ml-10`}>{label}</Text>
    </View>
);

const UserLayout = () => {
    return (
        <Tabs
            initialRouteName="home"
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 70,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",

                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: "#eee",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#fff",
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon name="home" label="Home" focused={focused} />,
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    headerShown: true,
                    headerTitleAlign: "center",
                    headerStyle: {
                        height: 60,
                    },
                    tabBarIcon: ({ focused }) => <TabIcon name="document-text-outline" label="History" focused={focused} />,
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon name="person-outline" label="Profile" focused={focused} />,
                }}
            />
        </Tabs>
    );
};

export default UserLayout;
