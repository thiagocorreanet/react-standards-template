import { useCallback, useEffect, useRef } from "react"

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs = 300
) {
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const latestCallback = useRef(callback)

  useEffect(() => {
    latestCallback.current = callback
  }, [callback])

  useEffect(() => {
    return () => clearTimeout(timeout.current)
  }, [])

  return useCallback(
    (...args: Args) => {
      clearTimeout(timeout.current)
      timeout.current = setTimeout(
        () => latestCallback.current(...args),
        delayMs
      )
    },
    [delayMs]
  )
}
