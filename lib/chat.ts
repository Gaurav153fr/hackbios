import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
export const runtime = 'edge';
// Load your API key securely
const MY_GEMINI_API_KEY = "AIzaSyDNKkIPOi0WRJMqeCRFm16YB4sN8czr1kg"

// Create a custom Google Generative AI instance
const google = createGoogleGenerativeAI({
  apiKey: MY_GEMINI_API_KEY,
});

/**
 * Generates responses from the AI assistant for your import/export marketplace.
 * The assistant only provides information about tariffs, deals, rules, shipping, customs, etc.
 * It never gives personal advice or unrelated content.
 *
 * @param userQuery The user's question or prompt
 * @returns {Promise<string>} AI-generated assistant response
 */
const getAssistantResponse = async (userQuery: string) => {
  try {
    const systemPrompt = `
      You are a helpful assistant for an import/export marketplace. 
      Only provide information about tariffs, deals, rules, regulations, shipping, customs, product guidelines, and marketplace policies. 
      Do not provide unrelated content. Keep responses professional, concise, and informative.
    `;

    const { text } = await generateText({
      model: google('gemini-2.5-flash'), 
      prompt: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      ],
      maxOutputTokens: 500,
    });

    return text;
  } catch (error) {
    console.error("Error generating assistant response:", error);
    return "Sorry, I couldn't fetch the information. Please try again later.";
  }
};

export { getAssistantResponse };
