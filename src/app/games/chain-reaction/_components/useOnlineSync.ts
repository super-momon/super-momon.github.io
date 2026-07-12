import { useRef, useEffect, MutableRefObject, Dispatch, SetStateAction } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Cell } from './gameUtils';
import { Player, ChatMessage } from './GameBoard';
import { Ability } from './GameBoardControls';

export interface PendingSyncState {
  board: Cell[][];
  players: Player[];
  currentPlayerIndex: number;
  isTimeout?: boolean;
}

interface UseOnlineSyncOptions {
  isOnline: boolean;
  roomCode: string;
  myClientId: string;
  isHost: boolean;
  resumed: boolean;
  // Shared state refs — kept current by GameBoard via a useEffect
  boardRef: MutableRefObject<Cell[][]>;
  playersRef: MutableRefObject<Player[]>;
  currentPlayerIndexRef: MutableRefObject<number>;
  isAnimatingRef: MutableRefObject<boolean>;
  isChatOpenRef: MutableRefObject<boolean>;
  // Forward-refs for GameBoard functions that are defined after the hook is called.
  // The hook always reads .current so it uses the latest version of each function.
  onExecuteMoveRef: MutableRefObject<(r: number, c: number, playerIdx: number, ability?: Ability | null) => void>;
  onInitializeGameRef: MutableRefObject<() => void>;
  onTriggerAlertRef: MutableRefObject<(message: ChatMessage) => void>;
  // State setters
  setBoard: Dispatch<SetStateAction<Cell[][]>>;
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  setCurrentPlayerIndex: Dispatch<SetStateAction<number>>;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  setUnreadCount: Dispatch<SetStateAction<number>>;
  setToast: (toast: { message: string; type: 'success' | 'error' | 'info' } | null) => void;
  onGoToLobby?: () => void;
  onQuit: () => void;
}

interface UseOnlineSyncReturn {
  channelRef: MutableRefObject<RealtimeChannel | null>;
  pendingSyncStateRef: MutableRefObject<PendingSyncState | null>;
  disconnectTimersRef: MutableRefObject<Record<string, ReturnType<typeof setTimeout>>>;
}

/**
 * Manages the Supabase Realtime channel for an online Chain Reaction game session.
 *
 * Handles:
 * - Move and state-sync broadcasts
 * - Presence join / leave with a configurable grace period before marking a
 *   player as disconnected
 * - Sync-request retry logic for reconnecting clients
 * - Periodic presence re-track to survive Supabase internal reconnects
 *
 * Returns `channelRef` so callers can send broadcasts, `pendingSyncStateRef`
 * so the animation loop can apply deferred state updates, and
 * `disconnectTimersRef` so the caller can check for pending grace periods.
 */
