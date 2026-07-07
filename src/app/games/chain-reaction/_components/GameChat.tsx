'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments, 
  faPaperPlane, 
  faFaceSmile, 
  faBullhorn 
} from '@fortawesome/free-solid-svg-icons';
import { ChatMessage, Player } from './GameBoard';
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
  players: Player[];
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
  players
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
    const input = inputRef.current as any;
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
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Chat Drawer/Panel */}
      {isChatOpen && (
        <div className="pointer-events-auto flex flex-col bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-border)]/50 rounded-3xl w-[320px] sm:w-[360px] h-[450px] sm:h-[500px] overflow-hidden shadow-2xl animate-fade-in-up relative">
          
          {/* Chat Header */}
          <div className="flex items-center gap-2.5 p-4 border-b border-[var(--color-border)]/40 bg-[var(--color-background)]/60">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <div className="flex-1">
              <h3 className="text-xs font-extrabold text-[var(--color-foreground)] tracking-wide">Session Chat</h3>
              <p className="text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider">Room Code: {roomCode}</p>
            </div>
            <span className="text-[9px] font-bold text-[var(--color-muted)] bg-[var(--color-surface)] px-2 py-0.5 rounded-full border border-[var(--color-border)]/50">
              {messages.length} messages
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" ref={chatContainerRef}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]/50 flex items-center justify-center text-[var(--color-muted)] mb-3">
                  <FontAwesomeIcon icon={faComments} className="text-sm opacity-60" />
                </div>
                <p className="text-xs font-bold text-[var(--color-foreground)]/80 mb-1">No messages yet</p>
                <p className="text-[10px] text-[var(--color-muted)] max-w-[200px] leading-relaxed">Send a message to coordinate strategy with other players.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.clientId === myClientId;
                const senderThemeColor = getThemeColor(msg.senderColor, isDark);
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: senderThemeColor }}
                      />
                      <span className="text-[9px] font-extrabold text-[var(--color-muted)] truncate max-w-[100px]">
                        {msg.senderName} {isMe && '(You)'}
                      </span>
                      {msg.isAlert && (
                        <span className="text-[8px] font-bold text-orange-500 bg-orange-500/10 px-1 rounded border border-orange-500/20">
                          SHOUT
                        </span>
                      )}
                      <span className="text-[8px] text-[var(--color-muted)]/60 font-medium">
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
            <div className="absolute bottom-[100px] left-3 right-3 bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)]/80 rounded-2xl p-2.5 shadow-xl animate-fade-in-up z-50 pointer-events-auto">
              <div className="flex justify-between items-center mb-1.5 px-1">
                <span className="text-[9px] font-extrabold text-[var(--color-muted)] uppercase tracking-wider">Quick Emojis</span>
                <button 
                  type="button" 
                  onClick={() => setIsEmojiOpen(false)} 
                  className="text-[10px] font-bold text-[var(--color-muted)] hover:text-[var(--color-foreground)] px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1 max-h-[120px] overflow-y-auto emoji-scrollbar pr-0.5">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-lg p-1 hover:bg-[var(--color-border)]/45 rounded-lg active:scale-90 transition cursor-pointer flex items-center justify-center"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputText.trim()) {
                sendChatMessage(inputText, isAlertMode);
                setInputText('');
                setIsAlertMode(false);
              }
            }}
            className="p-3 border-t border-[var(--color-border)]/40 bg-[var(--color-background)]/30 flex flex-col gap-2 relative pointer-events-auto"
          >
            {/* Toolbar for Quick Emojis & Shout Mode */}
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5">
                {/* Micro emoji buttons */}
                {['🔥', '😂', '👍', '❤️'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-xs hover:scale-125 active:scale-95 transition cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] hover:bg-[var(--color-border)]/40 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition cursor-pointer ${
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
                className={`px-2 py-0.5 rounded-md flex items-center gap-1 text-[9px] font-bold border transition duration-200 cursor-pointer ${
                  isAlertMode
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20'
                    : 'bg-transparent border-[var(--color-border)]/60 text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/20'
                }`}
                title="Toggle Shout mode (creates screen banner overlay)"
              >
                <FontAwesomeIcon icon={faBullhorn} className={isAlertMode ? 'animate-bounce' : ''} />
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
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={isAlertMode ? "Shout a message to everyone..." : "Type your message..."}
                className={`flex-1 bg-[var(--color-surface)] border border(--color-border) rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[var(--color-accent)] transition placeholder:text-[var(--color-muted)] ${
                  isAlertMode ? 'shout-input-active focus:border-orange-500' : ''
                }`}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`w-8 h-8 rounded-xl bg-[var(--color-accent)] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer ${
                  isAlertMode && inputText.trim() ? 'shout-pulse-active' : ''
                }`}
              >
                <FontAwesomeIcon icon={isAlertMode ? faBullhorn : faPaperPlane} className="text-[10px]" />
              </button>
            </div>
          </form>

        </div>
      )}

      {/* Chat Floating Action Button (FAB) */}
      <button
        onClick={toggleChat}
        aria-label="Toggle game chat"
        className="pointer-events-auto relative w-14 h-14 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <FontAwesomeIcon 
          icon={faComments} 
          className={`text-xl transition-transform duration-300 ${isChatOpen ? 'rotate-180 scale-90' : 'rotate-0'}`} 
        />
        
        {!isChatOpen && unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center border-2 border-[var(--color-background)] shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
