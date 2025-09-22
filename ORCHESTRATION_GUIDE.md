OurSynth Orchestration Master Guide
=================================

1. Secrets You’ve Set Up (GitHub → Settings → Secrets → Actions)
---------------------------------------------------------------

From your repository's Actions secrets page, set the following (placeholders shown):

- `GOOGLE_APPLICATION_CREDENTIALS_JSON` — full service account JSON for Vertex AI (store as one secret)
- `GOOGLE_PROJECT_ID` — e.g. synth-449607
- `HF_API_TOKEN` — Hugging Face token
- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_ANON_KEY` — anon key (safe for client use)
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-side only)
- `VERTEXAI_API_KEY` — optional fallback if you prefer API-key auth

> Note: keep secrets out of version control. Use `GOOGLE_APPLICATION_CREDENTIALS_JSON` for CI and reconstruct the JSON at runtime (see workflow snippet below).

---

2. Local .env Template
-----------------------

Copy this into a local `.env` or `.env.local` (placeholders only — do NOT commit real secrets):

```bash
# Hugging Face
HF_API_TOKEN=hf_xxxxx

# Google / Vertex AI
GOOGLE_PROJECT_ID=synth-449607
GOOGLE_APPLICATION_CREDENTIALS=./keys/vertex-ai.json

# Optional fallback (not recommended for production)
VERTEXAI_API_KEY=your_vertex_api_key_here

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Claude (Anthropic)
ANTHROPIC_API_KEY=sk-ant-xxxxxx

# Azure OpenAI (placeholder)
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_KEY=xxxxxx

# OpenAI (placeholder)
OPENAI_API_KEY=sk-xxxxxx
```

---

3. GitHub Actions: writing Google credentials at runtime
------------------------------------------------------

Use this step in a workflow to reconstruct the service account JSON at runtime and set `GOOGLE_APPLICATION_CREDENTIALS` for later steps.

```yaml
- name: Write Google credentials
  env:
    GOOGLE_APPLICATION_CREDENTIALS_JSON: ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS_JSON }}
  run: |
    echo "$GOOGLE_APPLICATION_CREDENTIALS_JSON" > "$HOME/gcloud-key.json"
    echo "GOOGLE_APPLICATION_CREDENTIALS=$HOME/gcloud-key.json" >> $GITHUB_ENV
```

This writes the JSON to `$HOME/gcloud-key.json` and exposes the file path in the job via `GITHUB_ENV` so Google SDKs/CLIs can pick it up.

---

4. Orchestrator Code (Node/TypeScript)
--------------------------------------

Minimal orchestrator strategy (balanced cost/quality). This is an illustrative example — adapt to your SDKs, authentication, and error handling.

```ts
import fetch from 'node-fetch'

type Provider = 'huggingface' | 'vertex' | 'claude' | 'azure' | 'openai'

interface OrchestratorOptions {
  prompt: string
  priority?: 'cost' | 'quality' | 'balanced'
  task?: 'text' | 'multimodal'
}

export async function orchestrate({ prompt, priority = 'balanced', task = 'text' }: OrchestratorOptions) {
  try {
    if (priority === 'cost') {
      return await callHuggingFace(prompt).catch(() => callClaude(prompt))
    }
    if (priority === 'quality') {
      return await callClaude(prompt).catch(() => callVertex(prompt))
    }
    if (task === 'multimodal') {
      return await callVertex(prompt).catch(() => callAzure(prompt))
    }

    // Balanced default
    if (prompt.length < 500) {
      return await callHuggingFace(prompt).catch(() => callClaude(prompt))
    }
    return await callClaude(prompt).catch(() => callVertex(prompt))
  } catch (err) {
    return '⚠️ All providers failed.'
  }
}

// === Hugging Face ===
async function callHuggingFace(prompt: string) {
  const resp = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ inputs: prompt })
  })
  const data = await resp.json()
  return data[0]?.generated_text || JSON.stringify(data)
}

