import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useExercises } from "./ExerciseContext"
import { useAuth } from "./AuthContext"
import { db } from "../config/firebaseConfig"
import { doc, getDoc, setDoc, writeBatch, collection } from "firebase/firestore"

interface GameContextType {
  lives: number
  completedLevels: number[]
  decreaseLives: () => void
  completeLevel: (levelId: number) => void
  resetGame: () => void
  isLevelUnlocked: (levelId: number) => boolean
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { exercises, setExercises } = useExercises()
  const { user } = useAuth()
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [lives, setLives] = useState(5)

  // Sync completedLevels from Firestore exercises
  useEffect(() => {
    const synced = exercises.filter(ex => ex.completed).map(ex => ex.id)
    setCompletedLevels(synced)
  }, [exercises])

  // Load lives from Firestore on mount
  useEffect(() => {
    const loadLives = async () => {
      if (!user) return;
      const docRef = doc(db, `users/${user.uid}`);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        if (typeof data.lives === 'number') {
          setLives(data.lives);
        } else {
          console.warn('⚠️ Le champ lives est manquant en base, mais on ne l’écrase pas ici.');
        }
      } else {
        console.warn('❗ Document utilisateur inexistant. Aucune vie chargée.');
      }
    };

    loadLives();
  }, [user])

  const decreaseLives = async () => {
    if (!user) return;

    const updated = Math.max(0, lives - 1);
    setLives(updated);

    try {
      await setDoc(doc(db, `users/${user.uid}`), { lives: updated }, { merge: true });
      console.log(`✅ Vie mise à jour : ${updated}`);
    } catch (err) {
      console.error("❌ Erreur mise à jour des vies :", err);
    }
  }

  const completeLevel = (levelId: number) => {
    if (!completedLevels.includes(levelId)) {
      setCompletedLevels(prev => [...prev, levelId])
    }
  }

  const resetGame = async () => {
    if (!user) return

    // Réinitialiser toutes les vies
    setLives(5)
    await setDoc(doc(db, `users/${user.uid}`), { lives: 5 }, { merge: true })

    // Réinitialiser tous les exercices à completed: false
    try {
      const batch = writeBatch(db);
      const exercisesRef = collection(db, `users/${user.uid}/exercises`);

      exercises.forEach(ex => {
        const exerciseDoc = doc(exercisesRef, String(ex.id));
        const updated = { ...ex, completed: false };
        batch.set(exerciseDoc, updated);
      });

      await batch.commit();
      console.log("✅ Exercices réinitialisés (aucun débloqué)");

      // Met à jour localement aussi
      setExercises(exercises.map(ex => ({ ...ex, completed: false })))
      setCompletedLevels([]);
    } catch (error) {
      console.error("❌ Erreur reset des exercices :", error);
    }
  }

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true
    return completedLevels.includes(levelId - 1)
  }

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
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
