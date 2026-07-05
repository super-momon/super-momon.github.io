import type { Metadata } from 'next';
import ChainReactionPage from './ChainReactionGame';

export const metadata: Metadata = {
  title: 'Chain Reaction Game',
  description: 'Play Chain Reaction online or locally with friends. An exciting strategy game of chain reactions!',
};

export default function GamePage() {
  return <ChainReactionPage />;
}
