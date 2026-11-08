import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    const { theme } = useTheme();

    return (
        <NavThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
        </NavThemeProvider>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_700Bold,
        PlayfairDisplay_400Regular,
        PlayfairDisplay_700Bold,
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
        <ThemeProvider>
            <RootLayoutNav />
        </ThemeProvider>
    );
}
