'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaderboard } from './Leaderboard';
import type { GameMode } from '@/types/quiz';

interface Props {
  open: boolean;
  onClose: () => void;
  initialMode?: GameMode;
  highlightId?: string;
}

export function LeaderboardModal({ open, onClose, initialMode = 'survival', highlightId }: Props) {
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="lb-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 80,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />

          {/* Panel wrapper — centers the card */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 81,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              key="lb-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Leaderboard"
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 18 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '100%',
                maxWidth: '520px',
                maxHeight: '85vh',
                overflowY: 'auto',
                pointerEvents: 'auto',
                position: 'relative',
                borderRadius: '1.25rem',
                /* Extra ring so the panel stands out from the blurred bg */
                boxShadow:
                  '0 0 0 1px rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              <Leaderboard initialMode={initialMode} highlightId={highlightId} onClose={onClose} />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
