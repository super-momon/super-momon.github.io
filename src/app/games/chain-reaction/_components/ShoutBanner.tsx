'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { ChatMessage } from './GameBoard';
import { getThemeColor } from './colors';

interface ShoutBannerProps {
  activeAlert: ChatMessage | null;
  isAlertExiting: boolean;
  isDark: boolean;
  onDismiss: () => void;
}

export function ShoutBanner({
  activeAlert,
  isAlertExiting,
  isDark,
  onDismiss,
}: ShoutBannerProps) {
  if (!activeAlert) return null;

  const senderThemeColor = getThemeColor(activeAlert.senderColor, isDark);

  return (
    <div 
      className={`shout-banner-overlay ${isAlertExiting ? 'opacity-0' : ''}`}
      onClick={onDismiss}
    >
      <div 
        className={`shout-banner ${isAlertExiting ? 'animate-shout-banner-out' : 'animate-shout-banner'}`}
        style={{
          '--shout-color': senderThemeColor,
          '--shout-glow': `${senderThemeColor}40`,
          '--shout-glow-strong': `${senderThemeColor}80`,
          '--shout-bg': isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.92)',
          '--shout-border-color': isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)',
          '--shout-title-bg': `${senderThemeColor}20`,
          '--shout-title-border': `${senderThemeColor}40`,
          '--shout-text-color': isDark ? '#ffffff' : '#0f172a',
        } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shout-header-container">
          <div className="shout-title">
            <FontAwesomeIcon icon={faBullhorn} className="text-[11px] animate-bullhorn" />
            <span>{activeAlert.senderName}</span>
          </div>
          <span className="shout-pill">Shouts</span>
        </div>
        <div className="shout-message">
          {activeAlert.text}
        </div>
        <div className="shout-dismiss-hint">
          Click outside to dismiss
        </div>
      </div>
    </div>
  );
}
