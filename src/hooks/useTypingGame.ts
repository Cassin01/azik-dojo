import { useState, useCallback, useEffect, useRef } from 'react'
import { checkInputForWord, getRomajiOptions, groupByLength } from '@/lib/romaji-parser'
import { getRandomWords } from '@/data/words'

export type GameState = 'idle' | 'playing' | 'finished'

export type CharState = {
  hiragana: string
  status: 'pending' | 'current' | 'correct' | 'incorrect'
  showRomaji: boolean
  validRomaji: string[]
}

export type GameStats = {
  wpm: number
  accuracy: number
  totalChars: number
  correctChars: number
  incorrectChars: number
  elapsedMs: number
  wordsCompleted: number
}

const WORD_COUNT = 10

export function useTypingGame() {
  const [gameState, setGameState] = useState<GameState>('idle')
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [charStates, setCharStates] = useState<CharState[]>([])
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [currentInput, setCurrentInput] = useState('')
  const [stats, setStats] = useState<GameStats>({
    wpm: 0,
    accuracy: 100,
    totalChars: 0,
    correctChars: 0,
    incorrectChars: 0,
    elapsedMs: 0,
    wordsCompleted: 0,
  })

  const startTimeRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const initializeWord = useCallback((word: string): CharState[] => {
    const chars: CharState[] = []
    let i = 0
    while (i < word.length) {
      let matched = false
      for (let len = Math.min(word.length - i, 4); len >= 1; len--) {
        const substr = word.slice(i, i + len)
        const romajiOptions = getRomajiOptions(substr)
        if (romajiOptions.length > 0) {
          chars.push({
            hiragana: substr,
            status: 'pending',
            showRomaji: false,
            validRomaji: romajiOptions,
          })
          i += len
          matched = true
          break
        }
      }
      if (!matched) {
        chars.push({
          hiragana: word[i],
          status: 'pending',
          showRomaji: false,
          validRomaji: [],
        })
        i++
      }
    }
    if (chars.length > 0) {
      chars[0].status = 'current'
    }
    return chars
  }, [])

  const startGame = useCallback(() => {
    const newWords = getRandomWords(WORD_COUNT)
    setWords(newWords)
    setCurrentWordIndex(0)
    setCharStates(initializeWord(newWords[0]))
    setCurrentCharIndex(0)
    setCurrentInput('')
    setStats({
      wpm: 0,
      accuracy: 100,
      totalChars: 0,
      correctChars: 0,
      incorrectChars: 0,
      elapsedMs: 0,
      wordsCompleted: 0,
    })
    setGameState('playing')
    startTimeRef.current = Date.now()

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current
        setStats(prev => {
          const minutes = elapsed / 60000
          const wpm = minutes > 0 ? Math.round(prev.correctChars / 5 / minutes) : 0
          return { ...prev, elapsedMs: elapsed, wpm }
        })
      }
    }, 100)
  }, [initializeWord])

  const endGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setGameState('finished')
  }, [])

  const moveToNextWord = useCallback(() => {
    const nextIndex = currentWordIndex + 1
    if (nextIndex >= words.length) {
      endGame()
      return
    }
    setCurrentWordIndex(nextIndex)
    setCharStates(initializeWord(words[nextIndex]))
    setCurrentCharIndex(0)
    setCurrentInput('')
    setStats(prev => ({ ...prev, wordsCompleted: prev.wordsCompleted + 1 }))
  }, [currentWordIndex, words, initializeWord, endGame])

  const handleKeyPress = useCallback((key: string) => {
    if (gameState !== 'playing') return
    if (key.length !== 1) return

    const currentChar = charStates[currentCharIndex]
    if (!currentChar) return

    const newInput = currentInput + key
    const remainingHiragana = charStates
      .slice(currentCharIndex)
      .map(c => c.hiragana)
      .join('')

    const result = checkInputForWord(newInput, remainingHiragana)

    if (result.status === 'correct') {
      setCharStates(prev => {
        const updated = [...prev]
        updated[currentCharIndex] = {
          ...updated[currentCharIndex],
          status: 'correct',
        }
        if (currentCharIndex + 1 < updated.length) {
          updated[currentCharIndex + 1] = {
            ...updated[currentCharIndex + 1],
            status: 'current',
          }
        }
        return updated
      })
      setStats(prev => ({
        ...prev,
        totalChars: prev.totalChars + 1,
        correctChars: prev.correctChars + 1,
        accuracy: Math.round(((prev.correctChars + 1) / (prev.totalChars + 1)) * 100),
      }))
      setCurrentInput('')

      if (currentCharIndex + 1 >= charStates.length) {
        setStats(prev => ({ ...prev, wordsCompleted: prev.wordsCompleted + 1 }))
        setTimeout(() => moveToNextWord(), 100)
      } else {
        setCurrentCharIndex(prev => prev + 1)
      }
    } else if (result.status === 'partial') {
      setCurrentInput(newInput)
    } else {
      setCharStates(prev => {
        const updated = [...prev]
        updated[currentCharIndex] = {
          ...updated[currentCharIndex],
          showRomaji: true,
        }
        return updated
      })
      setStats(prev => ({
        ...prev,
        totalChars: prev.totalChars + 1,
        incorrectChars: prev.incorrectChars + 1,
        accuracy: Math.round((prev.correctChars / (prev.totalChars + 1)) * 100),
      }))
      setCurrentInput('')
    }
  }, [gameState, charStates, currentCharIndex, currentInput, moveToNextWord])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        handleKeyPress(e.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, handleKeyPress])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const currentWord = words[currentWordIndex] || ''
  const progress = words.length > 0 ? ((currentWordIndex + 1) / words.length) * 100 : 0

  const getDisplayRomaji = useCallback((charState: CharState): string | null => {
    if (!charState.showRomaji) return null
    const grouped = groupByLength(charState.validRomaji)
    const shortestLength = Math.min(...Object.keys(grouped).map(Number))
    const shortestOptions = grouped[shortestLength] || []
    return shortestOptions[0] || charState.validRomaji[0] || null
  }, [])

  return {
    gameState,
    currentWord,
    charStates,
    currentCharIndex,
    currentInput,
    stats,
    progress,
    wordIndex: currentWordIndex,
    totalWords: words.length,
    startGame,
    endGame,
    getDisplayRomaji,
  }
}
