import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { GameStats } from '@/hooks/useTypingGame'

type Props = {
  stats: GameStats
  progress: number
  wordIndex: number
  totalWords: number
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function Stats({ stats, progress, wordIndex, totalWords }: Props) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Progress</span>
            <span className="text-sm font-medium">
              {wordIndex + 1} / {totalWords}
            </span>
          </div>
          <Progress value={progress} className="h-2" />

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.wpm}</div>
              <div className="text-xs text-slate-500">WPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
              <div className="text-xs text-slate-500">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">
                {formatTime(stats.elapsedMs)}
              </div>
              <div className="text-xs text-slate-500">Time</div>
            </div>
          </div>

          <div className="flex justify-center gap-6 text-sm text-slate-500 pt-2">
            <span>
              Correct: <span className="text-green-600 font-medium">{stats.correctChars}</span>
            </span>
            <span>
              Errors: <span className="text-red-600 font-medium">{stats.incorrectChars}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
