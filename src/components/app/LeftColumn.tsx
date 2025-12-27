'use client';

import { FileUpload } from '@/components/app/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Loader2, BookCheck, FileText, HelpCircle } from 'lucide-react';

type PdfFile = {
  name: string;
  dataUri: string;
};

interface LeftColumnProps {
  pdfFile: PdfFile | null;
  setPdfFile: (file: PdfFile | null) => void;
  onGenerateSummary: () => void;
  onGenerateQuiz: () => void;
  loading: {
    summary: boolean;
    quiz: boolean;
  };
}

export function LeftColumn({ pdfFile, setPdfFile, onGenerateSummary, onGenerateQuiz, loading }: LeftColumnProps) {
  return (
    <aside className="w-[380px] flex-shrink-0 border-r bg-card p-6 flex flex-col gap-8">
      <header className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BookCheck className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">VidyaAce</h1>
          <p className="text-sm text-muted-foreground">Your AI study partner. Upload notes for summaries, quizzes & answers.</p>
        </div>
      </header>

      <FileUpload onFileChange={setPdfFile} uploadedFile={pdfFile} />

      <div className="flex flex-col gap-4">
        <Button
          onClick={onGenerateSummary}
          disabled={!pdfFile || loading.summary || loading.quiz}
          size="lg"
          variant="secondary"
          className="w-full justify-start text-md h-12"
        >
          {loading.summary ? (
            <Loader2 className="animate-spin" />
          ) : (
            <FileText />
          )}
          Summary
        </Button>

        <Button
          onClick={onGenerateQuiz}
          disabled={!pdfFile || loading.quiz || loading.summary}
          size="lg"
          className="w-full justify-start text-md h-12"
        >
          {loading.quiz ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Lightbulb />
          )}
          Quiz Me
        </Button>
      </div>

    </aside>
  );
}
