'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Paperclip, Send, Loader2, FileWarning, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';
import { TextToSpeechButton } from '@/components/app/TextToSpeechButton';
import { Bot } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import jsPDF from 'jspdf';


interface ChatViewProps {
  history: ChatMessage[];
  onSubmit: (question: string) => Promise<void>;
  isLoading: boolean;
  isPdfUploaded: boolean;
}

const formSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty.'),
});
type FormValues = z.infer<typeof formSchema>;

export function ChatView({ history, onSubmit, isLoading, isPdfUploaded }: ChatViewProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: '' },
  });
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [history]);

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    await onSubmit(data.question);
    form.reset();
  };

  const downloadTxt = () => {
    const content = history
      .map((msg) => `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(12);

    history.forEach((msg) => {
      const text = `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`;
      const splitText = doc.splitTextToSize(text, 180);
      
      if (y + (splitText.length * 10) > 280) {
        doc.addPage();
        y = 10;
      }

      doc.text(splitText, 10, y);
      y += (splitText.length * 10);
    });

    doc.save('conversation.pdf');
  };

  return (
    <Card className="h-full flex flex-col shadow-none border-none">
      <CardHeader className="flex-row items-center justify-between">
        <div className='flex items-center gap-3'>
          <div className="p-2 bg-accent rounded-lg">
            <Bot className="h-6 w-6 text-accent-foreground" />
          </div>
          <CardTitle>Ask a Question</CardTitle>
        </div>
        {history.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Download className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={downloadTxt}>Download as TXT</DropdownMenuItem>
              <DropdownMenuItem onClick={downloadPdf}>Download as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
          {history.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <FileWarning className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-1">Upload your notes</h3>
              <p className="max-w-xs">
                Please upload a PDF to start chatting with the AI.
              </p>
            </div>
          )}
          <div className="space-y-6">
            {history.map((message, index) => (
              <div key={index} className={cn('flex items-start gap-4', message.role === 'user' && 'justify-end')}>
                {message.role === 'ai' && (
                   <div className="p-2 bg-accent rounded-lg h-9 w-9 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-accent-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-lg p-3 text-sm',
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.role === 'ai' && (
                    <TextToSpeechButton text={message.content} className="-mb-2 -mr-2 mt-1" />
                  )}
                </div>
              </div>
            ))}
            {isLoading && history[history.length-1]?.role === 'user' && (
              <div className="flex items-start gap-4">
                <div className="p-2 bg-accent rounded-lg h-9 w-9 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-0"></span>
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-150"></span>
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <CardFooter className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex w-full items-center space-x-2">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder={isPdfUploaded ? 'Ask anything about your notes...' : 'Please upload a PDF first'}
                          className="bg-background rounded-full h-12 pl-5 pr-14"
                          disabled={!isPdfUploaded || isLoading}
                          autoComplete="off"
                        />
                         <Button type="submit" size="icon" disabled={!isPdfUploaded || isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-primary hover:bg-primary/90">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

// Add Card components to satisfy compiler
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
