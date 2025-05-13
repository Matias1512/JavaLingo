import React from "react";
import { View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useExercises } from "../context/ExerciseContext";
import ExerciseScreen from "../screens/ExerciseScreen";
import GameOverScreen from "../screens/GameOverScreen";
import LevelMapScreen from "../screens/LevelMapScreen";
import LoadingScreen from "../screens/LoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import LivesDisplay from "./LivesDisplay";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function AppContent() {
  const Stack = createNativeStackNavigator();
  const { user, loading } = useAuth();
  const { loadingExercises } = useExercises();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {user && <LivesDisplay />}
              {user ? <LogoutButton /> : <LoginButton />}
            </View>
          ),
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="LevelMap" component={LevelMapScreen} />
            <Stack.Screen name="Exercise" component={ExerciseScreen} />
            <Stack.Screen name="GameOver" component={GameOverScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
