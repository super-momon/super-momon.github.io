'use client';

import { useState } from 'react';
import SetupScreen, { PlayerSetup } from './_components/SetupScreen';
import GameBoard from './_components/GameBoard';
import WinnerScreen from './_components/WinnerScreen';

type GamePhase = 'setup' | 'playing' | 'winner';

export default function ChainReactionPage() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [players, setPlayers] = useState<PlayerSetup[]>([]);
  const [rows, setRows] = useState<number>(15);
  const [cols, setCols] = useState<number>(20);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Winner stats
  const [winnerName, setWinnerName] = useState<string>('');
  const [winnerColor, setWinnerColor] = useState<string>('');
  const [winnerOrbs, setWinnerOrbs] = useState<number>(0);

  const handleStartGame = (
    setupPlayers: PlayerSetup[],
    gridRows: number,
    gridCols: number,
    sound: boolean
  ) => {
    setPlayers(setupPlayers);
    setRows(gridRows);
    setCols(gridCols);
    setSoundEnabled(sound);
    setPhase('playing');
  };

  const handleGameFinished = (name: string, color: string, orbs: number) => {
    setWinnerName(name);
    setWinnerColor(color);
    setWinnerOrbs(orbs);
    setPhase('winner');
  };

  const handlePlayAgain = () => {
    setPhase('playing');
  };

  const handleBackToSetup = () => {
    setPhase('setup');
  };

  return (
    <div className="relative min-h-screen bg-[var(--color-background)]">
      {/* Cohesive Ambient Glow Background */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Top-left accent green orb */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '-10%',
            width: '55%',
            aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(8,202,95,0.08) 0%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Bottom-right indigo/cyan orb */}
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '50%',
            aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Mid magenta accent */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '45%',
            width: '35%',
            aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(217,70,239,0.05) 0%, transparent 65%)',
            filter: 'blur(70px)',
          }}
        />
        {/* Subtle retro dot grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(100,116,139,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 pt-32 pb-12 sm:pt-36">
        {phase === 'setup' && (
          <SetupScreen onStartGame={handleStartGame} />
        )}

        {phase === 'playing' && (
          <GameBoard
            initialPlayers={players}
            rows={rows}
            cols={cols}
            soundEnabled={soundEnabled}
            onQuit={handleBackToSetup}
            onGameFinished={handleGameFinished}
          />
        )}

        {phase === 'winner' && (
          <WinnerScreen
            winnerName={winnerName}
            winnerColor={winnerColor}
            totalOrbs={winnerOrbs}
            onPlayAgain={handlePlayAgain}
            onBackToSetup={handleBackToSetup}
          />
        )}
      </div>
    </div>
  );
}
