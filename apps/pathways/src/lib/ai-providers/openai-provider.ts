import OpenAI from 'openai';
import { AIProvider, AIMessage, GenerationOptions } from './types';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  public readonly name = 'OpenAI';

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  isConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }

  async generateComponent(prompt: string, options: GenerationOptions = {}): Promise<string> {
    const {
      maxTokens = 3000,
      temperature = 0.8,
      model = 'gpt-3.5-turbo'
    } = options;

    const systemPrompt = `You are an expert React component generator specializing in highly branded, visually stunning components with custom CSS and creative HTML structures.

CORE REQUIREMENTS:
- Generate modern, functional React components with TypeScript
- Use a mix of Material-UI AND custom CSS/HTML for maximum creativity
- Create components with strong visual branding and personality
- Include glass morphism, gradients, animations, and modern design patterns
- Use creative layouts that go beyond basic Material-UI limitations
- Add interactive hover effects, transitions, and micro-animations
- Include responsive design with mobile-first approach

STYLING APPROACH:
- Combine Material-UI components with custom styled divs/elements
- Use CSS modules or styled-components for custom styling
- Include Tailwind-like utility classes via sx prop or custom CSS
- Add custom CSS animations, gradients, and visual effects
- Create branded color schemes with purple (#a020f0) as primary
- Use glass morphism (backdrop-filter: blur) extensively
- Include floating elements, cards with depth, and layered designs

DESIGN PERSONALITY:
- Modern, premium, and sophisticated
- Tech-forward with AI/digital themes
- Clean but not minimal - rich visual hierarchy
- Dark themes with bright accent colors
- Futuristic feeling with smooth animations
- Professional but creative and memorable

COMPONENT STRUCTURE:
- Export as default functional component
- Include proper TypeScript interfaces for props
- Add JSDoc comments for complex functionality
- Include example usage in comments
- Make components highly reusable and configurable

SPECIAL FEATURES TO INCLUDE:
- Loading states with skeleton animations
- Empty states with engaging graphics
- Error states with helpful messaging
- Interactive elements with feedback
- Accessibility features (ARIA labels, keyboard nav)
- Mobile responsive design

Return ONLY the complete component code, no explanations.`;

    const completion = await this.client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Create a highly branded, visually stunning React component for: ${prompt}`,
        },
      ],
      max_tokens: maxTokens,
      temperature,
    });

    const generatedCode = completion.choices[0]?.message?.content;

    if (!generatedCode) {
      throw new Error('Failed to generate component code from OpenAI');
    }

    return generatedCode;
  }
}
