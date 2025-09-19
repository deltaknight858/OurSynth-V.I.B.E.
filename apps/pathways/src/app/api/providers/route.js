import { NextResponse } from 'next/server';
import { AIProviderFactory } from '../../../lib/ai-providers';

export async function GET() {
  try {
    const configs = AIProviderFactory.getAllConfigs();
    const status = {};
    
    // Check each provider's configuration status
    for (const config of configs) {
      status[config.type] = AIProviderFactory.isProviderConfigured(config.type);
    }

    return NextResponse.json({
      providers: configs,
      status,
    });
  } catch (error) {
    console.error('Error fetching provider configs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provider configurations' },
      { status: 500 }
    );
  }
}
