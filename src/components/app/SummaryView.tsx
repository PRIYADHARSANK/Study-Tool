'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { TextToSpeechButton } from './TextToSpeechButton';

interface SummaryViewProps {
  summary: string;
  onClose: () => void;
}

export function SummaryView({ summary, onClose }: SummaryViewProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Generated Summary</CardTitle>
          <CardDescription>A concise, bullet-point summary of your document.</CardDescription>
        </div>
        <div className='flex items-center gap-2'>
          <TextToSpeechButton text={summary} />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
            {summary}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