// === Vertex AI (Gemini) ===
async function callVertex(prompt: string) {
  const resp = await fetch(`https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VERTEXAI_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
  })
  const data = await resp.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data)
}

// === Claude (Anthropic) ===
async function callClaude(prompt: string) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  const data = await resp.json()
  return data.content?.[0]?.text || JSON.stringify(data)
}

// === Azure OpenAI (placeholder) ===
async function callAzure(prompt: string) {
  return 'Azure OpenAI integration placeholder'
}

// === OpenAI (placeholder) ===
async function callOpenAI(prompt: string) {
  return 'OpenAI integration placeholder'
}
```

---

5. Monetization ladder
-----------------------

1. Free — Hugging Face (Mistral-7B), capped prompts.
2. Pro — Claude + Vertex (Gemini), multimodal & long context.
3. Enterprise — Azure OpenAI + Vertex IAM, compliance & SLAs.

---

6. Supabase Integration
------------------------

Secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

Install:

```bash
npm install @supabase/supabase-js
```

Init:

```ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
```

Use cases:

- Store users, subscriptions, and prompt logs.
- Handle authentication (email/social login).
- Store files (uploads, images).
- Real-time updates (chat, dashboards).

---

7. Next steps
-------------

- Test Hugging Face with curl.
- Test Vertex AI with curl.
- Confirm Supabase connection with a simple query.
- Run orchestrator locally with a `.env` file.
- Deploy via GitHub Actions (workflow writes JSON back to file).
- Add Claude when funded.
- Add Azure/OpenAI later for enterprise tier.

---

Recommended tiers
-----------------

- Hugging Face — Free tier
- Vertex (Gemini) — Pro tier
- Supabase — backend spine
- Claude — reasoning upgrade (later)
- Azure/OpenAI — enterprise expansion

# OurSynth Orchestration Master Guide

## 1. 🔑 Secrets You’ve Set Up (GitHub → Settings → Secrets → Actions)

From your repository's Actions secrets page, set the following (placeholders shown):

- `GOOGLE_APPLICATION_CREDENTIALS_JSON` — full service account JSON for Vertex AI (store as one secret)
---

# OurSynth Orchestration Master Guide

## 1. 🔑 Secrets You’ve Set Up (GitHub → Settings → Secrets → Actions)

From your repository's Actions secrets page, set the following (placeholders shown):

- `GOOGLE_APPLICATION_CREDENTIALS_JSON` — full service account JSON for Vertex AI (store as one secret)
- `GOOGLE_PROJECT_ID` — e.g. synth-449607
- `HF_API_TOKEN` — Hugging Face token
- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_ANON_KEY` — anon key (safe for client use)
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-side only)
- `VERTEXAI_API_KEY` — optional fallback if you prefer API-key auth

> Note: keep secrets out of version control. Use `GOOGLE_APPLICATION_CREDENTIALS_JSON` for CI and reconstruct the JSON at runtime (see workflow snippet below).

---

## 2. 📦 Local .env Template

Copy this into a local `.env` or `.env.local` (placeholders only — do NOT commit real secrets):

```bash
# Hugging Face
HF_API_TOKEN=hf_xxxxx

# Google / Vertex AI
GOOGLE_PROJECT_ID=synth-449607
GOOGLE_APPLICATION_CREDENTIALS=./keys/vertex-ai.json

# Optional fallback (not recommended for production)
VERTEXAI_API_KEY=your_vertex_api_key_here

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Claude (Anthropic)
ANTHROPIC_API_KEY=sk-ant-xxxxxx

# Azure OpenAI (placeholder)
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_KEY=xxxxxx

# OpenAI (placeholder)
OPENAI_API_KEY=sk-xxxxxx
```

---

## 3. ⚙️ GitHub Actions Workflow Snippet

Use this step in a workflow to reconstruct the service account JSON at runtime and set `GOOGLE_APPLICATION_CREDENTIALS` for later steps:

```yaml
- name: Write Google credentials
  env:
    GOOGLE_APPLICATION_CREDENTIALS_JSON: ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS_JSON }}
  run: |
    echo "$GOOGLE_APPLICATION_CREDENTIALS_JSON" > "$HOME/gcloud-key.json"
    echo "GOOGLE_APPLICATION_CREDENTIALS=$HOME/gcloud-key.json" >> $GITHUB_ENV
```

This writes the JSON to `$HOME/gcloud-key.json` and exposes the file path in the job via `GITHUB_ENV` so Google SDKs/CLIs can pick it up.

---

## 4. 🧠 Orchestrator Code (Node/TypeScript)

Minimal orchestrator strategy (balanced cost/quality). This is an illustrative example — adapt to your SDKs, authentication, and error handling.

```ts
import fetch from 'node-fetch'

type Provider = 'huggingface' | 'vertex' | 'claude' | 'azure' | 'openai'

interface OrchestratorOptions {
  prompt: string
  priority?: 'cost' | 'quality' | 'balanced'
  task?: 'text' | 'multimodal'
}

export async function orchestrate({ prompt, priority = 'balanced', task = 'text' }: OrchestratorOptions) {
  try {
    if (priority === 'cost') {
      return await callHuggingFace(prompt).catch(() => callClaude(prompt))
    }
    if (priority === 'quality') {
      return await callClaude(prompt).catch(() => callVertex(prompt))
    }
    if (task === 'multimodal') {
      return await callVertex(prompt).catch(() => callAzure(prompt))
    }

    // Balanced default
    if (prompt.length < 500) {
      return await callHuggingFace(prompt).catch(() => callClaude(prompt))
    }
    return await callClaude(prompt).catch(() => callVertex(prompt))
  } catch (err) {
    return '⚠️ All providers failed.'
  }
}

// === Hugging Face ===
async function callHuggingFace(prompt: string) {
  const resp = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ inputs: prompt })
  })
  const data = await resp.json()
  return data[0]?.generated_text || JSON.stringify(data)
}

