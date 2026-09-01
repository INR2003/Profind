import OpenAI from 'openai';
import 'dotenv/config';

// Determine provider (Groq or OpenAI)
const isGroq = Boolean(process.env.GROQ_API_KEY);
const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || '';
const baseURL = isGroq ? 'https://api.groq.com/openai/v1' : undefined;
const defaultModel = isGroq
  ? (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile')
  : (process.env.OPENAI_MODEL || 'gpt-4o-mini');

const client = new OpenAI({
  apiKey,
  baseURL,
});

const server = Bun.serve({
  hostname: '0.0.0.0',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  async fetch(req) {
    const url = new URL(req.url);

    // CORS headers for local dev
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (url.pathname === '/api/chat' && req.method === 'POST') {
      try {
        const body = (await req.json()) as { message?: string; stream?: boolean };
        const message = body?.message?.trim();

        if (!message) {
          return Response.json(
            { error: 'Message cannot be empty.' },
            { status: 400, headers }
          );
        }

        if (!apiKey) {
          return Response.json(
            {
              error:
                'API key is not configured. Please set GROQ_API_KEY (free at console.groq.com) or OPENAI_API_KEY in your .env file.',
            },
            { status: 500, headers }
          );
        }

        const model = isGroq
          ? (process.env.GROQ_MODEL || defaultModel)
          : (process.env.OPENAI_MODEL || defaultModel);

        const completion = await client.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a fast, concise, and helpful search assistant.',
            },
            { role: 'user', content: message },
          ],
        });

        const answer =
          completion.choices[0]?.message?.content || 'No response received from AI.';

        return Response.json(
          {
            answer,
            provider: isGroq ? 'Groq (Free)' : 'OpenAI',
            model,
          },
          { headers }
        );
      } catch (err: any) {
        console.error(`${isGroq ? 'Groq' : 'OpenAI'} Error:`, err?.message || err);

        let errorMessage = err?.message || 'Something went wrong.';

        if (err?.status === 429 || err?.message?.includes('429')) {
          errorMessage = isGroq
            ? 'Groq Rate Limit Exceeded (429): Please wait a moment and try again.'
            : 'OpenAI Account Quota Exceeded (429): No credits remaining. Consider switching to GROQ_API_KEY in .env for free usage!';
        } else if (err?.status === 401 || err?.message?.includes('401')) {
          errorMessage = `Invalid API Key (401): Please verify your ${isGroq ? 'GROQ_API_KEY' : 'OPENAI_API_KEY'} in .env.`;
        }

        return Response.json(
          { error: errorMessage },
          { status: err?.status || 500, headers }
        );
      }
    }

    return Response.json({ error: 'Not Found' }, { status: 404, headers });
  },
});

console.log(`Backend API server running at http://localhost:${server.port} [Provider: ${isGroq ? 'Groq (Free)' : 'OpenAI'}]`);

