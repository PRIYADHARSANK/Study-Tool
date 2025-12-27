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
    <aside className="w-[380px] flex-shrink-0 border-r bg-background p-6 flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BookCheck className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">VidyaAce</h1>
          <p className="text-sm text-muted-foreground">Your AI study partner.</p>
        </div>
      </header>

      <FileUpload onFileChange={setPdfFile} uploadedFile={pdfFile} />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground px-2">AI Tools</h2>
        <Button
          onClick={onGenerateSummary}
          disabled={!pdfFile || loading.summary || loading.quiz}
          size="lg"
          variant="ghost"
          className="w-full justify-start text-base h-11"
        >
          {loading.summary ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          Generate Summary
        </Button>

        <Button
          onClick={onGenerateQuiz}
          disabled={!pdfFile || loading.quiz || loading.summary}
          size="lg"
          variant="ghost"
          className="w-full justify-start text-base h-11"
        >
          {loading.quiz ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Generate Quiz
        </Button>
      </div>
      
      <div className="mt-auto">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Need help?</p>
                <p className="text-xs text-muted-foreground">Check out the guide.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </aside>
  );
}
