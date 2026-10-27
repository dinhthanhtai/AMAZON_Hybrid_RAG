import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ExternalLink } from 'lucide-react'
import { CodeBlock } from './CodeBlock'

interface MessageContentProps {
  content: string
}

export const MessageContent: React.FC<MessageContentProps> = ({ content }) => {
  return (
    <div className="message-prose text-[13.5px] sm:text-[14px] leading-[1.65] text-[var(--color-ink)] break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match && !String(children).includes('\n')

            if (isInline) {
              return (
                <code
                  className="rounded-[4px] border border-[var(--color-rule-2)] bg-[var(--color-paper-3)] px-1.5 py-0.5 font-outlier text-[12px] font-normal text-[var(--color-ink)] shadow-[0_1px_1px_rgba(0,0,0,0.03)]"
                  {...props}
                >
                  {children}
                </code>
              )
            }

            return (
              <CodeBlock
                language={match ? match[1] : ''}
                code={String(children).replace(/\n$/, '')}
              />
            )
          },
          p({ children }) {
            return (
              <p className="mb-2.5 last:mb-0 leading-[1.65] text-[13.5px] sm:text-[14px] text-[var(--color-ink)] font-body">
                {children}
              </p>
            )
          },
          ul({ children }) {
            return (
              <ul className="my-2.5 space-y-1.5 pl-5 list-disc marker:text-[var(--color-accent-2)] text-[13.5px] sm:text-[14px] font-body">
                {children}
              </ul>
            )
          },
          ol({ children, start }) {
            return (
              <ol
                start={start}
                className="my-3 space-y-2 pl-5 list-decimal marker:font-outlier marker:text-[11.5px] marker:font-semibold marker:text-[var(--color-accent)] text-[13.5px] sm:text-[14px] font-body"
              >
                {children}
              </ol>
            )
          },
          li({ children }) {
            return (
              <li className="leading-[1.6] pl-1 text-[var(--color-ink)] marker:leading-none">
                {children}
              </li>
            )
          },
          h1({ children }) {
            return (
              <h1 className="font-display text-[16px] sm:text-[17px] font-semibold tracking-tight text-[var(--color-ink)] mt-4 mb-2 pb-1.5 border-b border-[var(--color-rule-2)] max-w-none flex items-center gap-2">
                <span className="inline-block w-1 h-3.5 bg-[var(--color-accent)] rounded-full shrink-0" />
                <span>{children}</span>
              </h1>
            )
          },
          h2({ children }) {
            return (
              <h2 className="font-display text-[14.5px] sm:text-[15.5px] font-semibold tracking-tight text-[var(--color-ink)] mt-3.5 mb-2 max-w-none flex items-center gap-2">
                <span className="inline-block w-1 h-2.5 bg-[var(--color-accent-2)] rounded-full shrink-0" />
                <span>{children}</span>
              </h2>
            )
          },
          h3({ children }) {
            return (
              <h3 className="font-display text-[13.5px] sm:text-[14px] font-semibold tracking-tight text-[var(--color-ink-2)] mt-3 mb-1.5 max-w-none">
                {children}
              </h3>
            )
          },
          h4({ children }) {
            return (
              <h4 className="font-display text-[13px] font-semibold text-[var(--color-ink-2)] mt-2.5 mb-1 max-w-none">
                {children}
              </h4>
            )
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-3 rounded-r-[var(--radius-input)] border-l-[3px] border-[var(--color-accent)] bg-[var(--color-accent-wash)]/75 py-2.5 px-3.5 text-[13px] sm:text-[13.5px] italic text-[var(--color-ink-2)] shadow-[var(--shadow-card)]">
                {children}
              </blockquote>
            )
          },
          table({ children }) {
            return (
              <div className="my-3.5 overflow-x-auto rounded-[var(--radius-input)] border border-[var(--color-rule-2)] bg-[var(--color-paper)] shadow-[var(--shadow-card)]">
                <table className="min-w-full divide-y divide-[var(--color-rule)] text-left text-[12.5px] sm:text-[13px]">
                  {children}
                </table>
              </div>
            )
          },
          thead({ children }) {
            return <thead className="bg-[var(--color-paper-3)]">{children}</thead>
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-[var(--color-rule)]">{children}</tbody>
          },
          tr({ children }) {
            return <tr className="transition-colors hover:bg-[var(--color-paper-2)]/70">{children}</tr>
          },
          th({ children }) {
            return (
              <th className="px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-2)] select-none">
                {children}
              </th>
            )
          },
          td({ children }) {
            return (
              <td className="px-3.5 py-2 text-[var(--color-ink)] align-top font-body">
                {children}
              </td>
            )
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-[var(--color-accent)] underline underline-offset-4 decoration-[var(--color-accent-2)] hover:decoration-[var(--color-accent)] hover:text-[var(--color-accent-deep)] transition-colors inline-flex items-center gap-1"
              >
                <span>{children}</span>
                <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-70" />
              </a>
            )
          },
          strong({ children }) {
            return <strong className="font-semibold text-[var(--color-ink)]">{children}</strong>
          },
          em({ children }) {
            return <em className="italic text-[var(--color-ink-2)]">{children}</em>
          },
          del({ children }) {
            return <del className="line-through text-[var(--color-muted)]">{children}</del>
          },
          hr() {
            return <hr className="my-4 border-none h-px bg-[var(--color-rule-2)]" />
          },
          input({ type, checked, ...props }) {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 h-3.5 w-3.5 translate-y-[1px] rounded-[3px] border-[var(--color-rule-2)] accent-[var(--color-accent)] cursor-default"
                  {...props}
                />
              )
            }
            return <input type={type} {...props} />
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
