import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameProvider } from "./context/GameContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppContent from "./components/AppContent";
import { ExerciseProvider } from "./context/ExerciseContext";
import { OfflineProvider } from "./context/OfflineContext";

const Stack = createNativeStackNavigator();


// export const seedGlobalExercises = async () => {
//   try {
//     const exercisesRef = collection(db, 'exercises');
//     for (const exercise of fallbackExercises) {
//       await setDoc(doc(exercisesRef, String(exercise.id)), exercise);
//     }
//     console.log('✅ Base globale restaurée avec succès !');
//   } catch (error) {
//     console.error('❌ Erreur lors de la restauration de la base :', error);
//   }
// };

export default function App() {
  // seedGlobalExercises();
  return (
      <AuthProvider>
        <OfflineProvider>
          <ExerciseProvider>
            <GameProvider>
              <AppContent />
            </GameProvider>
          </ExerciseProvider>
        </OfflineProvider>
      </AuthProvider>
  );
}