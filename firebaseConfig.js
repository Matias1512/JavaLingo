// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpkxvOrUvBsfHhhun1JZqd8f2dRtCXNPY",
  authDomain: "javalinguo.firebaseapp.com",
  projectId: "javalinguo",
  storageBucket: "javalinguo.firebasestorage.app",
  messagingSenderId: "203087424359",
  appId: "1:203087424359:web:a8ecf1ea2171ee36381dc2",
  measurementId: "G-7SGHFZQ881"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);