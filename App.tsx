import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameProvider } from "./context/GameContext";
import LevelMapScreen from "./screens/LevelMapScreen";
import ExerciseScreen from "./screens/ExerciseScreen";
import GameOverScreen from "./screens/GameOverScreen";
import LivesDisplay from "./components/LivesDisplay";
import { exerciseData, initializeExerciseData } from "./data/exercices";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true); // Ajout d'un état de chargement

  const setup = async () => {
    await initializeExerciseData();
    console.log('Exercise data ready:', exerciseData);
    setIsLoading(false); // Quand c'est fini, on enlève le loading
  };

  useEffect(() => {
    setup();
  }, []);

  if (isLoading) {
    // Pendant le chargement, on affiche un écran spécial
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Chargement des exercices...</Text>
      </View>
    );
  }

  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerRight: () => <LivesDisplay />,
          }}
        >
          <Stack.Screen name="LevelMap" component={LevelMapScreen} options={{ title: "Carte des Niveaux" }} />
          <Stack.Screen name="Exercise" component={ExerciseScreen} options={{ title: "Exercice" }} />
          <Stack.Screen
            name="GameOver"
            component={GameOverScreen}
            options={{
              title: "Game Over",
              headerBackVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
