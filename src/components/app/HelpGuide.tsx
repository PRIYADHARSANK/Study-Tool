'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle, FileUp, FileText, Lightbulb, BotMessageSquare } from 'lucide-react';

export function HelpGuide({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Welcome to VidyaAce!
          </DialogTitle>
          <DialogDescription>
            Here’s a quick guide on how to use your AI study partner.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg mt-1">
                <FileUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">1. Upload Your Notes</h3>
              <p>Click the upload area to select a PDF, or simply drag and drop your file. This will be the source for all AI interactions.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg mt-1">
                <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">2. Generate a Summary</h3>
              <p>Click "Generate Summary" to get a concise, bullet-point overview of your document's key concepts.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg mt-1">
                <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">3. Create a Quiz</h3>
              <p>Click "Generate Quiz" to test your knowledge with a multiple-choice quiz based on your notes.</p>
            </div>
          </div>
           <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg mt-1">
                <BotMessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">4. Chat with Your Notes</h3>
              <p>Ask any question about your document in the chat window, and the AI will provide a detailed answer based on the content.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
