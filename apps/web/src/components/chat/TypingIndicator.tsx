import React from 'react'
import { Terminal } from 'lucide-react'

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 py-3 px-4 sm:px-6">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--color-rule-2)] bg-[var(--color-key-face)] text-[var(--color-accent)] shadow-[var(--shadow-key)]">
        <Terminal className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-2 border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3 py-2 text-[var(--color-ink)] rounded-[var(--radius-input)] shadow-[var(--shadow-card)]">
        <span className="font-outlier text-xs text-[var(--color-muted)]">computing vector graph</span>
        <span className="inline-block h-1.5 w-1.5 bg-[var(--color-accent)] motion-safe:animate-pulse motion-reduce:animate-none"></span>
        <span className="inline-block h-1.5 w-1.5 bg-[var(--color-accent)] motion-safe:animate-pulse motion-reduce:animate-none [animation-delay:200ms]"></span>
        <span className="inline-block h-1.5 w-1.5 bg-[var(--color-accent)] motion-safe:animate-pulse motion-reduce:animate-none [animation-delay:400ms]"></span>
      </div>
    </div>
  )
}
