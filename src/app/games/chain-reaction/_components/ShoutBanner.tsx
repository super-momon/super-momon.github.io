'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ChatMessage } from './GameBoard';
import { getThemeColor } from './colors';
import { motion, AnimatePresence } from 'motion/react';

interface ShoutBannerProps {
  activeAlerts: ChatMessage[];
  isDark: boolean;
  onDismiss: (id: string) => void;
}

export function ShoutBanner({
  activeAlerts,
  isDark,
  onDismiss,
}: ShoutBannerProps) {
  return (
    <div className="shout-banner-overlay">
      <AnimatePresence mode="popLayout">
        {activeAlerts.map((alert) => {
          const senderThemeColor = getThemeColor(alert.senderColor, isDark);
          
          return (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, x: -60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="shout-banner"
              style={{
                '--shout-color': senderThemeColor,
                '--shout-glow': `${senderThemeColor}30`,
                '--shout-glow-strong': `${senderThemeColor}70`,
                '--shout-bg': isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.96)',
                '--shout-border-color': isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
                '--shout-title-bg': `${senderThemeColor}15`,
                '--shout-title-border': `${senderThemeColor}30`,
                '--shout-text-color': isDark ? '#ffffff' : '#0f172a',
              } as React.CSSProperties}
            >
              <div className="shout-header-container">
                <div className="shout-title">
                  <FontAwesomeIcon icon={faBullhorn} className="text-[10px] animate-bullhorn" />
                  <span className="truncate max-w-[140px]" title={alert.senderName}>{alert.senderName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(alert.id);
                    }}
                    className="w-5.5 h-5.5 rounded-full flex items-center justify-center bg-black/10 dark:bg-white/10 text-black/50 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/20 dark:hover:bg-white/20 transition cursor-pointer text-[10px] border-0 flex-shrink-0"
                    aria-label="Dismiss alert"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>
              <div className="shout-message">
                {alert.text}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
