import { useState, useEffect, useCallback } from 'react'

export type SessionResult = {
  id: string
  date: string
  wpm: number
  accuracy: number
  totalChars: number
  correctChars: number
  incorrectChars: number
  durationMs: number
  wordsCompleted: number
}

const STORAGE_KEY = 'azik-typing-history'
const MAX_HISTORY = 50

function loadHistory(): SessionResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as SessionResult[]
    }
  } catch {
    console.error('Failed to load history from localStorage')
  }
  return []
}

function saveHistory(history: SessionResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
  } catch {
    console.error('Failed to save history to localStorage')
  }
}

export function useHistory() {
  const [history, setHistory] = useState<SessionResult[]>([])

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  const addSession = useCallback((result: Omit<SessionResult, 'id' | 'date'>) => {
    const newResult: SessionResult = {
      ...result,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    }
    setHistory(prev => {
      const updated = [newResult, ...prev].slice(0, MAX_HISTORY)
      saveHistory(updated)
      return updated
    })
    return newResult
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const getBestWpm = useCallback((): number => {
    if (history.length === 0) return 0
    return Math.max(...history.map(h => h.wpm))
  }, [history])

  const getAverageWpm = useCallback((): number => {
    if (history.length === 0) return 0
    return Math.round(history.reduce((sum, h) => sum + h.wpm, 0) / history.length)
  }, [history])

  const getAverageAccuracy = useCallback((): number => {
    if (history.length === 0) return 0
    return Math.round(history.reduce((sum, h) => sum + h.accuracy, 0) / history.length)
  }, [history])

  return {
    history,
    addSession,
    clearHistory,
    getBestWpm,
    getAverageWpm,
    getAverageAccuracy,
  }
}
