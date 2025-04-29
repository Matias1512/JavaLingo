import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, getDocs, setDoc, doc, writeBatch } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import NetInfo from '@react-native-community/netinfo';

export const fallbackExercises: Exercise[] = [
    {
      id: 1,
      question: "Quelle est la syntaxe correcte pour déclarer une variable en JavaScript?",
      options: ["var x = 5;", "variable x = 5;", "x := 5;"],
      correctAnswer: 0,
      explanation: "En JavaScript, on utilise les mots-clés 'var', 'let' ou 'const' pour déclarer des variables.",
    },
    {
      id: 2,
      question: "Comment créer une fonction en JavaScript?",
      options: ["function maFonction() {}", "def maFonction() {}", "maFonction = function() {}"],
      correctAnswer: 0,
      explanation: "La syntaxe correcte pour déclarer une fonction en JavaScript est 'function nomDeLaFonction() {}'.",
    },
    {
      id: 3,
      question: "Comment accéder au premier élément d'un tableau en JavaScript?",
      options: ["array[0]", "array(1)", "array.first()"],
      correctAnswer: 0,
      explanation: "En JavaScript, les indices de tableau commencent à 0, donc le premier élément est à l'indice 0.",
    },
    {
      id: 4,
      question: "Quelle méthode permet d'ajouter un élément à la fin d'un tableau en JavaScript?",
      options: ["push()", "append()", "add()"],
      correctAnswer: 0,
      explanation:
        "La méthode push() ajoute un ou plusieurs éléments à la fin d'un tableau et retourne la nouvelle longueur du tableau.",
    },
    {
      id: 5,
      question: "Comment écrire une condition IF en JavaScript?",
      options: ["if (x === 5) { }", "if x === 5 then { }", "if x = 5 { }"],
      correctAnswer: 0,
      explanation: "La syntaxe correcte pour une condition if en JavaScript est 'if (condition) { }'.",
    },
    {
      id: 6,
      question: "Comment créer une boucle qui s'exécute 5 fois en JavaScript?",
      options: ["for (let i = 0; i < 5; i++) { }", "loop(5) { }", "repeat(5) { }"],
      correctAnswer: 0,
      explanation: "La boucle for est utilisée pour répéter un bloc de code un nombre spécifique de fois.",
    },
    {
      id: 7,
      question: "Comment déclarer un objet en JavaScript?",
      options: [
        "const obj = { nom: 'John', age: 30 };",
        "object obj = new Object(nom: 'John', age: 30);",
        "const obj = object(nom: 'John', age: 30);",
      ],
      correctAnswer: 0,
      explanation: "En JavaScript, les objets sont créés avec des accolades {} et contiennent des paires clé-valeur.",
    },
    {
      id: 8,
      question: "Comment accéder à une propriété d'un objet en JavaScript?",
      options: ["obj.propriete", "obj->propriete", "obj::propriete"],
      correctAnswer: 0,
      explanation:
        "En JavaScript, on accède aux propriétés d'un objet avec la notation point (obj.propriete) ou la notation crochet (obj['propriete']).",
    },
    {
      id: 9,
      question: "Quelle est la méthode pour convertir une chaîne en nombre en JavaScript?",
      options: ["Number('123')", "parseInt('123')", "Les deux réponses sont correctes"],
      correctAnswer: 2,
      explanation:
        "Number() et parseInt() peuvent tous deux être utilisés pour convertir une chaîne en nombre, bien qu'ils aient des comportements légèrement différents.",
    },
    {
      id: 10,
      question: "Comment vérifier si une variable est définie en JavaScript?",
      options: ["typeof variable !== 'undefined'", "variable.isDefined()", "isDefined(variable)"],
      correctAnswer: 0,
      explanation:
        "L'opérateur typeof retourne une chaîne indiquant le type de la variable, et 'undefined' si la variable n'est pas définie.",
    },
    {
      id: 11,
      question: "Comment créer une classe en JavaScript moderne?",
      options: ["class MaClasse { }", "function MaClasse() { }", "create class MaClasse { }"],
      correctAnswer: 0,
      explanation: "En JavaScript moderne (ES6+), on utilise le mot-clé 'class' pour définir une classe.",
    },
    {
      id: 12,
      question: "Comment gérer les erreurs en JavaScript?",
      options: ["try { } catch(error) { }", "try { } except(error) { }", "catch { } try(error) { }"],
      correctAnswer: 0,
      explanation: "Le bloc try...catch permet de tester un bloc de code pour des erreurs et de les gérer.",
    },
  ]
  

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

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Récupérer Firestore
const db = getFirestore(app);

