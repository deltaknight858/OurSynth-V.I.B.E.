import { NextResponse } from 'next/server';
import { AIProviderFactory } from '../../../lib/ai-providers';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, provider = 'openai', model } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Validate provider type
    const validProviders = AIProviderFactory.getAvailableProviders();
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: `Invalid provider. Must be one of: ${validProviders.join(', ')}` },
        { status: 400 }
      );
    }

    // Get the AI provider
    const aiProvider = AIProviderFactory.getProvider(provider);
    
    // Check if provider is configured
    if (!aiProvider.isConfigured()) {
      const config = AIProviderFactory.getConfig(provider);
      return NextResponse.json(
        { 
          error: `${aiProvider.name} is not configured. Required: ${config.requiresCredentials.join(', ')}`,
          provider: aiProvider.name,
          configRequired: config.requiresCredentials
        },
        { status: 500 }
      );
    }

    // Generate component using the selected provider
    const generatedCode = await aiProvider.generateComponent(prompt, {
      model: model || AIProviderFactory.getConfig(provider).defaultModel,
      temperature: 0.8,
      maxTokens: 3000,
    });

    return NextResponse.json({
      code: generatedCode,
      framework: 'React',
      prompt: prompt,
      provider: aiProvider.name,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error:', error);
    
    if (error?.error?.type === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI API quota exceeded. Please try again later or switch to Vertex AI.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        error: error.message || 'Server error occurred while generating component',
        details: error.stack 
      },
      { status: 500 }
    );
  }
}
