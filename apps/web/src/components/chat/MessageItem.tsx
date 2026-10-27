import React, { useState } from 'react'
import type { ChatMessage } from '../../types/chat'
import { MessageContent } from './MessageContent'
import { ProductContextCards } from './ProductContextCards'
import { Check, Copy } from 'lucide-react'

interface MessageItemProps {
  message: ChatMessage
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date)
  }

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-2 sm:px-6">
        <div className="flex max-w-[85%] sm:max-w-[75%] flex-col items-end">
          <div className="border border-[var(--color-accent-2)] bg-[var(--color-accent-wash)] px-4 py-3 text-[var(--color-ink)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
            <div className="mb-1.5 flex items-center justify-between gap-4 border-b border-[var(--color-accent-2)] pb-1 font-outlier text-[11px] text-[var(--color-muted)]">
              <span className="text-[var(--color-accent)] font-medium">query // user</span>
              <span>{formatTime(message.createdAt)}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 px-4 py-2 sm:px-6">
      <div className="flex-1 min-w-0">
        <div className="cut-panel p-4">
          <div className="mb-2 flex items-center justify-between border-b border-[var(--color-rule)] pb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[var(--color-ink)]">
                Specification response
              </span>
              {message.requestId && (
                <span className="text-[11px] text-[var(--color-muted)]">
                  req: <span className="font-outlier">{message.requestId.slice(0, 8)}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="keycap-btn flex items-center gap-1 px-2 py-0.5 text-[11px] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                title="Copy specification output"
              >
                {copied ? (
                  <>
                    <Check className="h-2.5 w-2.5 text-[var(--color-accent)]" />
                    <span className="text-[var(--color-accent)]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-2.5 w-2.5 text-[var(--color-muted)]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <span className="font-outlier text-[11px] text-[var(--color-muted)]">
                {formatTime(message.createdAt)}
              </span>
            </div>
          </div>

          <MessageContent content={message.content} />

          {/* Render product context references */}
          {message.usedContexts && message.usedContexts.length > 0 && (
            <ProductContextCards contexts={message.usedContexts} />
          )}
        </div>
      </div>
    </div>
  )
}
