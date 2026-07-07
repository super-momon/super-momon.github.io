# Task List - Chat Refactoring and Shout Alerts

- [x] Add shout alert sound to AudioSynth
- [x] Add CSS classes and keyframes to `chain-reaction.css`
  - [x] Board screen shake class
  - [x] Shout alert banner layout and animations
  - [x] Emoji picker and Shout mode styling
- [x] Create `GameChat.tsx` component file
  - [x] Support props for chat open/close, toggle, messages, online room code, sending message, theme color, etc.
  - [x] Implement Emoticon picker panel toggle
  - [x] Implement Emoticon click triggers and type-shortcuts
  - [x] Implement Shout/Alert Mode toggle button
- [x] Refactor `GameBoard.tsx`
  - [x] Update ChatMessage interface and export types
  - [x] Add state for `activeAlert` and `isShoutShaking`
  - [x] Update chat receive/send listener to handle alerts, play sound, shake board, and display overlay
  - [x] Replace inline JSX chat code with the new `<GameChat>` component
- [x] Verify functionality
