'use client';

import * as React from 'react';
import { summarizeLectureNotes } from '@/ai/flows/summarize-lecture-notes';
import { generateExamQuiz } from '@/ai/flows/generate-exam-quiz';
import { answerQuestionFromNotes } from '@/ai/flows/answer-question-from-notes';
import type { QuizData, ChatMessage, QuizQuestion } from '@/lib/types';
import { LeftColumn } from '@/components/app/LeftColumn';
import { RightColumn } from '@/components/app/RightColumn';
import { useToast } from '@/hooks/use-toast';

export type ActiveView = 'chat' | 'summary' | 'quiz';

type PdfFile = {
  name: string;
  dataUri: string;
};

export default function Home() {
  const [pdfFile, setPdfFile] = React.useState<PdfFile | null>(null);
  const [activeView, setActiveView] = React.useState<ActiveView>('chat');
  const [summary, setSummary] = React.useState<string | null>(null);
  const [quiz, setQuiz] = React.useState<QuizData | null>(null);
  const [chatHistory, setChatHistory] = React.useState<ChatMessage[]>([]);
  const [loading, setLoading] = React.useState({
    summary: false,
    quiz: false,
    chat: false,
  });
  const { toast } = useToast();

  const handleSetPdfFile = (file: PdfFile | null) => {
    setPdfFile(file);
    if (file) {
      toast({
        title: 'File Uploaded',
        description: `${file.name} has been successfully uploaded.`,
      });
    } else {
      // Reset everything when file is removed
      setActiveView('chat');
      setSummary(null);
      setQuiz(null);
      setChatHistory([]);
    }
  };

  const handleGenerateSummary = async () => {
    if (!pdfFile) return;
    setLoading((prev) => ({ ...prev, summary: true }));
    setActiveView('summary');
    try {
      const result = await summarizeLectureNotes({ pdfDataUri: pdfFile.dataUri });
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate summary.',
      });
       setActiveView('chat');
    } finally {
      setLoading((prev) => ({ ...prev, summary: false }));
    }
  };

  const handleGenerateQuiz = async (previousQuestions?: QuizQuestion[]) => {
    if (!pdfFile) return;
    setLoading((prev) => ({ ...prev, quiz: true }));
    setActiveView('quiz');
    try {
      const result = await generateExamQuiz({ 
        pdfDataUri: pdfFile.dataUri,
        previousQuestions
      });
      setQuiz(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate quiz.',
      });
      setActiveView('chat');
    } finally {
      setLoading((prev) => ({ ...prev, quiz: false }));
    }
  };
  
  const handleChatSubmit = async (question: string) => {
    if (!pdfFile) return;
    setChatHistory((prev) => [...prev, { role: 'user', content: question }]);
    setLoading((prev) => ({ ...prev, chat: true }));
    try {
      const result = await answerQuestionFromNotes({
        pdfDataUri: pdfFile.dataUri,
        question,
      });
      setChatHistory((prev) => [...prev, { role: 'ai', content: result.answer }]);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get answer from AI.',
      });
      setChatHistory((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setLoading((prev) => ({ ...prev, chat: false }));
    }
  };
  

  return (
    <div className="flex h-screen w-full bg-background">
      <LeftColumn
        pdfFile={pdfFile}
        setPdfFile={handleSetPdfFile}
        onGenerateSummary={handleGenerateSummary}
        onGenerateQuiz={() => handleGenerateQuiz()}
        loading={loading}
      />
      <RightColumn
        activeView={activeView}
        setActiveView={setActiveView}
        summary={summary}
        quiz={quiz}
        chatHistory={chatHistory}
        onChatSubmit={handleChatSubmit}
        onGenerateQuiz={handleGenerateQuiz}
        isSummaryLoading={loading.summary}
        isChatLoading={loading.chat}
        isQuizLoading={loading.quiz}
        isPdfUploaded={!!pdfFile}
      />
    </div>
  );
}
