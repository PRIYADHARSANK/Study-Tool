# **App Name**: VidyaAce

## Core Features:

- PDF Upload and Handling: Allow users to upload PDF lecture notes and convert them to a Base64 data URI.
- AI Summary Generation: Generate a concise, bullet-point summary of the uploaded PDF using the Gemini model.
- AI Quiz Generation: Generate a 3-question multiple-choice quiz based on the content of the uploaded PDF using the Gemini model. Use a tool for reasoning to produce optimal quizes.
- AI Q&A Chat: Enable users to ask questions about the uploaded PDF and receive answers from an AI model, with a history of the conversation displayed.
- Text-to-Speech: Convert AI-generated content (summaries, quiz questions, and chat answers) into audible speech using a text-to-speech service. Generate data URIs from the text
- UI Layout and Transitions: Implement a two-column layout with smooth transitions between different views (Q&A, Summary, Quiz) using framer-motion.
- Notification System: Provide user feedback through toast notifications for events like successful file uploads or errors.

## Style Guidelines:

- Primary color: Violet (#A099FF) for a modern and intellectual feel.
- Background color: Light gray (#F0F0F5), desaturated violet to ensure a clean and unobtrusive backdrop.
- Accent color: Soft blue (#94B2E3), an analogous hue to the primary violet, but with reduced saturation and slightly brighter, for secondary actions.
- Body and headline font: 'Inter', a grotesque-style sans-serif font known for its modern and neutral appearance
- Code font: 'Source Code Pro' for displaying code snippets.
- Use a set of consistent and clear icons from ShadCN's Lucide library for key actions.
- Use subtle, smooth animations for transitions between different views and interactive elements.