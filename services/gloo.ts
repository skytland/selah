/**
 * Gloo AI Completions V2 — tradition-aware evangelical reflections.
 * Docs: https://docs.gloo.com/api-guides/completions-v2
 *
 * Authentication: OAuth2 client_credentials flow.
 * The access token is cached in-memory with expiry tracking.
 */

const GLOO_CLIENT_ID = process.env.EXPO_PUBLIC_GLOO_CLIENT_ID ?? '';
const GLOO_CLIENT_SECRET = process.env.EXPO_PUBLIC_GLOO_CLIENT_SECRET ?? '';
const TOKEN_URL = 'https://platform.ai.gloo.com/oauth2/token';
const COMPLETIONS_URL = 'https://platform.ai.gloo.com/ai/v2/completions';

interface TokenCache {
  token: string;
  expiresAt: number; // ms timestamp
}

let tokenCache: TokenCache | null = null;

/** Fetches a fresh OAuth2 Bearer token or returns the cached one. */
async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 30_000) {
    return tokenCache.token;
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: GLOO_CLIENT_ID,
    client_secret: GLOO_CLIENT_SECRET,
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gloo token exchange failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const expiresIn: number = data.expires_in ?? 3600;

  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };

  return tokenCache.token;
}

/** Clears the cached token — useful after a 401. */
export function clearGlooToken(): void {
  tokenCache = null;
}

const SYSTEM_PROMPT =
  'You are a warm, faithful Bible teacher. Given a Bible verse, write EXACTLY ' +
  '2 sentences: the first explaining the meaning of this passage in its original ' +
  'context, the second offering one practical truth for the reader today. ' +
  'Be concise and direct. No greetings. No headers. No bullet points. Plain ' +
  'sentences only. Do not exceed 2 sentences under any circumstances.';

/**
 * Streams a 2-sentence evangelical reflection from Gloo AI.
 *
 * @param reference  Human-readable reference, e.g. "Psalm 46:10"
 * @param text       Full verse text
 * @param onChunk    Called with each text chunk as it streams in
 * @returns          The complete reflection string
 */
export async function getReflection(
  reference: string,
  text: string,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  let token: string;
  try {
    token = await getAccessToken();
  } catch (error) {
    console.warn('[Gloo] Token exchange failed:', error);
    return getFallbackReflection(reference);
  }

  const body = JSON.stringify({
    auto_routing: true,
    tradition: 'evangelical',
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `${reference} — "${text}"` },
    ],
  });

  try {
    const res = await fetch(COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body,
    });

    if (res.status === 401) {
      clearGlooToken();
      throw new Error('Gloo token expired — retry');
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gloo completions error (${res.status}): ${errText}`);
    }

    return await parseSSEStream(res, onChunk);
  } catch (error) {
    console.warn('[Gloo] Completions request failed:', error);
    return getFallbackReflection(reference);
  }
}

/**
 * Parses a Server-Sent Events (SSE) stream from Gloo and
 * accumulates text content. Calls onChunk with each delta.
 */
async function parseSSEStream(
  response: Response,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder('utf-8');
  let accumulated = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') continue;

      try {
        const json = JSON.parse(payload);
        // OpenAI-compatible delta format
        const delta: string =
          json?.choices?.[0]?.delta?.content ??
          json?.delta?.text ??
          json?.content ??
          '';
        if (delta) {
          accumulated += delta;
          onChunk?.(delta);
        }
      } catch {
        // Non-JSON line — skip
      }
    }
  }

  return accumulated.trim();
}

/** Fallback reflections for offline / API-error scenarios. */
function getFallbackReflection(reference: string): string {
  return (
    `This passage from ${reference} reveals a foundational truth about God's character ` +
    `and His relationship with those who trust in Him. ` +
    `Take a moment today to pause on these words and let them shape how you approach ` +
    `your circumstances.`
  );
}
