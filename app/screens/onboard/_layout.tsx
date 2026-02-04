import { Stack } from 'expo-router';

export default function OnboardLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen
                name="first-onboarding"
                options={{ headerShown: false, }}
            />
            <Stack.Screen
                name="second-onboarding"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="third-onboarding"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}