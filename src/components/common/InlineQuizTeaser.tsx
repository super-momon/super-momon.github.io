"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faRotateRight, faGamepad, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { trackEvent } from "@/lib/analytics";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

const sampleQuestions: Question[] = [
  {
    category: "React & Next.js",
    question: "Which hook should be used to opt out of SSR hydration mismatches when reading browser-only APIs?",
    options: [
      "useLayoutEffect / useEffect with mounted state check",
      "useMemo with empty dependency array",
      "useCallback inside page root",
      "useSyncExternalStore with server snapshot fallback",
    ],
    correctIndex: 3,
    explanation: "useSyncExternalStore with getServerSnapshot allows subscription to client-only stores while safely matching server SSR state during initial hydration.",
  },
  {
    category: "TypeScript",
    question: "What does the 'satisfies' operator accomplish in TypeScript 4.9+?",
    options: [
      "Casts any value to unknown without type checking",
      "Validates an expression matches a type while preserving its exact inferred literal type",
      "Forces a type to become mutable",
      "Automatically generates runtime JSON schema validations",
    ],
    correctIndex: 1,
    explanation: "satisfies validates that an object conforms to an interface while retaining its specific property keys and literal types instead of widening.",
  },
  {
    category: "Web Performance",
    question: "What is the primary benefit of using Next.js App Router Server Components (RSC)?",
    options: [
      "They run entirely in browser Service Workers",
      "They send zero JavaScript bytes to the client bundle for server-rendered component logic",
      "They replace CSS stylesheets with WebGL shaders",
      "They require all components to be wrapped in use client",
    ],
    correctIndex: 1,
    explanation: "React Server Components execute strictly on the server and stream UI HTML to the client without adding their component code to client JS bundles.",
  },
];

export default function InlineQuizTeaser() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQ = sampleQuestions[questionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedIndex(idx);
    setIsAnswered(true);
    trackEvent("inline_quiz_answer", {
      category: currentQ.category,
      correct: idx === currentQ.correctIndex,
    });
  };

  const handleNextQuestion = () => {
    setSelectedIndex(null);
    setIsAnswered(false);
    setQuestionIndex((prev) => (prev + 1) % sampleQuestions.length);
  };

  return (
    <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-background/70 border border-border/60 shadow-xs backdrop-blur-md">
      {/* Quiz Header */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-border/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent/80 animate-pulse" />
          <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">
            Live Quiz Teaser • {currentQ.category}
          </span>
        </div>
        <span className="text-[10px] font-mono text-foreground/50">
          Sample {questionIndex + 1}/{sampleQuestions.length}
        </span>
      </div>

      {/* Question Text with stable min-height */}
      <div className="min-h-[44px] flex items-center mb-3">
        <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
          {currentQ.question}
        </p>
      </div>

      {/* Option Cards Grid with stable card min-height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {currentQ.options.map((option, i) => {
          const isSelected = selectedIndex === i;
          const isCorrect = i === currentQ.correctIndex;
          let btnStyle = "bg-surface/80 border-border/60 hover:border-accent/50 hover:bg-surface text-foreground/90";

          if (isAnswered) {
            if (isCorrect) {
              btnStyle = "bg-accent/15 border-accent/70 text-accent font-semibold";
            } else if (isSelected) {
              btnStyle = "bg-red-500/15 border-red-500/50 text-red-400 font-semibold";
            } else {
              btnStyle = "bg-surface/30 border-border/20 text-foreground/40 opacity-40";
            }
          }

          return (
            <button
              key={i}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelectOption(i)}
              className={`flex items-start gap-2.5 p-2.5 min-h-[50px] rounded-xl border text-left text-xs transition-colors duration-200 cursor-pointer ${btnStyle}`}
            >
              <span className="shrink-0 w-5 h-5 rounded-md bg-background/60 border border-border/50 flex items-center justify-center text-[10px] font-mono font-bold mt-0.5">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 leading-snug">{option}</span>
              {isAnswered && isCorrect && (
                <FontAwesomeIcon icon={faCheck} className="text-accent text-xs mt-0.5 shrink-0" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <FontAwesomeIcon icon={faXmark} className="text-red-400 text-xs mt-0.5 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Feedback Zone - Fixed layout footprint prevents shifts */}
      <div className="min-h-[54px] relative mb-3">
        <AnimatePresence mode="wait">
          {isAnswered ? (
            <motion.div
              key={`ans-${questionIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-3 rounded-xl text-xs leading-relaxed ${
                selectedIndex === currentQ.correctIndex
                  ? "bg-accent/10 border border-accent/30 text-foreground/90"
                  : "bg-red-500/10 border border-red-500/25 text-foreground/90"
              }`}
            >
              <span className={`font-semibold mr-1.5 ${selectedIndex === currentQ.correctIndex ? "text-accent" : "text-red-400"}`}>
                {selectedIndex === currentQ.correctIndex ? "Correct!" : "Incorrect."}
              </span>
              {currentQ.explanation}
            </motion.div>
          ) : (
            <motion.div
              key={`hint-${questionIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-3 rounded-xl bg-surface/40 border border-border/30 text-xs text-foreground/50 leading-relaxed flex items-center justify-between"
            >
              <span>Select an option above to test your knowledge.</span>
              <span className="text-[10px] font-mono text-accent/70 uppercase tracking-wider shrink-0 ml-2">Quick Quiz</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistent Action Bar */}
      <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-border/30">
        <button
          type="button"
          onClick={handleNextQuestion}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/80 border border-border/60 text-xs font-medium text-foreground/80 hover:text-accent hover:border-accent/50 transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
          <span>{isAnswered ? "Next Sample" : "Skip Question"}</span>
        </button>

        <a
          href="/games/quiz"
          onClick={() => trackEvent("inline_quiz_play_full", { category: currentQ.category })}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent/90 hover:bg-accent text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
        >
          <FontAwesomeIcon icon={faGamepad} className="text-[11px]" />
          <span>Play Full Game</span>
          <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
        </a>
      </div>
    </div>
  );
}

