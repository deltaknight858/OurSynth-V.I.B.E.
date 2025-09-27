import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI client
// IMPORTANT: Ensure your OPENAI_API_KEY is set in your .env.local file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { keywords } = req.body;

  if (!keywords || typeof keywords !== 'string' || keywords.trim().length === 0) {
    return res.status(400).json({ message: 'Keywords are required and must be a non-empty string.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is not configured.');
    return res.status(500).json({ message: 'AI service is not configured on the server.' });
  }

  try {
    const prompt = `
      You are a creative domain name generator. Your task is to generate 8 catchy and available-sounding domain name ideas based on user-provided keywords.
      The domains should be short, memorable, and end with a common TLD like .com, .ai, .io, or .co.
      Return ONLY a valid JSON array of strings. For example: ["domain1.com", "domain2.ai"].
      Do not include any other text, markdown, or explanation in your response.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: `Keywords: "${keywords}"`,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      throw new Error('Received an empty response from AI.');
    }

    // Attempt to parse the JSON response from the AI
    const suggestions = JSON.parse(content);

    // Basic validation to ensure it's an array of strings
    if (!Array.isArray(suggestions) || !suggestions.every(s => typeof s === 'string')) {
        throw new Error('AI returned data in an unexpected format.');
    }

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error calling OpenAI or parsing response:', error);
    res.status(500).json({ message: 'Failed to generate domain suggestions. Please try again.' });
  }
}
    
