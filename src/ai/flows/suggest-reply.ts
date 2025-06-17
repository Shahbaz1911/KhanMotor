'use server';

/**
 * @fileOverview An AI agent that suggests replies to common user inquiries.
 *
 * - suggestReply - A function that generates a reply suggestion.
 * - SuggestReplyInput - The input type for the suggestReply function.
 * - SuggestReplyOutput - The return type for the suggestReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReplyInputSchema = z.object({
  inquiry: z.string().describe('The user inquiry to respond to.'),
  tone: z
    .string()
    .optional()
    .describe('The desired tone of the response (e.g., friendly, professional, formal).'),
  detailLevel:
    z.string().optional().describe('The desired level of detail in the response (e.g., brief, detailed).'),
});
export type SuggestReplyInput = z.infer<typeof SuggestReplyInputSchema>;

const SuggestReplyOutputSchema = z.object({
  reply: z.string().describe('The suggested reply to the user inquiry.'),
});
export type SuggestReplyOutput = z.infer<typeof SuggestReplyOutputSchema>;

export async function suggestReply(input: SuggestReplyInput): Promise<SuggestReplyOutput> {
  return suggestReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReplyPrompt',
  input: {schema: SuggestReplyInputSchema},
  output: {schema: SuggestReplyOutputSchema},
  prompt: `You are a customer service representative for Khan Motor. Generate a reply to the following user inquiry:

Inquiry: {{{inquiry}}}

Tone: {{tone}}
Detail Level: {{detailLevel}}

Reply:`,
});

const suggestReplyFlow = ai.defineFlow(
  {
    name: 'suggestReplyFlow',
    inputSchema: SuggestReplyInputSchema,
    outputSchema: SuggestReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
