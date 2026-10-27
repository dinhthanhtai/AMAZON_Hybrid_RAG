import React, { useEffect } from 'react'
import { useChatBot } from '../../hooks/useChatBot'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { ChatHeader } from './ChatHeader'
import { MessageItem } from './MessageItem'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'
import { ScrollToBottomBtn } from './ScrollToBottomBtn'
import { ChevronRight } from 'lucide-react'

const SUGGESTED_QUERIES = [
  'Noise-canceling headphones with low latency',
  'Waterproof trail running footwear with vibram sole',
  'Mechanical keyboard with tactile silent switches',
  'Ergonomic lumbar support task chair under 200 USD',
]

export const ChatContainer: React.FC = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    stopGeneration,
    clearMessages,
  } = useChatBot()

  const { containerRef, isAtBottom, scrollToBottom } = useAutoScroll<HTMLDivElement>()

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom(true)
    }
  }, [messages, isAtBottom, scrollToBottom])

  const lastMessage = messages[messages.length - 1]
  const isWaitingFirstToken =
    isLoading && lastMessage?.role === 'assistant' && !lastMessage.content

  return (
    <div className="flex h-screen w-full flex-col bg-[var(--color-paper)] text-[var(--color-ink)] overflow-hidden">
      {/* Cobalt Header */}
      <ChatHeader onClear={clearMessages} messageCount={messages.length} />

      {/* Main Ledger Sheet */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-y-auto overflow-x-hidden py-4 scroll-smooth"
      >
        <div className="mx-auto max-w-4xl space-y-3 pb-8">
          {messages.map((message) => {
            if (message.role === 'assistant' && !message.content && message.isStreaming) {
              return null
            }
            return <MessageItem key={message.id} message={message} />
          })}

          {/* Typing Indicator */}
          {isWaitingFirstToken && <TypingIndicator />}

          {/* Prompt Specification Suggestions */}
          {messages.length === 1 && (
            <div className="mx-4 mt-6 sm:mx-6 cut-panel p-4">
              <div className="flex items-center justify-between border-b border-[var(--color-rule)] pb-2 mb-3">
                <span className="text-xs font-semibold text-[var(--color-ink)]">
                  Standard queries: selection register
                </span>
                <span className="font-outlier text-[11px] text-[var(--color-muted)]">
                  4 presets
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_QUERIES.map((prompt, idx) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="keycap-btn flex items-center justify-between gap-2 p-2.5 text-left text-xs text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-outlier text-[11px] text-[var(--color-accent)] font-semibold">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="truncate">{prompt}</span>
                    </div>
                    <ChevronRight className="h-3 w-3 shrink-0 text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scroll To Bottom Button */}
        <ScrollToBottomBtn visible={!isAtBottom} onClick={() => scrollToBottom(true)} />
      </div>

      {/* Input Dock */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={() => sendMessage()}
        onStop={stopGeneration}
        isLoading={isLoading}
      />
    </div>
  )
}
