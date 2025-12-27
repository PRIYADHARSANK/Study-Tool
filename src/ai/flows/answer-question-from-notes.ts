'use server';

/**
 * @fileOverview A question answering AI agent for lecture notes.
 *
 * - answerQuestionFromNotes - A function that handles the question answering process.
 * - AnswerQuestionFromNotesInput - The input type for the answerQuestionFromNotes function.
 * - AnswerQuestionFromNotesOutput - The return type for the answerQuestionFromNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionFromNotesInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question about the PDF document.'),
});
export type AnswerQuestionFromNotesInput = z.infer<typeof AnswerQuestionFromNotesInputSchema>;

const AnswerQuestionFromNotesOutputSchema = z.object({
  answer: z.string().describe('The complete and detailed answer to the question about the PDF document.'),
});
export type AnswerQuestionFromNotesOutput = z.infer<typeof AnswerQuestionFromNotesOutputSchema>;

export async function answerQuestionFromNotes(
  input: AnswerQuestionFromNotesInput
): Promise<AnswerQuestionFromNotesOutput> {
  return answerQuestionFromNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionFromNotesPrompt',
  input: {schema: AnswerQuestionFromNotesInputSchema},
  output: {schema: AnswerQuestionFromNotesOutputSchema},
  prompt: `You are an expert AI assistant that provides complete and detailed answers to questions based on the content of a PDF document.

  Use the following PDF document as the primary source of information.
  PDF Document: {{media url=pdfDataUri}}

  Provide a complete and detailed answer to the following question.

  Question: {{{question}}}`,
});

const answerQuestionFromNotesFlow = ai.defineFlow(
  {
    name: 'answerQuestionFromNotesFlow',
    inputSchema: AnswerQuestionFromNotesInputSchema,
    outputSchema: AnswerQuestionFromNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
