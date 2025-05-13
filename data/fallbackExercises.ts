// data/fallbackExercises.ts
import { Exercise } from './exercices';

const fallbackExercises: Exercise[] = [
{
    id: 1,
    question: "Quelle est la syntaxe correcte pour déclarer une variable en JavaScript?",
    options: ["x := 5;", "var x = 5;", "variable x = 5;"],
    correctAnswer: 1,
    explanation: "En JavaScript, on utilise les mots-clés 'var', 'let' ou 'const' pour déclarer des variables.",
    completed: false,
  },
  {
    id: 2,
    question: "Comment créer une fonction en JavaScript?",
    options: ["maFonction = function() {}", "function maFonction() {}", "def maFonction() {}"],
    correctAnswer: 1,
    explanation: "La syntaxe correcte pour déclarer une fonction en JavaScript est 'function nomDeLaFonction() {}'.",
    completed: false,
  },
  {
    id: 3,
    question: "Comment accéder au premier élément d'un tableau en JavaScript?",
    options: ["array(1)", "array[0]", "array.first()"],
    correctAnswer: 1,
    explanation: "En JavaScript, les indices de tableau commencent à 0, donc le premier élément est à l'indice 0.",
    completed: false,
  },
  {
    id: 4,
    question: "Quelle méthode permet d'ajouter un élément à la fin d'un tableau en JavaScript?",
    options: ["push()", "add()", "append()"],
    correctAnswer: 0,
    explanation: "La méthode push() ajoute un ou plusieurs éléments à la fin d'un tableau et retourne la nouvelle longueur du tableau.",
    completed: false,
  },
  {
    id: 5,
    question: "Comment écrire une condition IF en JavaScript?",
    options: ["if x = 5 { }", "if (x === 5) { }", "if x === 5 then { }"],
    correctAnswer: 1,
    explanation: "La syntaxe correcte pour une condition if en JavaScript est 'if (condition) { }'.",
    completed: false,
  },
  {
    id: 6,
    question: "Comment créer une boucle qui s'exécute 5 fois en JavaScript?",
    options: ["for (let i = 0; i < 5; i++) { }", "repeat(5) { }", "loop(5) { }"],
    correctAnswer: 0,
    explanation: "La boucle for est utilisée pour répéter un bloc de code un nombre spécifique de fois.",
    completed: false,
  },
  {
    id: 7,
    question: "Comment déclarer un objet en JavaScript?",
    options: [
      "object obj = new Object(nom: 'John', age: 30);",
      "const obj = { nom: 'John', age: 30 };",
      "const obj = object(nom: 'John', age: 30);",
    ],
    correctAnswer: 1,
    explanation: "En JavaScript, les objets sont créés avec des accolades {} et contiennent des paires clé-valeur.",
    completed: false,
  },
  {
    id: 8,
    question: "Comment accéder à une propriété d'un objet en JavaScript?",
    options: ["obj->propriete", "obj::propriete", "obj.propriete"],
    correctAnswer: 2,
    explanation: "En JavaScript, on accède aux propriétés d'un objet avec la notation point (obj.propriete) ou la notation crochet (obj['propriete']).",
    completed: false,
  },
  {
    id: 9,
    question: "Quelle est la méthode pour convertir une chaîne en nombre en JavaScript?",
    options: ["Les deux réponses sont correctes", "Number('123')", "parseInt('123')"],
    correctAnswer: 0,
    explanation: "Number() et parseInt() peuvent tous deux être utilisés pour convertir une chaîne en nombre, bien qu'ils aient des comportements légèrement différents.",
    completed: false,
  },
  {
    id: 10,
    question: "Comment vérifier si une variable est définie en JavaScript?",
    options: ["typeof variable !== 'undefined'", "variable.isDefined()", "isDefined(variable)"],
    correctAnswer: 0,
    explanation: "L'opérateur typeof retourne une chaîne indiquant le type de la variable, et 'undefined' si la variable n'est pas définie.",
    completed: false,
  },
  {
    id: 11,
    question: "Comment créer une classe en JavaScript moderne?",
    options: ["function MaClasse() { }", "create class MaClasse { }", "class MaClasse { }"],
    correctAnswer: 2,
    explanation: "En JavaScript moderne (ES6+), on utilise le mot-clé 'class' pour définir une classe.",
    completed: false,
  },
  {
    id: 12,
    question: "Comment gérer les erreurs en JavaScript?",
    options: ["try { } catch(error) { }", "catch { } try(error) { }", "try { } except(error) { }"],
    correctAnswer: 0,
    explanation: "Le bloc try...catch permet de tester un bloc de code pour des erreurs et de les gérer.",
    completed: false,
  }
];

export default fallbackExercises;
