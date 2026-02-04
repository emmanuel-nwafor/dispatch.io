import { Stack } from "expo-router";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "./utils/toastConfig";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShadowVisible: false
          }}
        />
      </Stack>

      {/* Flash message toast */}
      <Toast config={toastConfig} />
    </View>
  );
}