import type { QuizQuestion, ThemeSessionKey } from '../../../shared/types/domain';
import { QUIZ_QUESTIONS_PART_1 } from '../data/questionsBankPart1';
import { QUIZ_QUESTIONS_PART_2 } from '../data/questionsBankPart2';

export const FULL_QUESTION_BANK: QuizQuestion[] = [
  ...QUIZ_QUESTIONS_PART_1,
  ...QUIZ_QUESTIONS_PART_2,
];

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function drawFiveQuestions(theme: ThemeSessionKey): QuizQuestion[] {
  const sameTheme = shuffleArray(FULL_QUESTION_BANK.filter((q) => q.theme === theme));
  const others = shuffleArray(FULL_QUESTION_BANK.filter((q) => q.theme !== theme));
  // 3 perguntas do tema escolhido + 2 curiosidades transversais = 5 perguntas do banco de 100
  return [...sameTheme.slice(0, 3), ...others.slice(0, 2)];
}

