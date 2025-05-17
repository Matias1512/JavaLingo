// firebaseConfig.tsx
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Ton objet de configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCpkxvOrUvBsfHhhun1JZqd8f2dRtCXNPY",
  authDomain: "javalinguo.firebaseapp.com",
  projectId: "javalinguo",
  storageBucket: "javalinguo.firebasestorage.app",
  messagingSenderId: "203087424359",
  appId: "1:203087424359:web:b1991d0ed8f50f1e381dc2",
  measurementId: "G-3BEJEN8MHT"
};

// On initialise Firebase
const app = initializeApp(firebaseConfig);

// ✅ On exporte auth et db pour utilisation
export const auth = getAuth(app);
export const db = getFirestore(app);
