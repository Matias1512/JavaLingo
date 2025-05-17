import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameProvider } from "./context/GameContext";
import LevelMapScreen from "./screens/LevelMapScreen";
import ExerciseScreen from "./screens/ExerciseScreen";
import GameOverScreen from "./screens/GameOverScreen";
import LivesDisplay from "./components/LivesDisplay";
import LoginButton from "./components/LoginButton";
import LoginScreen from "./screens/LoginScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoadingScreen from "./screens/LoadingScreen";
import LogoutButton from "./components/LogoutButton";
import AppContent from "./components/AppContent";
import { ExerciseProvider } from "./context/ExerciseContext";
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "./config/firebaseConfig";
import fallbackExercises from "./data/fallbackExercises";
import { OfflineProvider } from "./context/OfflineContext";

const Stack = createNativeStackNavigator();


export const seedGlobalExercises = async () => {
  try {
    const exercisesRef = collection(db, 'exercises');
    for (const exercise of fallbackExercises) {
      await setDoc(doc(exercisesRef, String(exercise.id)), exercise);
    }
    console.log('✅ Base globale restaurée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la restauration de la base :', error);
  }
};

function AppNavigation() {
  const { user, loading } = useAuth();

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


export default function App() {
  seedGlobalExercises();
  return (
    <OfflineProvider>
      <AuthProvider>
        <ExerciseProvider>
          <GameProvider>
            <AppContent />
          </GameProvider>
        </ExerciseProvider>   
      </AuthProvider>
    </OfflineProvider>
  );
}