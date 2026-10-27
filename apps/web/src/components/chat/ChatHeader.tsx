import React from 'react'
import { Terminal, Trash2, Cpu } from 'lucide-react'

interface ChatHeaderProps {
  onClear: () => void
  messageCount: number
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClear, messageCount }) => {
  return (
    <header className="sticky top-0 z-20 flex h-14 sm:h-16 items-center justify-between border-b border-[var(--color-rule)] bg-[var(--color-paper)] px-3 sm:px-6 select-none shadow-[var(--shadow-card)]">
      {/* Left title block */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center border border-[var(--color-rule-2)] bg-[var(--color-key-face)] text-[var(--color-accent)] shadow-[var(--shadow-key)]">
          <Terminal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-display text-xs sm:text-sm font-semibold tracking-tight text-[var(--color-ink)] whitespace-nowrap">
              AMAZON HYBRID RAG
            </span>
            <span className="hidden xs:inline-block font-outlier text-[10px] sm:text-[11px] text-[var(--color-muted)] border-l border-[var(--color-rule)] pl-1.5">
              ledger-01
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-outlier text-[10px] sm:text-[11px] text-[var(--color-muted)] whitespace-nowrap">
            <span className="flex items-center gap-1 text-[var(--color-ink-2)]">
              <span className="h-1.5 w-1.5 shrink-0 bg-[var(--color-accent)] motion-safe:animate-pulse motion-reduce:animate-none"></span>
              <span>FastAPI :8000</span>
            </span>
            <span className="text-[var(--color-rule)]">/</span>
            <span className="truncate">Qdrant Mesh</span>
          </div>
        </div>
      </div>

      {/* Right telemetry and action block */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div className="flex items-center gap-1 sm:gap-1.5 border border-[var(--color-rule-2)] bg-[var(--color-key-face)] px-2 py-0.5 sm:py-1 font-outlier text-[10px] text-[var(--color-ink-2)] shadow-[var(--shadow-key)]">
          <Cpu className="h-3 w-3 text-[var(--color-accent)]" />
          <span className="hidden sm:inline">STATE:</span>
          <span>READY</span>
        </div>

        {messageCount > 1 && (
          <button
            type="button"
            onClick={onClear}
            className="keycap-btn flex h-7 sm:h-auto items-center justify-center gap-1.5 px-2 sm:px-3 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
            title="Clear drawing sheet"
            aria-label="Clear drawing sheet"
          >
            <Trash2 className="h-3 w-3 text-[var(--color-muted)]" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
    </header>
  )
}
