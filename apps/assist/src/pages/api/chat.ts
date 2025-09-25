import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // For now, let's use Hugging Face API for chat responses
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          do_sample: true,
        }
      })
    });

    if (!response.ok) {
      console.error('Hugging Face API error:', response.status, response.statusText);
      // Fallback to a simple response
      return res.status(200).json({
        response: `I understand you said: "${message}". I'm here to help! What would you like to know or discuss?`,
        sentiment: 'neutral',
        language: 'en'
      });
    }

    const data = await response.json();
    let aiResponse = '';

    if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text.replace(message, '').trim();
    } else if (data.generated_text) {
      aiResponse = data.generated_text.replace(message, '').trim();
    }

    // If no valid response, provide a fallback
    if (!aiResponse || aiResponse.length < 10) {
      aiResponse = `I understand you said: "${message}". I'm here to help with questions, creative tasks, problem-solving, and friendly conversation. What would you like to explore?`;
    }

    // Basic sentiment analysis
    const sentiment = await analyzeSentiment(aiResponse);
    const language = await detectLanguage(aiResponse);

    return res.status(200).json({
      response: aiResponse,
      sentiment,
      language
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Failed to process message',
      response: "I'm experiencing some technical difficulties, but I'm here to help! Please try again.",
      sentiment: 'neutral',
      language: 'en'
    });
  }
}

async function analyzeSentiment(text: string): Promise<"positive" | "negative" | "neutral"> {
  const positiveWords = ["good", "great", "awesome", "excellent", "happy", "love", "wonderful", "fantastic", "help", "amazing"];
  const negativeWords = ["bad", "terrible", "awful", "horrible", "sad", "hate", "poor", "disappointed", "problem", "error"];
  
  const lowercaseText = text.toLowerCase();
  const words = lowercaseText.split(/\s+/);
  
  let positiveCount = words.filter(word => positiveWords.includes(word)).length;
  let negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
}

async function detectLanguage(text: string): Promise<string> {
  const commonEnglishWords = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "you", "help", "what", "how"];
  const words = text.toLowerCase().split(/\s+/);
  let englishCount = words.filter(word => commonEnglishWords.includes(word)).length;
  
  return englishCount > 0 ? "en" : "en"; // Default to English for now
}