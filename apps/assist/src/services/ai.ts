
import { ChatMessage } from "@/types/chat";

export async function analyzeSentiment(text: string): Promise<"positive" | "negative" | "neutral"> {
  try {
    // Basic sentiment analysis fallback using simple word matching
    const positiveWords = ["good", "great", "awesome", "excellent", "happy", "love", "wonderful", "fantastic"];
    const negativeWords = ["bad", "terrible", "awful", "horrible", "sad", "hate", "poor", "disappointed"];
    
    const lowercaseText = text.toLowerCase();
    const words = lowercaseText.split(/\s+/);
    
    let positiveCount = words.filter(word => positiveWords.includes(word)).length;
    let negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return "neutral";
  }
}

export async function detectLanguage(text: string): Promise<string> {
  try {
    // Basic language detection fallback
    const commonEnglishWords = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "i"];
    const commonSpanishWords = ["el", "la", "de", "que", "y", "en", "un", "ser", "se", "no"];
    const commonFrenchWords = ["le", "la", "de", "et", "un", "être", "avoir", "que", "pour", "dans"];
    
    const words = text.toLowerCase().split(/\s+/);
    let englishCount = words.filter(word => commonEnglishWords.includes(word)).length;
    let spanishCount = words.filter(word => commonSpanishWords.includes(word)).length;
    let frenchCount = words.filter(word => commonFrenchWords.includes(word)).length;
    
    if (spanishCount > englishCount && spanishCount > frenchCount) return "es";
    if (frenchCount > englishCount && frenchCount > spanishCount) return "fr";
    return "en";
  } catch (error) {
    console.error("Error detecting language:", error);
    return "en";
  }
}

export async function processMessage(message: Omit<ChatMessage, "sentiment" | "language">): Promise<ChatMessage> {
  const [sentiment, language] = await Promise.all([
    analyzeSentiment(message.content),
    detectLanguage(message.content)
  ]);

  return {
    ...message,
    sentiment,
    language
  };
}
