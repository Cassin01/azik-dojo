import { type CharState } from '@/hooks/useTypingGame'
import { cn } from '@/lib/utils'

type Props = {
  charStates: CharState[]
  currentCharIndex: number
  currentInput: string
  getDisplayRomaji: (charState: CharState) => string | null
}

export function WordDisplay({
  charStates,
  currentCharIndex,
  currentInput,
  getDisplayRomaji,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-1">
        {charStates.map((char, index) => {
          const romaji = getDisplayRomaji(char)
          const isCurrent = index === currentCharIndex

          return (
            <div key={index} className="flex flex-col items-center">
              <span
                className={cn(
                  'text-5xl font-bold transition-colors duration-150',
                  char.status === 'correct' && 'text-green-500',
                  char.status === 'incorrect' && 'text-red-500',
                  char.status === 'current' && 'text-blue-600',
                  char.status === 'pending' && 'text-slate-400'
                )}
              >
                {char.hiragana}
              </span>
              <span
                className={cn(
                  'text-sm h-5 transition-opacity duration-150',
                  romaji ? 'text-red-400 opacity-100' : 'opacity-0'
                )}
              >
                {romaji || '\u00A0'}
              </span>
              {isCurrent && (
                <div className="h-1 w-full bg-blue-500 rounded mt-1" />
              )}
            </div>
          )
        })}
      </div>

      <div className="h-8 flex items-center">
        {currentInput && (
          <span className="text-lg text-slate-600 font-mono bg-slate-100 px-3 py-1 rounded">
            {currentInput}
          </span>
        )}
      </div>
    </div>
  )
}
