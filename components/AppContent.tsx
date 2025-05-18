import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useExercises } from "../context/ExerciseContext";
import { useOffline } from "../context/OfflineContext";
import ExerciseScreen from "../screens/ExerciseScreen";
import GameOverScreen from "../screens/GameOverScreen";
import LevelMapScreen from "../screens/LevelMapScreen";
import LoadingScreen from "../screens/LoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import OfflineLoginScreen from "../screens/OfflineLoginScreen";
import NetworkErrorScreen from "../screens/NetworkErrorScreen";
import LivesDisplay from "./LivesDisplay";
import LogoutButton from "./LogoutButton";
import NetInfo from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function AppContent() {
  const Stack = createNativeStackNavigator();
  const { user, loading } = useAuth();
  const { loadingExercises, exercises } = useExercises();
  const { isOfflineMode, setOfflineMode } = useOffline();

  const [isOfflineDetected, setIsOfflineDetected] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const disconnected = !state.isConnected;
      setIsConnected(!disconnected);

      if (disconnected && !user) {
        setIsOfflineDetected(true);
      }

      if (disconnected && user) {
        setOfflineMode(true);
        setIsOfflineDetected(true);
      }

      if (state.isConnected && isOfflineMode) {
        setIsOfflineDetected(false);
        setOfflineMode(false);
      }
    });

    return () => unsubscribe();
  }, [user, isOfflineMode]);

  if (loading || loadingExercises) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ route }) => ({
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {route.name !== "Login" && route.name !== "OfflineLogin" && <LivesDisplay />}
              {user && <LogoutButton />}
            </View>
          ),
        })}
      >
        {user ? (
          <>
            <Stack.Screen name="LevelMap" component={LevelMapScreen} />
            <Stack.Screen name="Exercise" component={ExerciseScreen} />
            <Stack.Screen name="GameOver" component={GameOverScreen} />
          </>
        ) : !isConnected ? (
          <>
            <Stack.Screen name="OfflineLogin" component={OfflineLoginScreen} />
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
