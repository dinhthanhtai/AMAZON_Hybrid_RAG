export interface RAGUsedContext {
  id?: string
  description: string
  image_url?: string
  price?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
  usedContexts?: RAGUsedContext[]
  requestId?: string
  isStreaming?: boolean
}

export interface RAGResponsePayload {
  answer: string
  request_id?: string
  session_id?: string
  used_contexts?: RAGUsedContext[]
  used_context?: RAGUsedContext[]
}
