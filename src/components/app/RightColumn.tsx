'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ActiveView } from '@/app/page';
import type { QuizData, ChatMessage, QuizQuestion } from '@/lib/types';
import { ChatView } from './ChatView';
import { SummaryView } from './SummaryView';
import { QuizView } from './QuizView';
import { Loader2 } from 'lucide-react';

interface RightColumnProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  summary: string | null;
  quiz: QuizData | null;
  chatHistory: ChatMessage[];
  onChatSubmit: (question: string) => Promise<void>;
  onGenerateQuiz: (previousQuestions?: QuizQuestion[]) => Promise<void>;
  isChatLoading: boolean;
  isQuizLoading: boolean;
  isSummaryLoading: boolean;
  isPdfUploaded: boolean;
}

const LoadingPlaceholder = ({ text }: { text: string }) => (
    <div className="flex items-center justify-center h-full flex-col text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg font-semibold text-foreground">{text}</p>
        <p className="text-sm text-muted-foreground">Please wait a moment...</p>
    </div>
);


export function RightColumn({
  activeView,
  setActiveView,
  summary,
  quiz,
  chatHistory,
  onChatSubmit,
  onGenerateQuiz,
  isChatLoading,
  isQuizLoading,
  isSummaryLoading,
  isPdfUploaded,
}: RightColumnProps) {
  const handleClose = () => setActiveView('chat');

  const renderContent = () => {
    switch (activeView) {
      case 'chat':
        return (
          <ChatView
            history={chatHistory}
            onSubmit={onChatSubmit}
            isLoading={isChatLoading}
            isPdfUploaded={isPdfUploaded}
          />
        );
      case 'summary':
        if (isSummaryLoading) return <LoadingPlaceholder text="Generating summary..." />;
        if (summary) return <SummaryView summary={summary} onClose={handleClose} />;
        return null;
      case 'quiz':
        // The loading state is handled inside QuizView for new set generation
        if (isQuizLoading && !quiz) return <LoadingPlaceholder text="Generating quiz..." />;
        if (quiz) return (
            <QuizView
                quiz={quiz}
                onClose={handleClose}
                onGenerateQuiz={onGenerateQuiz}
                isQuizLoading={isQuizLoading}
            />
        );
        return null;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 p-4 pl-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="h-full w-full bg-card rounded-xl shadow-sm border"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
