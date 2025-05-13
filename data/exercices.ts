export interface Exercise {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  completed?: boolean;
};

export const EXERCISES_KEY = 'EXERCISES';