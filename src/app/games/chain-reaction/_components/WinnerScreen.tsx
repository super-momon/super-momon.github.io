'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faSliders, faArrowLeft, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { getThemeColor, useIsDark } from './colors';

interface WinnerScreenProps {
  winnerName: string;
  winnerColor: string;
  totalOrbs: number;
  onPlayAgain: () => void;
  onBackToSetup: () => void;
  isOnline?: boolean;
  isHost?: boolean;
}

export default function WinnerScreen({
  winnerName,
  winnerColor,
  totalOrbs,
  onPlayAgain,
  onBackToSetup,
  isOnline = false,
  isHost = false,
}: WinnerScreenProps) {
  const isDark = useIsDark();
  const themeWinnerColor = getThemeColor(winnerColor, isDark);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Confetti Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [themeWinnerColor, '#ffffff', '#ffd700', '#ff4b4b', '#00d4ff', '#d946ef'];
    const particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height - 20;
        this.size = Math.random() * 8 + 6;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 5 + 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.y > height) {
          this.y = -20;
          this.x = Math.random() * width;
          this.speedY = Math.random() * 5 + 4;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate((this.rotation * Math.PI) / 180);
        c.fillStyle = this.color;
        
        // Draw standard rectangular confetti shape
        c.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
        c.restore();
      }
    }

    // Populate particles
    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [winnerColor]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4">
      {/* Dynamic Fullscreen Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Radial Gradient Glow Backing */}
      <div
        className="absolute w-[50%] aspect-ratio-1 rounded-full blur-3xl pointer-events-none opacity-20 z-0"
        style={{
          background: `radial-gradient(circle, ${themeWinnerColor} 0%, transparent 70%)`,
        }}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15, duration: 0.6 }}
        className="glass-panel w-full max-w-md rounded-3xl p-8 text-center shadow-2xl relative z-10 border border-[var(--color-border)]/60 bg-[var(--color-surface)]/80 backdrop-blur-xl"
      >
        {/* Trophy Header */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1.1, 1] }}
          transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.8 }}
          className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full shadow-lg"
          style={{
            backgroundColor: `${themeWinnerColor}15`,
            color: themeWinnerColor,
            border: `2px solid ${themeWinnerColor}30`,
            boxShadow: `0 0 25px ${themeWinnerColor}30`,
          }}
        >
          <FontAwesomeIcon icon={faTrophy} className="text-4xl" />
        </motion.div>

        <h1 className="text-xs uppercase tracking-widest font-black text-[var(--color-muted)] mb-2">
          Victory Achieved!
        </h1>
        
        <h2 
          className="text-4xl font-extrabold tracking-tight mb-4 text-neon"
          style={{ 
            color: themeWinnerColor,
            '--neon-glow': `${themeWinnerColor}40`,
          } as React.CSSProperties}
        >
          {winnerName} Wins!
        </h2>

        {/* Stats */}
        <div className="bg-[var(--color-surface)]/50 rounded-2xl p-4 border border-[var(--color-border)]/40 mb-8 max-w-xs mx-auto">
          <span className="text-xs text-[var(--color-muted)] font-medium block mb-1">Remaining Dominating Orbs</span>
          <span className="text-2xl font-black text-[var(--color-foreground)]">
            {totalOrbs} orbs
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {isOnline && !isHost ? (
            <div className="text-center py-3.5 px-6 rounded-xl bg-[var(--color-surface)]/40 border border-[var(--color-border)]/40 text-[var(--color-muted)] text-xs font-bold animate-pulse">
              Waiting for Host to return to lobby...
            </div>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onPlayAgain}
                className="w-full py-3.5 px-6 rounded-xl bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-accent)]/20 transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faRotateRight} />
                {isOnline ? 'Return Lobby (Same Settings)' : 'Play Again (Same Settings)'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBackToSetup}
                className="w-full py-3.5 px-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-surface)]/80 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faSliders} />
                {isOnline ? 'Disconnect & Setup' : 'Change Game Settings'}
              </motion.button>
            </>
          )}

          {isOnline ? (
            <button
              onClick={onBackToSetup}
              className="text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] flex items-center gap-1.5 justify-center mt-3 transition hover:underline"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Leave Online Room
            </button>
          ) : (
            <button
              onClick={() => window.location.href = '/'}
              className="text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] flex items-center gap-1.5 justify-center mt-3 transition hover:underline"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Exit to Homepage
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
