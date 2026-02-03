import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WordDisplay } from '@/components/WordDisplay'
import { Stats } from '@/components/Stats'
import { History } from '@/components/History'
import { useTypingGame } from '@/hooks/useTypingGame'
import { useHistory } from '@/hooks/useHistory'

function App() {
  const game = useTypingGame()
  const history = useHistory()

  useEffect(() => {
    if (game.gameState === 'finished') {
      history.addSession({
        wpm: game.stats.wpm,
        accuracy: game.stats.accuracy,
        totalChars: game.stats.totalChars,
        correctChars: game.stats.correctChars,
        incorrectChars: game.stats.incorrectChars,
        durationMs: game.stats.elapsedMs,
        wordsCompleted: game.stats.wordsCompleted,
      })
    }
  }, [game.gameState])

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">AZIK Dojo</h1>
          <p className="text-slate-500 mt-2">Master AZIK typing through practice</p>
        </header>

        {game.gameState === 'idle' && (
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Ready to start?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-500">
                Type the hiragana words using AZIK romaji input.
                <br />
                Romaji hints will appear when you make a mistake.
              </p>
              <Button size="lg" onClick={game.startGame}>
                Start Practice
              </Button>
            </CardContent>
          </Card>
        )}

        {game.gameState === 'playing' && (
          <div className="space-y-6">
            <Card className="p-8">
              <div className="text-center mb-4">
                <span className="text-sm text-slate-500">Current Word</span>
              </div>
              <WordDisplay
                charStates={game.charStates}
                currentCharIndex={game.currentCharIndex}
                currentInput={game.currentInput}
                getDisplayRomaji={game.getDisplayRomaji}
              />
            </Card>

            <Stats
              stats={game.stats}
              progress={game.progress}
              wordIndex={game.wordIndex}
              totalWords={game.totalWords}
            />

            <div className="text-center">
              <Button variant="outline" onClick={game.endGame}>
                End Session
              </Button>
            </div>
          </div>
        )}

        {game.gameState === 'finished' && (
          <div className="space-y-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Session Complete!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{game.stats.wpm}</div>
                    <div className="text-sm text-slate-500">WPM</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">{game.stats.accuracy}%</div>
                    <div className="text-sm text-slate-500">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-700">
                      {game.stats.wordsCompleted}
                    </div>
                    <div className="text-sm text-slate-500">Words</div>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button size="lg" onClick={game.startGame}>
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>

            <History
              history={history.history}
              onClear={history.clearHistory}
              bestWpm={history.getBestWpm()}
              averageWpm={history.getAverageWpm()}
              averageAccuracy={history.getAverageAccuracy()}
            />
          </div>
        )}

        {game.gameState === 'idle' && history.history.length > 0 && (
          <History
            history={history.history}
            onClear={history.clearHistory}
            bestWpm={history.getBestWpm()}
            averageWpm={history.getAverageWpm()}
            averageAccuracy={history.getAverageAccuracy()}
          />
        )}
      </div>
    </div>
  )
}

export default App
