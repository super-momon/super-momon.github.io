import type { Metadata } from 'next';
import QuizPage from './QuizGameClient';

export const metadata: Metadata = {
  title: 'AI & Web Dev Quiz',
  description: 'Test your knowledge on Artificial Intelligence and Web Development in this interactive, fast-paced quiz game!',
};

export default function GamePage() {
  return <QuizPage />;
}