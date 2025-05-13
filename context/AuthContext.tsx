import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import fallbackExercises from '../data/fallbackExercises';

const ensureUserDocumentExists = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    // Nouveau compte, on initialise lives à 5
    await setDoc(userRef, { createdAt: new Date().toISOString(), lives: 5 });
  } else {
    const data = snapshot.data();
    // On ne met les vies que si elles sont absentes
    if (typeof data.lives !== 'number') {
      await setDoc(userRef, { lives: 5 }, { merge: true });
    }
  }
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const migrateExercisesToUser = async (uid: string) => {
  const userExercisesRef = collection(db, 'users', uid, 'exercises');
  const snapshot = await getDocs(userExercisesRef);

  if (snapshot.empty) {
    console.log('📥 Migration des exercices pour:', uid);
    for (const ex of fallbackExercises) {
      await setDoc(doc(userExercisesRef, String(ex.id)), ex);
    }
    console.log('✅ Migration terminée.');
  } else {
    console.log('✔️ Exercices déjà présents.');
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        await ensureUserDocumentExists(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Inscription
export const signup = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await migrateExercisesToUser(userCredential.user.uid);
    console.log('Utilisateur inscrit :', userCredential.user);
    await ensureUserDocumentExists(userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Erreur inscription:', (error as Error).message);
    throw error;
  }
};

// Connexion
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Utilisateur connecté :', userCredential.user);
    await ensureUserDocumentExists(userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Erreur connexion:', (error as Error).message);
    throw error;
  }
};

// Déconnexion
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('Déconnecté');
  } catch (error) {
    console.error('Erreur déconnexion:', (error as Error).message);
    throw error;
  }
};
