import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { StyleSheet, useColorScheme } from 'react-native';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 84,
                    backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
                },
                tabBarBackground: () => (
                    <BlurView intensity={80} style={StyleSheet.absoluteFill} tint={colorScheme === 'dark' ? 'dark' : 'light'} />
                ),
                tabBarShowLabel: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="bible"
                options={{
                    title: 'Bible',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'book' : 'book-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: 'Community',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