export function useOnlineSync({
  isOnline,
  roomCode,
  myClientId,
  isHost,
  resumed,
  boardRef,
  playersRef,
  currentPlayerIndexRef,
  isAnimatingRef,
  isChatOpenRef,
  onExecuteMoveRef,
  onInitializeGameRef,
  onTriggerAlertRef,
  setBoard,
  setPlayers,
  setCurrentPlayerIndex,
  setMessages,
  setUnreadCount,
  setToast,
  onGoToLobby,
  onQuit,
}: UseOnlineSyncOptions): UseOnlineSyncReturn {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const pendingSyncStateRef = useRef<PendingSyncState | null>(null);

  // Internal channel management refs
  const hasSubscribedRef = useRef<boolean>(false);
  const resumedRef = useRef<boolean>(resumed);
  // Grace period timers: when a player's presence fires 'leave', we delay
  // marking them disconnected by DISCONNECT_GRACE_MS. If a 'join' for the
  // same clientId arrives before the timer fires, we cancel it — it was just
  // a Supabase websocket reconnect, not a real disconnect.
  const disconnectTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // Ref for the periodic presence re-track interval on the game channel
  const presenceRetrackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Refs for request-sync retry timer
  const syncRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncRetryCountRef = useRef<number>(0);

  const DISCONNECT_GRACE_MS = 5000;
  const MAX_SYNC_RETRIES = 2;

  useEffect(() => {
    resumedRef.current = resumed;
  }, [resumed]);

  useEffect(() => {
    if (!isOnline || !roomCode) return;

    const channelName = `chain-reaction-game:${roomCode.toUpperCase()}`;
    const gameChannel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
        presence: { key: myClientId },
      },
    });

    channelRef.current = gameChannel;

    const handleMoveBroadcast = (payload: any) => {
      const { r, c, playerIdx, ability } = payload.payload;
      if (playerIdx !== currentPlayerIndexRef.current) {
        console.warn(
          `Desync detected: received move for player ${playerIdx} but local currentPlayerIndex is ${currentPlayerIndexRef.current}. Aligning.`
        );
        setCurrentPlayerIndex(playerIdx);
      }
      onExecuteMoveRef.current(r, c, playerIdx, ability);
    };

    const handleSyncStateBroadcast = (payload: any) => {
      const {
        board: syncedBoard,
        players: syncedPlayers,
        currentPlayerIndex: syncedCurrentPlayerIndex,
        isTimeout,
      } = payload.payload;

      if (isTimeout) {
        const prevActivePlayer = playersRef.current[currentPlayerIndexRef.current];
        if (prevActivePlayer) {
          setToast({ message: `${prevActivePlayer.name}'s turn timed out!`, type: 'info' });
          setTimeout(() => setToast(null), 3000);
        }
      }

      if (isAnimatingRef.current) {
        pendingSyncStateRef.current = {
          board: syncedBoard,
          players: syncedPlayers,
          currentPlayerIndex: syncedCurrentPlayerIndex,
          isTimeout,
        };
      } else {
        setBoard(syncedBoard);
        setPlayers(syncedPlayers);
        setCurrentPlayerIndex(syncedCurrentPlayerIndex);
      }
    };

    const handleResetGameBroadcast = (payload: any) => {
      onInitializeGameRef.current();
      if (payload?.payload?.board) {
        setBoard(payload.payload.board);
      }
    };

    const handleChatBroadcast = (payload: any) => {
      const { message } = payload.payload;
      setMessages((prev) => [...prev, message]);
      // Use ref to read fresh state without re-running subscription useEffect
      if (!isChatOpenRef.current) {
        setUnreadCount((c) => c + 1);
      }
      if (message.isAlert) {
        onTriggerAlertRef.current(message);
      }
    };

    const handleGoToLobbyBroadcast = () => {
      if (onGoToLobby) onGoToLobby();
    };

    const handleQuitGameBroadcast = () => {
      onQuit();
    };

    // A reconnecting client asks its peers for the current game state. To
    // avoid a flood of conflicting replies, exactly one peer answers: the
    // connected player with the lowest id (a deterministic choice all clients
    // agree on). This also covers the host reconnecting, since another
    // connected player will respond in its place.
    const handleRequestSyncBroadcast = (payload: { payload?: { clientId?: string } }) => {
      const requesterId = payload?.payload?.clientId;
      if (!requesterId || requesterId === myClientId) return;
      if (isAnimatingRef.current) return;

      const responder = playersRef.current
        .filter((p) => p.connected && p.clientId && p.clientId !== requesterId)
        .sort((a, b) => a.id - b.id)[0];
      if (!responder || responder.clientId !== myClientId) return;

      channelRef.current?.send({
        type: 'broadcast',
        event: 'sync-state',
        payload: {
          board: boardRef.current,
          players: playersRef.current,
          currentPlayerIndex: currentPlayerIndexRef.current,
        },
      });
    };

    const clearSyncRetry = () => {
      if (syncRetryTimerRef.current) {
        clearTimeout(syncRetryTimerRef.current);
        syncRetryTimerRef.current = null;
      }
      syncRetryCountRef.current = 0;
    };

    // Wrap sync-state handler so receiving a sync also cancels any pending retries
    const wrappedSyncState = (payload: any) => {
      clearSyncRetry();
      handleSyncStateBroadcast(payload);
    };

    gameChannel
      .on('broadcast', { event: 'move' }, handleMoveBroadcast)
      .on('broadcast', { event: 'sync-state' }, wrappedSyncState)
      .on('broadcast', { event: 'reset-game' }, handleResetGameBroadcast)
      .on('broadcast', { event: 'chat' }, handleChatBroadcast)
      .on('broadcast', { event: 'go-to-lobby' }, handleGoToLobbyBroadcast)
      .on('broadcast', { event: 'quit-game' }, handleQuitGameBroadcast)
      .on('broadcast', { event: 'request-sync' }, handleRequestSyncBroadcast)
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        const joinedClientIds = newPresences.map((p) => (p as { clientId?: string }).clientId);

        // Cancel any pending disconnect grace timers for reconnecting clients
        joinedClientIds.forEach((cid) => {
          if (cid && disconnectTimersRef.current[cid]) {
            clearTimeout(disconnectTimersRef.current[cid]);
            delete disconnectTimersRef.current[cid];
          }
        });

        setPlayers((prevPlayers) =>
          prevPlayers.map((p) => {
            // Flip a previously-dropped player back to connected so their
            // turns are no longer skipped and they can keep playing.
            if (p.clientId && joinedClientIds.includes(p.clientId) && !p.connected) {
              setToast({ message: `${p.name} reconnected!`, type: 'success' });
              setTimeout(() => setToast(null), 3000);
              return { ...p, connected: true };
            }
            return p;
          })
        );
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const leftClientIds = leftPresences
          .map((p: any) => p.clientId)
          .filter(Boolean) as string[];

        leftClientIds.forEach((cid) => {
          // Don't start a timer if one is already pending
          if (disconnectTimersRef.current[cid]) return;

          disconnectTimersRef.current[cid] = setTimeout(() => {
            delete disconnectTimersRef.current[cid];
            setPlayers((prevPlayers) =>
              prevPlayers.map((p) => {
                if (p.clientId === cid && p.connected) {
                  setToast({
                    message: `${p.name} disconnected. Waiting for them to reconnect…`,
                    type: 'error',
                  });
                  setTimeout(() => setToast(null), 4000);
                  return { ...p, connected: false };
                }
                return p;
              })
            );
          }, DISCONNECT_GRACE_MS);
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const me = playersRef.current.find((p) => p.clientId === myClientId);
          if (me) {
            await gameChannel.track({
              clientId: myClientId,
              name: me.name,
              color: me.color,
              isHost,
            });
          }

          // Guests must always sync the authoritative board state from the host on first load.
          // Hosts only request sync if recovering state after a reconnect/reload.
          const shouldRequestSync = !isHost || hasSubscribedRef.current || resumedRef.current;

          if (shouldRequestSync) {
            // Either Supabase auto-reconnect fired SUBSCRIBED again, or this
            // board was restored after a reload: pull the latest authoritative
            // state so we resume exactly where play stands.
            syncRetryCountRef.current = 0;
            const sendSyncRequest = () => {
              gameChannel.send({
                type: 'broadcast',
                event: 'request-sync',
                payload: { clientId: myClientId },
              });
            };
            sendSyncRequest();

            // Retry up to MAX_SYNC_RETRIES times if no sync-state arrives
            if (syncRetryTimerRef.current) clearTimeout(syncRetryTimerRef.current);
            const scheduleRetry = () => {
              syncRetryTimerRef.current = setTimeout(() => {
                syncRetryCountRef.current += 1;
                if (syncRetryCountRef.current <= MAX_SYNC_RETRIES) {
                  sendSyncRequest();
                  scheduleRetry();
                }
                syncRetryTimerRef.current = null;
              }, 3000);
            };
            scheduleRetry();
          }
          hasSubscribedRef.current = true;

          // Start periodic presence re-track (every 30 s) to keep presence
          // fresh even after Supabase internal reconnects.
          if (presenceRetrackIntervalRef.current) clearInterval(presenceRetrackIntervalRef.current);
          presenceRetrackIntervalRef.current = setInterval(() => {
            const currentMe = playersRef.current.find((p) => p.clientId === myClientId);
            if (currentMe && channelRef.current) {
              channelRef.current.track({
                clientId: myClientId,
                name: currentMe.name,
                color: currentMe.color,
                isHost,
              });
            }
          }, 30000);
        }
      });

    return () => {
      // Clean up disconnect grace timers
      Object.values(disconnectTimersRef.current).forEach(clearTimeout);
      disconnectTimersRef.current = {};
      // Clean up periodic re-track interval
      if (presenceRetrackIntervalRef.current) {
        clearInterval(presenceRetrackIntervalRef.current);
        presenceRetrackIntervalRef.current = null;
      }
      // Clean up sync retry timer
      if (syncRetryTimerRef.current) {
        clearTimeout(syncRetryTimerRef.current);
        syncRetryTimerRef.current = null;
      }
      gameChannel.unsubscribe();
      supabase.removeChannel(gameChannel);
      channelRef.current = null;
      hasSubscribedRef.current = false;
    };
  }, [isOnline, roomCode, myClientId, isHost]);

  return { channelRef, pendingSyncStateRef, disconnectTimersRef };
}
