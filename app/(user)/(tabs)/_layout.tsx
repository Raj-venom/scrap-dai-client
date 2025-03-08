import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";



const UserLayout = () => {
    return (
        <Tabs
            initialRouteName="home"
            screenOptions={{
                tabBarActiveTintColor: "gray",
                tabBarInactiveTintColor: "red",
                tabBarStyle: {
                    height: 60,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: '#eee',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                },
            }}

        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="home" size={24} color={`${focused ? "#4CAF50" : "gray"}`} />

                    )
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="document-text-outline" size={24} color={`${focused ? "#4CAF50" : "gray"}`} />
                    )
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="person-outline" size={24} color={`${focused ? "#4CAF50" : "gray"}`} />
                    )
                }}
            />
        </Tabs>
    )
}

export default UserLayout;