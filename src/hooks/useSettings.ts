import { useState, useEffect, useCallback } from 'react'

export type Settings = {
  questionCount: number
  strictMode: boolean
}

const STORAGE_KEY = 'azik-typing-settings'
const DEFAULT_SETTINGS: Settings = {
  questionCount: 20,
  strictMode: false,
}

export const QUESTION_COUNT_OPTIONS = [20, 50, 100] as const
export type QuestionCountOption = (typeof QUESTION_COUNT_OPTIONS)[number]

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch {
    console.error('Failed to load settings from localStorage')
  }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    console.error('Failed to save settings to localStorage')
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  useEffect(() => {
    setSettings(loadSettings())
  }, [])

  const setQuestionCount = useCallback((count: QuestionCountOption) => {
    setSettings(prev => {
      const updated = { ...prev, questionCount: count }
      saveSettings(updated)
      return updated
    })
  }, [])

  const setStrictMode = useCallback((strict: boolean) => {
    setSettings(prev => {
      const updated = { ...prev, strictMode: strict }
      saveSettings(updated)
      return updated
    })
  }, [])

  return {
    settings,
    questionCount: settings.questionCount,
    setQuestionCount,
    questionCountOptions: QUESTION_COUNT_OPTIONS,
    strictMode: settings.strictMode,
    setStrictMode,
  }
}
