import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, writeBatch, doc, setDoc } from 'firebase/firestore';
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
};

const ExerciseContext = createContext<ExerciseContextType>({
  exercises: [],
  setExercises: () => {},
  loadingExercises: true,
});

export const updateExerciseInFirestore = async (userId: string, exercise: Exercise) => {
  try {
    await setDoc(doc(db, `users/${userId}/exercises/${exercise.id}`), exercise);
    console.log(`✅ Exercice ${exercise.id} mis à jour en Firestore`);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de Firestore :', error);
  }
};

export const useExercises = () => useContext(ExerciseContext);

export const ExerciseProvider = ({ children }: { children: React.ReactNode }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const { user } = useAuth();

      useEffect(() => {
        const loadExercises = async () => {
        if (!user) {
            console.log('❗ Aucun utilisateur connecté (depuis contexte)');
            setLoadingExercises(false);
            return;
        }
      console.log('Utilisateur connecté !!!');
      const userId = user.uid;
      const net = await NetInfo.fetch();

      try {
        console.log('🔄 Chargement des exercices...');
        console.log(`net.isConnected : ${net.isConnected}`);
        console.log(`net.isInternetReachable : ${net.isInternetReachable}`);

        if (net.isConnected && net.isInternetReachable) {
          const snap = await getDocs(collection(db, `users/${userId}/exercises`));
          console.log(`📥 Firestore : ${snap.size} documents récupérés`);

          if (!snap.empty) {
            const data = snap.docs.map(doc => ({
              id: parseInt(doc.id, 10),
              ...doc.data(),
            })) as Exercise[];

            setExercises(data);
            await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(data));
          } else {
            console.warn('⚠️ Aucun exercice trouvé en base, fallback et initialisation...');

            // Écriture des exercices de fallback dans Firestore pour ce user
            for (const exercise of fallbackExercises) {
              await setDoc(doc(db, `users/${userId}/exercises/${exercise.id}`), exercise);
            }

            setExercises(fallbackExercises);
            await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(fallbackExercises));
          }
        } else {
          const local = await AsyncStorage.getItem(EXERCISES_KEY);
          if (local) {
            const parsed = JSON.parse(local) as Exercise[];
            setExercises(parsed);
          } else {
            setExercises(fallbackExercises);
          }
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

  return (
    <ExerciseContext.Provider value={{ exercises, setExercises, loadingExercises }}>
      {children}
    </ExerciseContext.Provider>
  );
};
