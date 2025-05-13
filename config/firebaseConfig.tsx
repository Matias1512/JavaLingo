// firebaseConfig.tsx
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Ton objet de configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCpkxvOrUvBsfHhhun1JZqd8f2dRtCXNPY",
  authDomain: "javalinguo.firebaseapp.com",
  projectId: "javalinguo",
  storageBucket: "javalinguo.appspot.com",
  messagingSenderId: "203087424359",
  appId: "1:203087424359:web:a8ecf1ea2171ee36381dc2",
  measurementId: "G-7SGHFZQ881"
};

// On initialise Firebase
const app = initializeApp(firebaseConfig);

// ✅ On exporte auth et db pour utilisation
export const auth = getAuth(app);
export const db = getFirestore(app);
