import React, { useEffect, useState } from "react";
import { View } from "react-native";
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
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import NetInfo from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function AppContent() {
  const Stack = createNativeStackNavigator();
  const { user, loading } = useAuth();
  const { loadingExercises } = useExercises();
  const { isOfflineMode, setOfflineMode } = useOffline();

  const [isOfflineDetected, setIsOfflineDetected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const disconnected = !state.isConnected;

      if (disconnected && !user) {
        setIsOfflineDetected(true);
      }

      // Si déconnexion en cours de session
      if (disconnected && user) {
        setOfflineMode(true);
        setIsOfflineDetected(true);
      }

      // Reconnexion : si offlineMode actif mais réseau dispo
      if (state.isConnected && isOfflineMode) {
        setIsOfflineDetected(false);
        setOfflineMode(false);
      }
    });

    return () => unsubscribe();
  }, [user, isOfflineMode]);

  if (isOfflineDetected) return <NetworkErrorScreen />;
  if (loading || loadingExercises) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        ) : isOfflineMode ? (
          <Stack.Screen name="OfflineLogin" component={OfflineLoginScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
