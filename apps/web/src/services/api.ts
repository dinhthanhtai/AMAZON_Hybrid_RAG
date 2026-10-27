import type { RAGResponsePayload } from '../types/chat'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export interface SendQueryOptions {
  query: string
  sessionId?: string
  signal?: AbortSignal
  onToken?: (token: string) => void
}

/**
 * Sends user query to the RAG backend (/agent/ or /rag/)
 * Supports progressive token delivery for responsive UI feedback.
 */
export async function sendRAGQuery({
  query,
  sessionId,
  signal,
  onToken,
}: SendQueryOptions): Promise<RAGResponsePayload> {
  // First try /agent/ endpoint, fallback to /rag/ if not found
  const endpoints = [`${API_BASE_URL}/agent/`, `${API_BASE_URL}/rag/`]
  let response: Response | null = null

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          ...(sessionId ? { session_id: sessionId } : {}),
        }),
        signal,
      })

      if (res.status === 404) {
        // Try next endpoint
        continue
      }

      response = res
      break
    } catch (err) {
      if (signal?.aborted) throw err
      // If network error, continue to next endpoint
    }
  }

  if (!response) {
    throw new Error('Could not connect to backend endpoint (/agent/ or /rag/). Make sure the API server is running.')
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(
      `Backend error (${response.status}): ${errorText || response.statusText || 'Failed to fetch'}`
    )
  }

  const contentType = response.headers.get('content-type') || ''

  // If backend returns streaming SSE or text stream
  if (contentType.includes('text/event-stream') && response.body) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      fullText += chunk
      onToken?.(fullText)
    }

    return {
      answer: fullText,
      request_id: crypto.randomUUID(),
      used_contexts: [],
    }
  }

  // Backend returned JSON (RAGResponse)
  const data: RAGResponsePayload = await response.json()

  // Normalize used_contexts vs used_context
  const contexts = data.used_contexts || data.used_context || []
  data.used_contexts = contexts

  // Progressive token streaming simulation for ultra-responsive feel
  if (onToken && data.answer) {
    const words = data.answer.split(/(\s+)/)
    let accumulated = ''

    // Stream in small word batches with micro-delays
    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) break
      accumulated += words[i]
      onToken(accumulated)

      if (i % 2 === 0) {
        await new Promise((r) => setTimeout(r, 12))
      }
    }
  }

  return data
}
