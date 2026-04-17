import {FunctionTool, LlmAgent} from '@google/adk';
import {z} from 'zod';

/* Mock tool implementation */
const answerQuestionTool = new FunctionTool({
  name: 'answer_question',
  description: 'Use this tool to find specific answers to questions from an external knowledge base.',
  parameters: z.object({
    question: z.string().describe('The question that needs to be answered.'),
  }),
  execute: async ({question}) => {
    return { status: 'success', answer: `I searched the external database. Here is the simulated answer for: "${question}"` };
  },
});

export const rootAgent = new LlmAgent({
  name: 'general_assistant_agent',
  model: 'gemini-flash-latest',
  description: 'A general-purpose assistant that can answer any questions.',
  instruction: 'You are a helpful assistant that can answer any questions.',
  tools: [answerQuestionTool],
});