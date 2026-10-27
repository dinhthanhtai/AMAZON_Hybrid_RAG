import React from 'react'
import { ArrowDown } from 'lucide-react'

interface ScrollToBottomBtnProps {
  visible: boolean
  onClick: () => void
}

export const ScrollToBottomBtn: React.FC<ScrollToBottomBtnProps> = ({ visible, onClick }) => {
  if (!visible) return null

  return (
    <button
      onClick={onClick}
      type="button"
      className="keycap-btn absolute bottom-4 right-6 z-10 flex items-center gap-1.5 px-3 py-1.5 font-outlier text-xs text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
      aria-label="Scroll to newest entries"
    >
      <ArrowDown className="h-3 w-3 text-[var(--color-accent)]" />
      <span>New entries</span>
    </button>
  )
}
