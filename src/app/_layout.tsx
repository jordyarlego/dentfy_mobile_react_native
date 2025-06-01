import "../theme/global.css";
import { Stack } from 'expo-router';
import { ToastProvider } from '../contexts/ToastContext';
import { useCustomFonts } from '../assets/fonts';
import { View } from 'react-native';

export default function Layout() {
    const fontsLoaded = useCustomFonts();

    if (!fontsLoaded) {
        return <View />;
    }

    return (
        <ToastProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </ToastProvider>
    )
}