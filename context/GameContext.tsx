import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import { useExercises } from "./ExerciseContext";
import { useAuth } from "./AuthContext";
import { db } from "../config/firebaseConfig";
import { doc, getDoc, setDoc, writeBatch, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GameContextType {
  lives: number;
  completedLevels: number[];
  decreaseLives: () => void;
  completeLevel: (levelId: number) => void;
  resetGame: () => void;
  isLevelUnlocked: (levelId: number) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { exercises, setExercises } = useExercises();
  const { user } = useAuth();
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [lives, setLives] = useState(5);

  // Mise à jour des niveaux complétés
  useEffect(() => {
    const synced = exercises.filter(ex => ex.completed).map(ex => ex.id);
    setCompletedLevels(synced);
  }, [exercises]);

  // Chargement des vies au démarrage
  useEffect(() => {
    const loadLives = async () => {
      const isOffline = await AsyncStorage.getItem("isOfflineMode");

      if (!user || isOffline === "true") {
        // Mode invité ou hors-ligne
        const localLives = await AsyncStorage.getItem("lives");
        if (localLives !== null) {
          const parsed = parseInt(localLives);
          setLives(isNaN(parsed) ? 5 : parsed);
        } else {
          setLives(5);
        }
        return;
      }

      // Utilisateur connecté → Firestore
      try {
        const docRef = doc(db, `users/${user.uid}`);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (typeof data.lives === "number") {
            setLives(data.lives);
          }
        }
      } catch (e) {
        console.error("❌ Erreur chargement vies Firestore :", e);
      }
    };

    loadLives();
  }, [user]);

  const decreaseLives = async () => {
    const updated = Math.max(0, lives - 1);
    setLives(updated);

    const isOffline = await AsyncStorage.getItem("isOfflineMode");

    if (!user || isOffline === "true") {
      // En mode hors-ligne ou invité
      await AsyncStorage.setItem("lives", updated.toString());
    } else {
      // En ligne avec compte → Firestore
      try {
        await setDoc(doc(db, `users/${user.uid}`), { lives: updated }, { merge: true });
      } catch (err) {
        console.error("❌ Erreur mise à jour des vies :", err);
      }
    }
  };

  const resetGame = async () => {
    setLives(5);
    setCompletedLevels([]);

    const isOffline = await AsyncStorage.getItem("isOfflineMode");

    if (!user || isOffline === "true") {
      await AsyncStorage.setItem("lives", "5");
      await AsyncStorage.setItem("completedLevels", JSON.stringify([]));
      return;
    }

    try {
      // Mise à jour des vies en base
      await setDoc(doc(db, `users/${user.uid}`), { lives: 5 }, { merge: true });

      // Reset des exercices en Firestore
      const batch = writeBatch(db);
      const exercisesRef = collection(db, `users/${user.uid}/exercises`);

      exercises.forEach(ex => {
        const exerciseDoc = doc(exercisesRef, String(ex.id));
        const updated = { ...ex, completed: false };
        batch.set(exerciseDoc, updated);
      });

      await batch.commit();

      setExercises(exercises.map(ex => ({ ...ex, completed: false })));
    } catch (error) {
      console.error("❌ Erreur reset Firestore :", error);
    }
  };

  const completeLevel = (levelId: number) => {
    if (!completedLevels.includes(levelId)) {
      const updatedLevels = [...completedLevels, levelId];
      setCompletedLevels(updatedLevels);

      AsyncStorage.getItem("isOfflineMode").then((offline) => {
        if (offline === "true" && !user) {
          AsyncStorage.setItem("completedLevels", JSON.stringify(updatedLevels));
        }
      });
    }
  };

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return completedLevels.includes(levelId - 1);
  };

  return (
    <GameContext.Provider
      value={{
        lives,
        completedLevels,
        decreaseLives,
        completeLevel,
        resetGame,
        isLevelUnlocked,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
