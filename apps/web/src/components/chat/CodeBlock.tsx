import React, { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Check, Copy } from 'lucide-react'

interface CodeBlockProps {
  language: string
  code: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const cleanLang = (language || 'text').toLowerCase().replace('language-', '')

  return (
    <div className="my-3 graphite-code rounded-[var(--radius-input)] overflow-hidden shadow-[var(--shadow-card)]">
      {/* Cobalt Graphite Header bar */}
      <div className="flex items-center justify-between border-b border-[var(--color-graphite-2)] bg-[var(--color-graphite-2)] px-3 py-1.5 text-xs text-[var(--color-graphite-muted)]">
        <span className="font-outlier text-[11px] text-[var(--color-graphite-ink)]">
          {cleanLang}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 border border-[var(--color-graphite-muted)] px-2 py-0.5 text-xs text-[var(--color-graphite-ink)] transition-colors hover:bg-[var(--color-graphite)] active:bg-[var(--color-graphite-2)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-[var(--radius-input)]"
          title="Copy specification"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-[var(--color-accent-2)]" />
              <span className="text-[var(--color-accent-2)]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-[var(--color-graphite-ink)]" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Highlighted code */}
      <Highlight theme={themes.nightOwl} code={code.trim()} language={cleanLang}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            style={style}
            className={`${className} overflow-x-auto p-3 text-xs font-outlier leading-relaxed bg-transparent`}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="mr-3 select-none inline-block w-4 text-right text-[var(--color-graphite-muted)] text-[11px]">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
