import React, { useRef, useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { CornerDownLeft, Square } from 'lucide-react'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSend: () => void
  onStop: () => void
  isLoading: boolean
  placeholder?: string
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isLoading,
  placeholder = 'Ask about products...',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus()
    }
  }, [isLoading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && input.trim()) {
        onSend()
      }
    }
  }

  return (
    <div className="relative border-t border-[var(--color-rule)] bg-[var(--color-paper)] px-4 py-3 sm:px-6 shadow-[var(--shadow-card)]">
      <div className="mx-auto max-w-4xl">
        <div className="group relative flex items-end border border-[var(--color-rule-2)] bg-[var(--color-paper-2)] rounded-[var(--radius-input)] focus-within:border-[var(--color-muted)] transition-colors shadow-[var(--shadow-card)]">
          <div className="pl-3.5 pb-3 font-outlier text-xs text-[var(--color-muted)] group-focus-within:text-[var(--color-accent)] transition-colors select-none font-semibold">
            &gt;
          </div>

          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxRows={6}
            minRows={1}
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent py-3 px-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none focus:outline-none disabled:opacity-50 leading-relaxed caret-[var(--color-accent)]"
          />

          <div className="flex items-center gap-1.5 pr-2.5 pb-2">
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="keycap-btn flex h-9 w-9 items-center justify-center text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                title="Halt generation"
              >
                <Square className="h-3.5 w-3.5 fill-current text-[var(--color-accent)]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSend}
                disabled={!input.trim()}
                className="keycap-btn keycap-primary flex h-9 items-center gap-1.5 px-3.5 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                title="Execute query"
              >
                <span>Send</span>
                <CornerDownLeft className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between px-0.5 font-outlier text-[11px] text-[var(--color-muted)]">
          <span>
            Enter to execute · Shift+Enter for newline
          </span>
          <span className="hidden sm:inline">dense + sparse bm25</span>
        </div>
      </div>
    </div>
  )
}
