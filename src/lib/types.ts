export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type QuizData = {
  questions: QuizQuestion[];
};

export type ChatMessage = {
  role: 'user' | 'ai';
  content: string;
};