// === Vertex AI (Gemini) ===
async function callVertex(prompt: string) {
  const resp = await fetch(`https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VERTEXAI_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
  })
  const data = await resp.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data)
}

// === Claude (Anthropic) ===
async function callClaude(prompt: string) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  const data = await resp.json()
  return data.content?.[0]?.text || JSON.stringify(data)
}

// === Azure OpenAI (placeholder) ===
async function callAzure(prompt: string) {
  return 'Azure OpenAI integration placeholder'
}

// === OpenAI (placeholder) ===
async function callOpenAI(prompt: string) {
  return 'OpenAI integration placeholder'
}
```

---

## 5. 💰 Monetization Ladder

1. Free → Hugging Face (Mistral-7B), capped prompts.
2. Pro → Claude + Vertex (Gemini), multimodal & long context.
3. Enterprise → Azure OpenAI + Vertex IAM, compliance & SLAs.

---

## 6. 🧩 Supabase Integration

Secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

Install:

```bash
npm install @supabase/supabase-js
```

Init:

```ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
```

Use cases:

- Store users, subscriptions, and prompt logs.
- Handle authentication (email/social login).
- Store files (uploads, images).
- Real-time updates (chat, dashboards).

---

## 7. ✅ Next Steps

- Test Hugging Face with curl.
- Test Vertex AI with curl.
- Confirm Supabase connection with a simple query.
- Run orchestrator locally with a `.env` file.
- Deploy via GitHub Actions (workflow writes JSON back to file).
- Add Claude when funded.
- Add Azure/OpenAI later for enterprise tier.

---

With this setup, recommended tiers:

- Hugging Face → Free tier
- Vertex (Gemini) → Pro tier
- Supabase → backend spine
- Claude → reasoning upgrade (later)
- Azure/OpenAI → enterprise expansion

2. Pro → Claude + Vertex (Gemini), multimodal & long context.
3. Enterprise → Azure OpenAI + Vertex IAM, compliance & SLAs.

---

## 6. 🧩 Supabase Integration

Secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

Install:

```bash
npm install @supabase/supabase-js
```

Init:

```ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
```

Use cases:

- Store users, subscriptions, and prompt logs.
- Handle authentication (email/social login).
- Store files (uploads, images).
- Real-time updates (chat, dashboards).

---

## 7. ✅ Next Steps

- Test Hugging Face with curl.
- Test Vertex AI with curl.
- Confirm Supabase connection with a simple query.
- Run orchestrator locally with a `.env` file.
- Deploy via GitHub Actions (workflow writes JSON back to file).
- Add Claude when funded.
- Add Azure/OpenAI later for enterprise tier.

---

With this setup, recommended tiers:

- Hugging Face → Free tier
- Vertex (Gemini) → Pro tier
- Supabase → backend spine
- Claude → reasoning upgrade (later)
- Azure/OpenAI → enterprise expansion

       max_tokens: 512,
       messages: [{ role: "user", content: prompt }]
     })
   });
   const data = await resp.json();
   return data.content[0].text;
 }

 // === Azure OpenAI (placeholder) ===
 async function callAzure(prompt: string) {
   return "Azure OpenAI integration placeholder";
 }

 // === OpenAI (placeholder) ===
 async function callOpenAI(prompt: string) {
   return "OpenAI integration placeholder";
 }
 ```

 ---

 ## 5. 💰 Monetization Ladder

 1. Free → Hugging Face (Mistral‑7B), capped prompts.
 2. Pro ($15–20/mo) → Claude + Vertex (Gemini), multimodal + long context.
 3. Enterprise (custom) → Azure OpenAI + Vertex IAM, compliance + SLAs.

 ---

 ## 6. 🧩 Supabase Integration

 Secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

 Install:

 ```bash
 npm install @supabase/supabase-js
 ```

 Init:

 ```ts
 import { createClient } from '@supabase/supabase-js'

 const supabase = createClient(
   process.env.SUPABASE_URL!,
   process.env.SUPABASE_ANON_KEY!
 )
 ```

 Use cases:

 - Store users, subscriptions, and prompt logs.
 - Handle authentication (email/social login).
 - Store files (uploads, images).
 - Real‑time updates (chat, dashboards).

 ---

 ## 7. ✅ Next Steps

 - Test Hugging Face with curl.
 - Test Vertex AI with curl.
 - Confirm Supabase connection with a simple query.
 - Run orchestrator locally with .env.
 - Deploy via GitHub Actions (workflow writes JSON back to file).
 - Add Claude when you can fund $5.
 - Add Azure/OpenAI later for enterprise tier.

 ---

 With this setup, OurSynth is the orchestrator:

 - Hugging Face → Free tier.
 - Vertex (Gemini) → Pro tier.
 - Supabase → backend spine.
 - Claude → reasoning upgrade (later).
 - Azure/OpenAI → enterprise expansion.
