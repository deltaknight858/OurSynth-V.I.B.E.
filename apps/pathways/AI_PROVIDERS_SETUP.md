# AI Provider Configuration

This application supports multiple AI providers for component generation:

## OpenAI Setup

1. Create an account at https://platform.openai.com/
2. Generate an API key in your account settings
3. Add to your `.env.local`:

```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Available Models:**
- `gpt-3.5-turbo` (Default, most cost-effective)
- `gpt-4` (Requires paid account)
- `gpt-4-turbo` (Latest and most capable)

## Vertex AI (Google Cloud) Setup

1. Create a Google Cloud Project at https://console.cloud.google.com/
2. Enable the Vertex AI API
3. Create a service account with Vertex AI permissions
4. Download the service account JSON key
5. Add to your `.env.local`:

```
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
# Either provide the path to your service account key:
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
# Or paste the entire JSON content:
GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY={"type": "service_account", ...}
```

**Available Models:**
- `gemini-1.5-flash` (Default, fast and efficient)
- `gemini-1.5-pro` (Most capable)
- `gemini-1.0-pro` (Stable version)

## Environment Variables Template

Copy this to your `.env.local` file:

```bash
# Next.js
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://svjbirtueljnfsouhpoj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2amJpcnR1ZWxqbmZzb3VocG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyODQ3MzEsImV4cCI6MjA1MTg2MDczMX0.GgFuglKevYz8tSDU8FKlbDR7_r2iDn4Vvjk4V0KfVyo

# AI Providers
## OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

## Vertex AI (Google Cloud)
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
# OR
GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY={"type": "service_account", "project_id": "..."}
```

## Usage

1. Select your preferred AI provider from the dropdown
2. Choose a model (or use the default)
3. Enter your component description
4. Click "Generate" to create your component

The system will automatically fallback to other providers if your primary choice is unavailable.

## Credits and Billing

- **OpenAI**: Pay-per-use pricing, free tier available
- **Vertex AI**: Google Cloud credits, free tier available
- Both providers offer generous free tiers for development

## Troubleshooting

### Provider Not Configured
- Check that all required environment variables are set
- Restart your development server after adding new variables
- Verify your API keys are valid and have the necessary permissions

### Quota Exceeded
- Switch to an alternative provider
- Check your billing and usage limits
- Consider upgrading your plan if needed

### Model Not Available
- Some models require paid accounts (like GPT-4)
- Try switching to a different model in the same provider
- Use the default models for reliable access