NetInfo.addEventListener((state) => {
  console.log('Connexion Internet :', state.isConnected);
});

export interface Exercise {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const EXERCISES_KEY = 'exercises';

// Charger les exercices depuis Firestore ou AsyncStorage
const loadExercises = async (): Promise<Exercise[]> => {
  const state = await NetInfo.fetch();
  if (state.isConnected) {
    // En ligne : charger depuis Firestore
    const snapshot = await getDocs(collection(db, 'exercises'));
    const exercises = snapshot.docs.map(doc => doc.data() as Exercise);
    // Enregistrer localement
    await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
    return exercises;
  } else {
    // Hors ligne : charger depuis AsyncStorage
    const localData = await AsyncStorage.getItem(EXERCISES_KEY);
    return localData ? JSON.parse(localData) : [];
  }
};

// Synchroniser les données locales vers Firestore
const syncLocalChanges = async () => {
  const localData = await AsyncStorage.getItem(EXERCISES_KEY);
  if (localData) {
    const exercises: Exercise[] = JSON.parse(localData);
    const batch = writeBatch(db);

    exercises.forEach((exercise) => {
      const docRef = doc(db, 'exercises', exercise.id.toString());
      batch.set(docRef, exercise);
    });

    await batch.commit();
    console.log('Local changes synced to Firebase.');
  }
};

// Upload initial depuis exerciseData vers Firestore
export const uploadExerciseDataToFirebase = async () => {
  try {
    const batch = writeBatch(db);

    exerciseData.forEach((exercise) => {
      const docRef = doc(db, 'exercises', exercise.id.toString());
      batch.set(docRef, exercise);
    });

    await batch.commit();
    console.log('Exercises uploaded to Firebase successfully!');
  } catch (error) {
    console.error('Error uploading exercises:', error);
  }
};

export let exerciseData: Exercise[] = [];

export const initializeExerciseData = async () => {
    const state = await NetInfo.fetch();
    console.log('Connexion Internet :', state.isConnected);
  
    try {
      if (state.isConnected) {
        // Timeout Firestore
        const firestoreTimeout = new Promise<Exercise[]>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout Firestore')), 5000) // ⏳ 5 secondes max
        );
  
        const firestoreRequest = getDocs(collection(db, 'exercises'))
          .then(snapshot => {
            console.log('Snapshot Firestore:', snapshot.size, 'documents');
            if (!snapshot.empty) {
              return snapshot.docs.map(doc => doc.data() as Exercise);
            } else {
              return [];
            }
          });
  
        const exercises = await Promise.race([firestoreRequest, firestoreTimeout]);
  
        if (exercises.length > 0) {
          // Exercices trouvés
          exercises.sort((a, b) => a.id - b.id);
          await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
          exerciseData = exercises;
          console.log('Exercices chargés depuis Firestore.');
          return;
        } else {
          // Firestore vide → uploader fallback
          console.log('Firestore vide, upload fallbackExercises...');
          const batch = writeBatch(db);
          fallbackExercises.forEach((exercise) => {
            const docRef = doc(db, 'exercises', exercise.id.toString());
            batch.set(docRef, exercise);
          });
          await batch.commit();
          console.log('fallbackExercises uploadés dans Firestore.');
          
          const sortedFallback = fallbackExercises.sort((a, b) => a.id - b.id);
          await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(sortedFallback));
          exerciseData = sortedFallback;
          return;
        }
      }
  
      // 🛜 Si hors-ligne directement
      const localData = await AsyncStorage.getItem(EXERCISES_KEY);
      if (localData) {
        const exercises = JSON.parse(localData) as Exercise[];
        exerciseData = exercises.sort((a, b) => a.id - b.id);
        console.log('Exercices chargés depuis AsyncStorage.');
        return;
      }
  
      // Aucun stockage ➔ fallback
      exerciseData = fallbackExercises.sort((a, b) => a.id - b.id);
      await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(exerciseData));
      console.log('Fallback exercises utilisés et sauvegardés.');
    } catch (error) {
      console.error('Erreur lors du chargement des exercices:', error.message);
  
      // En cas d'erreur (timeout ou autre) ➔ fallback local
      const localData = await AsyncStorage.getItem(EXERCISES_KEY);
      if (localData) {
        const exercises = JSON.parse(localData) as Exercise[];
        exerciseData = exercises.sort((a, b) => a.id - b.id);
        console.log('Exercices chargés depuis AsyncStorage après erreur.');
        return;
      }
  
      exerciseData = fallbackExercises.sort((a, b) => a.id - b.id);
      await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(exerciseData));
      console.log('Fallback exercises utilisés après erreur.');
    }
  };
