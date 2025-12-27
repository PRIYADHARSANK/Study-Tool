import { config } from 'dotenv';
config();

import '@/ai/flows/answer-question-from-notes.ts';
import '@/ai/flows/summarize-lecture-notes.ts';
import '@/ai/flows/generate-exam-quiz.ts';