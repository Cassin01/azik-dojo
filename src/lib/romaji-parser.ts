import romajiTableText from '../../romantable.txt?raw'

export type RomajiEntry = {
  romaji: string
  hiragana: string
}

export type HiraganaToRomajiMap = Map<string, string[]>
export type RomajiToHiraganaMap = Map<string, string>

export type GroupedByLength = Record<number, string[]>

function parseRomajiTable(text: string): RomajiEntry[] {
  return text
    .trim()
    .split('\n')
    .map(line => {
      const [romaji, hiragana] = line.split('\t')
      return { romaji: romaji.trim(), hiragana: hiragana?.trim() || '' }
    })
    .filter(entry => entry.romaji && entry.hiragana)
}

function buildHiraganaToRomajiMap(entries: RomajiEntry[]): HiraganaToRomajiMap {
  const map: HiraganaToRomajiMap = new Map()
  for (const { romaji, hiragana } of entries) {
    if (!map.has(hiragana)) {
      map.set(hiragana, [])
    }
    map.get(hiragana)!.push(romaji)
  }
  return map
}

function buildRomajiToHiraganaMap(entries: RomajiEntry[]): RomajiToHiraganaMap {
  const map: RomajiToHiraganaMap = new Map()
  for (const { romaji, hiragana } of entries) {
    map.set(romaji, hiragana)
  }
  return map
}

const entries = parseRomajiTable(romajiTableText)
const hiraganaToRomaji = buildHiraganaToRomajiMap(entries)
const romajiToHiragana = buildRomajiToHiraganaMap(entries)

export function getRomajiOptions(hiragana: string): string[] {
  return hiraganaToRomaji.get(hiragana) || []
}

export function getHiragana(romaji: string): string | undefined {
  return romajiToHiragana.get(romaji)
}

export function groupByLength(romajiList: string[]): GroupedByLength {
  const grouped: GroupedByLength = {}
  for (const r of romajiList) {
    const len = r.length
    if (!grouped[len]) {
      grouped[len] = []
    }
    grouped[len].push(r)
  }
  return grouped
}

export function getAllHiragana(): string[] {
  return Array.from(hiraganaToRomaji.keys())
}

export function getAllRomaji(): string[] {
  return Array.from(romajiToHiragana.keys())
}

export type MatchResult = {
  type: 'correct' | 'partial' | 'wrong'
  matchedHiragana?: string
  validRomaji?: string[]
}

export function checkInputAgainstHiragana(
  input: string,
  targetHiragana: string
): MatchResult {
  const validRomaji = getRomajiOptions(targetHiragana)
  if (validRomaji.length === 0) {
    return { type: 'wrong', validRomaji: [] }
  }

  const grouped = groupByLength(validRomaji)
  const inputLength = input.length
  const sameLengthOptions = grouped[inputLength] || []

  if (sameLengthOptions.includes(input)) {
    return {
      type: 'correct',
      matchedHiragana: targetHiragana,
      validRomaji,
    }
  }

  const hasPartialMatch = validRomaji.some(r =>
    r.startsWith(input) && r.length > inputLength
  )
  if (hasPartialMatch) {
    return { type: 'partial', validRomaji }
  }

  return { type: 'wrong', validRomaji }
}

export function findMatchingHiragana(
  input: string,
  remainingHiragana: string
): { matched: string; consumed: string } | null {
  for (let len = Math.min(input.length, 5); len >= 1; len--) {
    const prefix = input.slice(0, len)
    const hiragana = getHiragana(prefix)
    if (hiragana) {
      if (remainingHiragana.startsWith(hiragana)) {
        return { matched: hiragana, consumed: prefix }
      }
    }
  }
  return null
}

export type InputCheckResult = {
  status: 'correct' | 'partial' | 'wrong'
  consumedRomaji?: string
  matchedHiragana?: string
  validRomajiForCurrentChar?: string[]
}

export function checkInputForWord(
  input: string,
  remainingHiragana: string
): InputCheckResult {
  if (remainingHiragana.length === 0) {
    return { status: 'wrong' }
  }

  for (let hiraganaLen = Math.min(remainingHiragana.length, 4); hiraganaLen >= 1; hiraganaLen--) {
    const targetHiragana = remainingHiragana.slice(0, hiraganaLen)
    const validRomaji = getRomajiOptions(targetHiragana)

    if (validRomaji.length === 0) continue

    const grouped = groupByLength(validRomaji)
    const inputLength = input.length
    const sameLengthOptions = grouped[inputLength] || []

    if (sameLengthOptions.includes(input)) {
      return {
        status: 'correct',
        consumedRomaji: input,
        matchedHiragana: targetHiragana,
        validRomajiForCurrentChar: validRomaji,
      }
    }

    const hasPartialMatch = validRomaji.some(r =>
      r.startsWith(input) && r.length > inputLength
    )
    if (hasPartialMatch) {
      return {
        status: 'partial',
        validRomajiForCurrentChar: validRomaji,
      }
    }
  }

  const firstChar = remainingHiragana[0]
  const validRomaji = getRomajiOptions(firstChar)
  return {
    status: 'wrong',
    validRomajiForCurrentChar: validRomaji.length > 0 ? validRomaji : undefined,
  }
}
