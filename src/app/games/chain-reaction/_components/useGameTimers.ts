import { useState, useEffect, MutableRefObject } from 'react';
import { Player } from './GameBoard';

interface UseGameTimersOptions {
  isAnimating: boolean;
  currentPlayerIndex: number;
  turnSecondsLimit: number;
  isOnline: boolean;
  isHost: boolean;
  myClientId: string;
  playersRef: MutableRefObject<Player[]>;
  /**
   * Ref to the `skipCurrentPlayerTurn` function. A ref is used instead of a
   * direct callback to avoid a circular dependency: `skipCurrentPlayerTurn`
   * uses `setTurnSecondsLeft` which is returned from this hook, so it can only
   * be defined *after* the hook is called.
   */
  onTurnTimeoutRef: MutableRefObject<() => void>;
}

interface UseGameTimersReturn {
  secondsElapsed: number;
  setSecondsElapsed: React.Dispatch<React.SetStateAction<number>>;
  turnSecondsLeft: number;
  setTurnSecondsLeft: React.Dispatch<React.SetStateAction<number>>;
  formatTime: (totalSeconds: number) => string;
}

/**
 * Manages the match-duration clock and the per-turn countdown timer.
 *
 * Fires `onTurnTimeoutRef.current()` when it is the local player's (or the
 * host's, as a fallback) responsibility to advance the turn after a timeout.
 */
export function useGameTimers({
  isAnimating,
  currentPlayerIndex,
  turnSecondsLimit,
  isOnline,
  isHost,
  myClientId,
  playersRef,
  onTurnTimeoutRef,
}: UseGameTimersOptions): UseGameTimersReturn {
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [turnSecondsLeft, setTurnSecondsLeft] = useState<number>(turnSecondsLimit);

  // Match duration clock — increments once per second for the whole game session
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Reset the turn timer whenever the active player changes or animation ends
  useEffect(() => {
    if (!isAnimating) {
      setTurnSecondsLeft(turnSecondsLimit);
    }
  }, [currentPlayerIndex, isAnimating, turnSecondsLimit]);

  // Per-turn countdown; triggers the timeout callback when time is up
  useEffect(() => {
    if (isAnimating) return;

    const activePlayers = playersRef.current.filter((p) => p.active);
    if (activePlayers.length <= 1) return;

    const interval = setInterval(() => {
      setTurnSecondsLeft((prev) => {
        const activePlayer = playersRef.current[currentPlayerIndex];
        const isMyTurn = isOnline ? activePlayer?.clientId === myClientId : true;

        // The active player's client times out at 0; the host enforces a -3
        // fallback to prevent duplicate skip messages from race conditions.
        const timeoutThreshold = isMyTurn ? 0 : -3;

        if (prev <= timeoutThreshold + 1) {
          clearInterval(interval);
          const shouldAct = isMyTurn || (isHost && !isMyTurn);
          if (shouldAct) {
            setTimeout(() => onTurnTimeoutRef.current(), 0);
          }
          return turnSecondsLimit;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayerIndex, isAnimating, isOnline, isHost, myClientId, turnSecondsLimit]);

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { secondsElapsed, setSecondsElapsed, turnSecondsLeft, setTurnSecondsLeft, formatTime };
}
