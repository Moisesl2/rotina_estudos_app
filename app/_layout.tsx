import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="telas/login">
        <Stack.Screen
          name="telas/login"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="telas/cadastro"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="telas/homescreen"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="telas/turmas"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
