'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments, 
  faPaperPlane, 
  faFaceSmile, 
  faBullhorn 
} from '@fortawesome/free-solid-svg-icons';
import { ChatMessage } from './GameBoard';
import { getThemeColor } from './colors';

interface GameChatProps {
  isChatOpen: boolean;
  toggleChat: () => void;
  unreadCount: number;
  messages: ChatMessage[];
  roomCode: string;
  myClientId: string;
  sendChatMessage: (text: string, isAlert?: boolean) => void;
  isDark: boolean;
}

const EMOJIS = [
  '🔥', '😂', '👍', '🎉', '❤️', '👑', '💣', '💥', '⚡', '🏆', 
  '😮', '😢', '📢', '🤝', '💀', '🧠', '🎮', '👾', '🎯', '🚀',
  '😭', '😱', '🤫', '👀', '✨', '💯', '👏', '🙌', '💪', '🙏'
];

export default function GameChat({
  isChatOpen,
  toggleChat,
  unreadCount,
  messages,
  roomCode,
  myClientId,
  sendChatMessage,
  isDark,
}: GameChatProps) {
  const [inputText, setInputText] = useState<string>('');
  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false);
  const [isAlertMode, setIsAlertMode] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll chat to bottom when new messages arrive or drawer opens
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const handleEmojiClick = (emoji: string) => {
    const input = inputRef.current;
    const start = input?.selectionStart || 0;
    const end = input?.selectionEnd || 0;
    const newText = inputText.substring(0, start) + emoji + inputText.substring(end);
    setInputText(newText);
    
    // Maintain focus and set cursor position after inserting emoji
    setTimeout(() => {
      if (input) {
        input.focus();
        if (input.setSelectionRange) {
          input.setSelectionRange(start + emoji.length, start + emoji.length);
        }
      }
    }, 50);
  };

  const handleInputChange = (val: string) => {
    let processed = val;
    const shortcuts: Record<string, string> = {
      ':)': '😊',
      ':(': '😢',
      ':D': '😀',
      ';)': '😉',
      ':P': '😛',
      '<3': '❤️',
      ':fire:': '🔥',
      ':crown:': '👑',
      ':bomb:': '💣',
      ':boom:': '💥',
      ':star:': '⭐',
      ':ok:': '👌',
      ':gg:': '🎮',
    };
    for (const [shortcut, emoji] of Object.entries(shortcuts)) {
      processed = processed.replace(shortcut, emoji);
    }
    setInputText(processed);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay when Chat is Open */}
      {isChatOpen && (
        <div 
          onClick={toggleChat}
          className="sm:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-[65] pointer-events-auto transition-opacity"
        />
      )}

      {/* Chat Drawer / Bottom Sheet */}
      {isChatOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:right-6 sm:bottom-22 z-[70] pointer-events-auto flex flex-col bg-[var(--color-surface)]/95 backdrop-blur-xl sm:backdrop-blur-md border-t sm:border border-[var(--color-border)]/60 rounded-t-3xl sm:rounded-3xl w-full sm:w-[360px] max-h-[85dvh] sm:h-[500px] overflow-hidden shadow-2xl animate-slide-up-sheet sm:animate-fade-in-up">
          
          {/* Mobile Drag Indicator Handle */}
          <div className="sm:hidden w-full flex items-center justify-center pt-2.5 pb-1">
            <div className="w-10 h-1 rounded-full bg-[var(--color-border)]/80" />
          </div>

          {/* Chat Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 sm:p-4 border-b border-[var(--color-border)]/40 bg-[var(--color-background)]/60">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-status-easy)] animate-pulse" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-extrabold text-[var(--color-foreground)] tracking-wide">Session Chat</h3>
              <p className="truncate text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Room Code: {roomCode}</p>
            </div>
            <span className="flex-shrink-0 rounded-full border border-[var(--color-border)]/50 bg-[var(--color-surface)] px-2 py-0.5 text-xs font-bold text-[var(--color-muted)]">
              {messages.length} msgs
            </span>
            <button
              onClick={toggleChat}
              aria-label="Close chat"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-bold text-[var(--color-muted)] transition hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-95 sm:hidden"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 custom-scrollbar min-h-[160px]" ref={chatContainerRef}>
            {messages.length === 0 ? (
              <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-center p-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]/50 flex items-center justify-center text-[var(--color-muted)] mb-2">
                  <FontAwesomeIcon icon={faComments} className="text-sm opacity-60" />
                </div>
                <p className="text-xs font-bold text-[var(--color-foreground)]/80 mb-0.5">No messages yet</p>
                <p className="max-w-[200px] text-xs leading-relaxed text-[var(--color-muted)]">Send a message to coordinate strategy with other players.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.clientId === myClientId;
                const senderThemeColor = getThemeColor(msg.senderColor, isDark);
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[88%] sm:max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: senderThemeColor }}
                      />
                      <span className="max-w-[100px] truncate text-xs font-extrabold text-[var(--color-muted)]">
                        {msg.senderName} {isMe && '(You)'}
                      </span>
                      {msg.isAlert && (
                        <span className="rounded border border-[var(--color-status-hard)]/20 bg-[var(--color-status-hard)]/10 px-1 text-xs font-bold text-[var(--color-status-hard)]">
                          SHOUT
                        </span>
                      )}
                      <span className="font-mono text-xs font-medium text-[var(--color-muted)]/80">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`rounded-2xl px-3 py-1.5 text-xs font-semibold break-words w-full shadow-sm border transition-all ${
                        msg.isAlert ? 'border-orange-500/40 bg-orange-500/5' : ''
                      }`}
                      style={{
                        backgroundColor: msg.isAlert 
                          ? undefined 
                          : (isMe ? `${senderThemeColor}10` : 'var(--color-surface)'),
                        borderColor: msg.isAlert 
                          ? undefined 
                          : (isMe ? `${senderThemeColor}30` : 'var(--color-border)'),
                        color: msg.isAlert 
                          ? 'var(--color-foreground)' 
                          : (isMe ? senderThemeColor : 'var(--color-foreground)'),
                        boxShadow: isMe && !msg.isAlert ? `0 2px 10px ${senderThemeColor}05` : 'none',
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Emoji Picker Popover */}
          {isEmojiOpen && (
            <div className="absolute bottom-[110px] left-3 right-3 bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)]/80 rounded-2xl p-2.5 shadow-xl animate-fade-in-up z-50 pointer-events-auto">
              <div className="flex justify-between items-center mb-1.5 px-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-muted)]">Quick Emojis</span>
                <button 
                  type="button" 
                  onClick={() => setIsEmojiOpen(false)} 
                  aria-label="Close emoji picker"
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-xs font-bold text-[var(--color-muted)] transition hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="grid max-h-36 grid-cols-5 gap-2 overflow-y-auto pr-0.5 emoji-scrollbar">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-1 text-2xl transition hover:bg-[var(--color-border)]/45 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-90 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Form with Safe Area Inset Support */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputText.trim()) {
                sendChatMessage(inputText, isAlertMode);
                setInputText('');
                setIsAlertMode(false);
              }
            }}
            className="p-3 border-t border-[var(--color-border)]/40 bg-[var(--color-background)]/40 flex flex-col gap-2 relative pointer-events-auto"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Toolbar for Quick Emojis & Shout Mode */}
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5">
                {/* Quick emoji shortcuts */}
                {['🔥', '😂', '👍', '❤️'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    aria-label={`Send ${emoji} reaction`}
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-xl transition hover:scale-105 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-95 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                  aria-label="Open emoji picker"
                  aria-expanded={isEmojiOpen}
                  className={`flex h-11 w-11 items-center justify-center rounded-lg text-xs text-[var(--color-muted)] transition hover:bg-[var(--color-border)]/40 hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-90 cursor-pointer ${
                    isEmojiOpen ? 'bg-[var(--color-border)]/40 text-[var(--color-foreground)]' : ''
                  }`}
                  title="Open emoji grid"
                >
                  <FontAwesomeIcon icon={faFaceSmile} />
                </button>
              </div>

              {/* Megaphone alert toggle */}
              <button
                type="button"
                onClick={() => setIsAlertMode(!isAlertMode)}
                aria-pressed={isAlertMode}
                className={`flex min-h-11 items-center gap-1 rounded-md border px-3 py-2 text-xs font-bold transition duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-95 cursor-pointer ${
                  isAlertMode
                    ? 'bg-[var(--color-status-hard)]/10 border-[var(--color-status-hard)]/30 text-[var(--color-status-hard)] hover:bg-[var(--color-status-hard)]/20'
                    : 'bg-transparent border-[var(--color-border)]/60 text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/20'
                }`}
                title="Toggle Shout mode (creates screen banner overlay)"
              >
                <FontAwesomeIcon icon={faBullhorn} className={isAlertMode ? 'text-[var(--color-status-hard)]' : ''} />
                SHOUT {isAlertMode ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Input Box and Submit */}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                maxLength={100}
                value={inputText}
                autoComplete="off"
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={isAlertMode ? "Shout a message to everyone..." : "Type your message..."}
                className={`flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[var(--color-accent)] transition placeholder:text-[var(--color-muted)] ${
                  isAlertMode ? 'shout-input-active focus:border-orange-500' : ''
                }`}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                aria-label="Send message"
                className={`w-11 h-11 rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-contrast)] flex items-center justify-center hover:scale-105 active:scale-90 transition disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer ${
                  isAlertMode && inputText.trim() ? 'shout-pulse-active' : ''
                }`}
              >
                <FontAwesomeIcon icon={isAlertMode ? faBullhorn : faPaperPlane} className="text-xs" />
              </button>
            </div>
          </form>

        </div>
      )}

      {/* Chat Floating Action Button (FAB) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] pointer-events-none">
        <button
          onClick={toggleChat}
          aria-label="Toggle game chat"
          className="pointer-events-auto relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-accent-contrast)] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
        >
          <FontAwesomeIcon 
            icon={faComments} 
            className={`text-lg sm:text-xl transition-transform duration-300 ${isChatOpen ? 'rotate-180 scale-90' : 'rotate-0'}`} 
          />
          
          {!isChatOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[var(--color-background)] bg-[var(--color-status-danger-strong)] px-1 text-xs font-black text-[var(--color-status-danger-contrast)] shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
