'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import type { QuizData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { TextToSpeechButton } from './TextToSpeechButton';

interface QuizViewProps {
  quiz: QuizData;
  onClose: () => void;
}

type QuizState = 'answering' | 'results';
type UserAnswers = Record<number, string>;

export function QuizView({ quiz, onClose }: QuizViewProps) {
  const [quizState, setQuizState] = React.useState<QuizState>('answering');
  const [userAnswers, setUserAnswers] = React.useState<UserAnswers>({});
  const [score, setScore] = React.useState(0);

  const formSchema = z.object(
    quiz.questions.reduce((acc, _, index) => {
      acc[index] = z.string({ required_error: 'Please select an answer.' });
      return acc;
    }, {} as Record<number, z.ZodString>)
  );
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setUserAnswers(data);
    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (data[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setQuizState('results');
  };

  const scorePercentage = (score / quiz.questions.length) * 100;

  if (quizState === 'results') {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><Trophy className="text-yellow-500" />Quiz Results</CardTitle>
            <CardDescription>Here's how you did on the quiz.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="text-center mb-6 p-6 bg-muted rounded-lg">
              <p className="text-lg text-muted-foreground">You scored</p>
              <p className="text-5xl font-bold text-primary my-2">{score} / {quiz.questions.length}</p>
              <Progress value={scorePercentage} className="w-full max-w-sm mx-auto mt-4" />
            </div>
            <div className="space-y-6">
              {quiz.questions.map((q, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                  <div key={index} className="p-4 border rounded-lg">
                    <p className="font-semibold mb-3 flex items-start gap-2">
                      {isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> : <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />}
                      {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((option, i) => {
                        const isUserAnswer = option === userAnswer;
                        const isCorrectAnswer = option === q.correctAnswer;
                        return (
                          <div
                            key={i}
                            className={cn(
                              "flex items-center space-x-2 text-sm p-2 rounded-md",
                              isCorrectAnswer && "bg-green-500/10 text-green-700 dark:text-green-400 font-medium",
                              isUserAnswer && !isCorrectAnswer && "bg-red-500/10 text-red-700 dark:text-red-400"
                            )}
                          >
                            <p>{option}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-6">
            <Button onClick={() => setQuizState('answering')} className="w-full">Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Generated Quiz</CardTitle>
          <CardDescription>Test your knowledge based on the document.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {quiz.questions.map((q, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`${index}` as any}
                  render={({ field }) => (
                    <FormItem className="space-y-3 p-4 border rounded-lg">
                      <FormLabel className="font-semibold flex items-center justify-between">
                        <span>{index + 1}. {q.question}</span>
                        <TextToSpeechButton text={q.question} />
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          {q.options.map((option, i) => (
                            <FormItem key={i} className="flex items-center space-x-3 space-y-0 p-2 rounded-md hover:bg-muted/50 transition-colors">
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className="font-normal w-full">{option}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" className="w-full">Submit Answers</Button>
            </form>
          </Form>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
