import { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Exercise } from '../data/exercices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import fallbackExercises from '../data/fallbackExercises';
import { useAuth } from './AuthContext';

export const EXERCISES_KEY = 'EXERCISES';

type ExerciseContextType = {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  loadingExercises: boolean;
  updateExercise: (exercise: Exercise) => Promise<void>;
};

const ExerciseContext = createContext<ExerciseContextType>({
  exercises: [],
  setExercises: () => {},
  loadingExercises: true,
  updateExercise: async () => {},
});

export const useExercises = () => useContext(ExerciseContext);

export const ExerciseProvider = ({ children }: { children: React.ReactNode }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const isOffline = await AsyncStorage.getItem('isOfflineMode');
        const net = await NetInfo.fetch();

        const isDisconnected = isOffline === 'true' || !net.isConnected || !net.isInternetReachable;

        if (!user || isDisconnected) {
          // Mode invité / hors-ligne
          const local = await AsyncStorage.getItem(EXERCISES_KEY);
          if (local) {
            setExercises(JSON.parse(local));
            console.log('📴 Exercices chargés depuis AsyncStorage');
          } else {
            setExercises(fallbackExercises);
            await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(fallbackExercises));
            console.log('📴 Exercices de secours initialisés localement');
          }
          return;
        }

        // Mode connecté avec réseau
        const snap = await getDocs(collection(db, `users/${user.uid}/exercises`));
        if (!snap.empty) {
          const data = snap.docs.map(doc => ({
            id: parseInt(doc.id, 10),
            ...doc.data(),
          })) as Exercise[];
          setExercises(data);
        } else {
          // Première connexion : initialisation dans Firestore
          for (const exercise of fallbackExercises) {
            await setDoc(doc(db, `users/${user.uid}/exercises/${exercise.id}`), exercise);
          }
          setExercises(fallbackExercises);
        }
      } catch (error) {
        console.error('❌ Erreur chargement exercices :', error);
        setExercises(fallbackExercises);
      } finally {
        setLoadingExercises(false);
      }
    };

    loadExercises();
  }, [user]);

  const updateExercise = async (exercise: Exercise) => {
    if (user) {
      // ✅ En ligne avec compte
      try {
        await setDoc(doc(db, `users/${user.uid}/exercises/${exercise.id}`), exercise);
        console.log(`✅ Exercice ${exercise.id} mis à jour dans Firestore`);
      } catch (error) {
        console.error('❌ Erreur Firestore :', error);
      }
    } else {
      // ✅ Hors ligne ou invité
      try {
        const stored = await AsyncStorage.getItem(EXERCISES_KEY);
        const localExercises: Exercise[] = stored ? JSON.parse(stored) : fallbackExercises;

        const updated = localExercises.map(ex => ex.id === exercise.id ? exercise : ex);
        await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(updated));
        setExercises(updated);
        console.log(`💾 Exercice ${exercise.id} mis à jour localement`);
      } catch (error) {
        console.error('❌ Erreur sauvegarde locale exercice :', error);
      }
    }
  };

  return (
    <ExerciseContext.Provider value={{ exercises, setExercises, loadingExercises, updateExercise }}>
      {children}
    </ExerciseContext.Provider>
  );
};
