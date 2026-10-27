import { useEffect, useRef, useState, useCallback } from 'react'

export function useAutoScroll<T extends HTMLElement>() {
  const containerRef = useRef<T>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  const checkIfAtBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const threshold = 80 // pixels from bottom
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold
    setIsAtBottom(atBottom)
  }, [])

  const scrollToBottom = useCallback((smooth = true) => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    })
    setIsAtBottom(true)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleScroll = () => {
      checkIfAtBottom()
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [checkIfAtBottom])

  return {
    containerRef,
    isAtBottom,
    scrollToBottom,
  }
}
