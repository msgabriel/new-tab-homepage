import { useCallback, useEffect, useState } from 'react'

export function useChromeStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void, boolean, string | null] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    chrome.storage.sync.get([key], result => {
      if (chrome.runtime.lastError) {
        console.error('Chrome storage get error:', chrome.runtime.lastError)
        setError(
          chrome.runtime.lastError.message || 'Unknown Chrome storage error',
        )
        setIsLoading(false)
        return
      }
      if (result[key] !== undefined && result[key] !== null) {
        setStoredValue(result[key] as T)
      }
      setIsLoading(false)
    })
  }, [key])

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value)
      chrome.storage.sync.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          console.error('Chrome storage set error:', chrome.runtime.lastError)
          setError(
            chrome.runtime.lastError.message || 'Unknown Chrome storage error',
          )
        } else {
          setError(null)
        }
      })
    },
    [key],
  )

  return [storedValue, setValue, isLoading, error]
}
