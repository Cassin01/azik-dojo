import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { SessionResult } from '@/hooks/useHistory'

type Props = {
  history: SessionResult[]
  onClear: () => void
  bestWpm: number
  averageWpm: number
  averageAccuracy: number
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function History({
  history,
  onClear,
  bestWpm,
  averageWpm,
  averageAccuracy,
}: Props) {
  if (history.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-4">
            No sessions yet. Start typing to record your first session!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">History</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-red-500 hover:text-red-600">
          Clear
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{bestWpm}</div>
            <div className="text-xs text-slate-500">Best WPM</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-slate-700">{averageWpm}</div>
            <div className="text-xs text-slate-500">Avg WPM</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{averageAccuracy}%</div>
            <div className="text-xs text-slate-500">Avg Acc</div>
          </div>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {history.slice(0, 10).map(session => (
            <div
              key={session.id}
              className="flex items-center justify-between text-sm py-2 border-b last:border-0"
            >
              <span className="text-slate-500">{formatDate(session.date)}</span>
              <div className="flex gap-4">
                <span className="font-medium text-blue-600">{session.wpm} WPM</span>
                <span className="text-green-600">{session.accuracy}%</span>
                <span className="text-slate-400">{formatDuration(session.durationMs)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
