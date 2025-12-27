'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a 3-question multiple-choice quiz from lecture notes in a PDF format.
 *
 * - generateExamQuiz - An async function that takes PDF data URI as input and returns a quiz with 3 questions.
 * - GenerateExamQuizInput - The input type for the generateExamQuiz function.
 * - GenerateExamQuizOutput - The output type for the generateExamQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExamQuizInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      'A PDF document represented as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // keep the single quotes in the string literal, to avoid prematurely terminating the string.
    ),
});
export type GenerateExamQuizInput = z.infer<typeof GenerateExamQuizInputSchema>;

const GenerateExamQuizOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The text of the question.'),
      options: z.array(z.string()).describe('An array of possible answers.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
    })
  ).length(3).describe('An array of 3 multiple-choice questions.'),
});
export type GenerateExamQuizOutput = z.infer<typeof GenerateExamQuizOutputSchema>;

export async function generateExamQuiz(input: GenerateExamQuizInput): Promise<GenerateExamQuizOutput> {
  return generateExamQuizFlow(input);
}

const generateExamQuizPrompt = ai.definePrompt({
  name: 'generateExamQuizPrompt',
  input: {schema: GenerateExamQuizInputSchema},
  output: {schema: GenerateExamQuizOutputSchema},
  prompt: `You are an expert at creating multiple-choice quizzes from lecture notes.

  Create a 3-question multiple-choice quiz based on the content of the following PDF document.

  The quiz should test the user's understanding of the key concepts and ideas presented in the document.

  The quiz should have 3 questions, each with 4 possible answers. One of the answers should be the correct answer.

  PDF Document: {{media url=pdfDataUri}}
  `,
});

const generateExamQuizFlow = ai.defineFlow(
  {
    name: 'generateExamQuizFlow',
    inputSchema: GenerateExamQuizInputSchema,
    outputSchema: GenerateExamQuizOutputSchema,
  },
  async input => {
    const {output} = await generateExamQuizPrompt(input);
    return output!;
  }
);
