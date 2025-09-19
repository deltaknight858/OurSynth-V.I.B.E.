import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Type guards for OpenAI error handling
interface OpenAIError {
  error?: {
    type?: string;
    message?: string;
  };
}

interface NetworkError {
  code?: string;
  message?: string;
}

function isOpenAIError(error: unknown): error is OpenAIError {
  return typeof error === 'object' && 
         error !== null && 
         'error' in error && 
         typeof (error as OpenAIError).error === 'object' && 
         (error as OpenAIError).error !== null;
}

function isNetworkError(error: unknown): error is NetworkError {
  return typeof error === 'object' && 
         error !== null && 
         'code' in error;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { prompt, framework } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!framework) {
      return NextResponse.json(
        { error: 'Framework is required' },
        { status: 400 }
      );
    }

    // Validate prompt length
    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt is too long. Maximum 1000 characters allowed.' },
        { status: 400 }
      );
    }

    // System prompt for React component generation
    const systemPrompt = `You are an expert React component generator. Generate clean, modern, and functional React components based on user prompts.

Guidelines:
- Use TypeScript with proper type definitions
- Use functional components with hooks
- Follow the specified framework conventions
- Include proper Material-UI styling when UI components are requested
- Add meaningful prop interfaces
- Include proper imports
- Make components reusable and well-structured
- Add brief JSDoc comments for complex components
- Use modern React patterns (no class components)
- Ensure accessibility when applicable
- Return only the component code, no explanations
- Use glass morphism design patterns when styling is needed
- Include responsive design considerations

The component should be production-ready and follow React best practices.`;

    // Create user content with framework specification
    const userContent = `Framework: ${framework}\nPrompt: ${prompt}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userContent,
        },
      ],
      max_tokens: 2500,
      temperature: 0.7,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    // Extract generated code
    const generatedCode = completion.choices[0]?.message?.content;

    if (!generatedCode) {
      console.error('No content generated from OpenAI');
      return NextResponse.json(
        { error: 'Failed to generate component code' },
        { status: 500 }
      );
    }

    // Log successful generation (for debugging)
    console.log(`Successfully generated component for framework: ${framework}`);

    // Return the generated code
    return NextResponse.json({
      code: generatedCode,
      framework,
      prompt,
      timestamp: new Date().toISOString(),
    });

  } catch (error: unknown) {
    console.error('Error in generate endpoint:', error);

    // Handle specific OpenAI errors
    if (isOpenAIError(error) && error.error?.type === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI API quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (isOpenAIError(error) && error.error?.type === 'invalid_request_error') {
      return NextResponse.json(
        { error: 'Invalid request to OpenAI API. Please check your prompt.' },
        { status: 400 }
      );
    }

    if (isNetworkError(error) && (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Unable to connect to OpenAI API. Please check your internet connection.' },
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'An unexpected error occurred while generating the component.' },
      { status: 500 }
    );
  }
}

// Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate components.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate components.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate components.' },
    { status: 405 }
  );
}
