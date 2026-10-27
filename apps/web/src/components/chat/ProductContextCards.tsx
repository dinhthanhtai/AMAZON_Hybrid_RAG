import React from 'react'
import type { RAGUsedContext } from '../../types/chat'
import { ExternalLink, Layers } from 'lucide-react'

interface ProductContextCardsProps {
  contexts?: RAGUsedContext[]
}

export const ProductContextCards: React.FC<ProductContextCardsProps> = ({ contexts }) => {
  if (!contexts || contexts.length === 0) return null

  return (
    <div className="mt-4 pt-3 border-t border-[var(--color-rule)]">
      <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] mb-2.5">
        <Layers className="w-3.5 h-3.5 text-[var(--color-accent)]" />
        <span>Referenced inventory ({contexts.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {contexts.map((item, idx) => (
          <div
            key={item.id || idx}
            className="cut-panel flex flex-col justify-between p-2.5 transition-colors hover:bg-[var(--color-paper-3)]"
          >
            <div className="flex gap-2.5 items-start">
              {item.image_url ? (
                <div className="h-16 w-16 shrink-0 border border-[var(--color-rule)] bg-[var(--color-paper)] p-1 flex items-center justify-center rounded-[var(--radius-input)]">
                  <img
                    src={item.image_url}
                    alt={item.description || 'Product item'}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                </div>
              ) : (
                <div className="h-16 w-16 shrink-0 border border-[var(--color-rule)] bg-[var(--color-paper-3)] flex items-center justify-center text-[var(--color-muted)] font-outlier text-xs rounded-[var(--radius-input)]">
                  NO-IMG
                </div>
              )}

              <div className="min-w-0 flex-1">
                {item.id && (
                  <div className="font-outlier text-[11px] text-[var(--color-accent)] truncate font-medium">
                    asin: {item.id}
                  </div>
                )}
                <p className="mt-0.5 text-xs text-[var(--color-ink)] line-clamp-2 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-[var(--color-rule)] pt-2 text-xs">
              {item.price !== undefined && item.price !== null ? (
                <div className="font-outlier font-semibold text-[var(--color-ink)]">
                  ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                </div>
              ) : (
                <span className="text-[11px] text-[var(--color-muted)]">Unlisted</span>
              )}

              <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                <span>View item</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
