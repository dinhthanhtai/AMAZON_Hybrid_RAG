import { useState, useRef, useCallback } from 'react'
import type { ChatMessage } from '../types/chat'
import { sendRAGQuery } from '../services/api'

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `Hello! I'm your **Amazon Shopping & Product Assistant** powered by **Hybrid RAG** (Dense Vectors + BM25 Sparse Search).

Ask me anything about products, for example:
- *"Can you recommend lightweight wireless noise-canceling headphones?"*
- *"Find waterproof hiking boots with good arch support under $100"*
- *"What are the best ergonomic mechanical keyboards for coding?"*`,
  createdAt: new Date(),
}

export function useChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
  }, [])

  const clearMessages = useCallback(() => {
    stopGeneration()
    setMessages([INITIAL_MESSAGE])
    setSessionId(null)
    setError(null)
  }, [stopGeneration])

  const sendMessage = useCallback(
    async (textOverride?: string) => {
      const query = (textOverride || input).trim()
      if (!query || isLoading) return

      setError(null)
      setInput('')

      const userMessageId = `user-${Date.now()}`
      const botMessageId = `bot-${Date.now()}`

      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content: query,
        createdAt: new Date(),
      }

      // Add user message and empty bot placeholder
      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          id: botMessageId,
          role: 'assistant',
          content: '',
          createdAt: new Date(),
          isStreaming: true,
        },
      ])

      setIsLoading(true)

      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        const response = await sendRAGQuery({
          query,
          sessionId: sessionId || undefined,
          signal: controller.signal,
          onToken: (partialText) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessageId
                  ? { ...msg, content: partialText }
                  : msg
              )
            )
          },
        })

        if (response.session_id) {
          setSessionId(response.session_id)
        }

        // Finalize message with complete contexts & requestId
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  content: response.answer || msg.content,
                  usedContexts: response.used_contexts,
                  requestId: response.request_id,
                  isStreaming: false,
                }
              : msg
          )
        )
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          // Handled gracefully on abort
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, content: msg.content + '\n\n*(Generation stopped)*', isStreaming: false }
                : msg
            )
          )
        } else {
          const errorMessage =
            err instanceof Error ? err.message : 'Unknown communication error'
          setError(errorMessage)

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? {
                    ...msg,
                    content: `⚠️ **Unable to connect to the FastAPI backend**: ${errorMessage}\n\nMake sure your FastAPI server is running with:\n\`\`\`bash\nuv run uvicorn api.main:app --reload --port 8000\n\`\`\``,
                    isStreaming: false,
                  }
                : msg
            )
          )
        }
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [input, isLoading]
  )

  return {
    messages,
    sessionId,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
  }
}
