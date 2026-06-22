import { useMemo, useState } from 'react'
import MapBoard from './components/MapBoard'
import {
  dailyPuzzle,
  practicePuzzle,
  makeRoundResult,
  buildShareText,
  scoreEmoji,
  formatDistance,
  todayKey,
  ROUNDS_PER_GAME,
  MAX_SCORE,
  type RoundResult,
} from './lib/game'
import {
  loadStats,
  recordDailyResult,
  saveResultRecord,
  hasPlayedToday,
  type Stats,
} from './lib/storage'
import type { UKLocation } from './data/locations'

type Mode = 'daily' | 'practice'
type Screen = 'home' | 'play' | 'done'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [mode, setMode] = useState<Mode>('daily')
  const [puzzle, setPuzzle] = useState<UKLocation[]>([])
  const [round, setRound] = useState(0)
  const [results, setResults] = useState<RoundResult[]>([])
  const [pin, setPin] = useState<[number, number] | null>(null)
  const [revealed, setRevealed] = useState<RoundResult | null>(null)
  const [stats, setStats] = useState<Stats>(() => loadStats())
  const [copied, setCopied] = useState(false)

  const dayKey = todayKey()
  const playedToday = useMemo(() => hasPlayedToday(), [screen])

  function startGame(m: Mode) {
    setMode(m)
    setPuzzle(m === 'daily' ? dailyPuzzle(dayKey) : practicePuzzle())
    setRound(0)
    setResults([])
    setPin(null)
    setRevealed(null)
    setCopied(false)
    setScreen('play')
  }

  function submitGuess() {
    if (!pin) return
    const result = makeRoundResult(puzzle[round], round, pin[0], pin[1])
    setRevealed(result)
    setResults((prev) => [...prev, result])
  }

  function nextRound() {
    const next = round + 1
    if (next >= ROUNDS_PER_GAME) {
      finishGame()
      return
    }
    setRound(next)
    setPin(null)
    setRevealed(null)
  }

  function finishGame() {
    const total = results.reduce((a, r) => a + r.points, 0)
    if (mode === 'daily') {
      const emoji = results.map((r) => scoreEmoji(r.baseScore)).join('')
      saveResultRecord({ key: dayKey, score: total, emoji })
      setStats(recordDailyResult(dayKey, total))
    }
    setScreen('done')
  }

  async function share() {
    const text = buildShareText(mode === 'daily' ? dayKey : 'Practice', results)
    try {
      if (navigator.share) {
        await navigator.share({ text })
      } else {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* user dismissed share sheet */
    }
  }

  const total = results.reduce((a, r) => a + r.points, 0)
  const current = puzzle[round]

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('home')}>
          🇬🇧 UK<span>Tap</span>
        </button>
        <div className="stat-pills">
          <span title="Current streak">🔥 {stats.currentStreak}</span>
          <span title="Games played">🎯 {stats.played}</span>
        </div>
      </header>

      {screen === 'home' && (
        <main className="home">
          <h1>Pin Britain.</h1>
          <p className="tagline">
            Five clues. Five places across the UK. Tap the map as close as you can.
          </p>
          <div className="home-actions">
            <button className="primary" onClick={() => startGame('daily')}>
              {playedToday ? 'Replay today’s puzzle' : 'Play today’s puzzle'}
            </button>
            <button className="secondary" onClick={() => startGame('practice')}>
              Practice (random)
            </button>
          </div>
          <div className="stats-card">
            <Stat label="Played" value={stats.played} />
            <Stat label="Streak" value={stats.currentStreak} />
            <Stat label="Best streak" value={stats.maxStreak} />
            <Stat label="Best score" value={stats.bestScore} />
          </div>
          {playedToday && (
            <p className="muted">You’ve already completed today’s daily. Come back tomorrow!</p>
          )}
        </main>
      )}

      {screen === 'play' && current && (
        <main className="play">
          <div className="round-bar">
            <span className="round-no">
              Round {round + 1}/{ROUNDS_PER_GAME}
            </span>
            <span className="round-mult">×{[1, 1, 2, 2, 3][round]} points</span>
            <span className="round-score">{total} pts</span>
          </div>

          <div className="clue">
            <span className="clue-label">Where is…</span>
            <p>{current.clue}</p>
          </div>

          <MapBoard active={!revealed} revealed={revealed} onPinChange={(la, ln) => setPin([la, ln])} />

          <div className="play-footer">
            {!revealed ? (
              <button className="primary" disabled={!pin} onClick={submitGuess}>
                {pin ? 'Submit guess' : 'Tap the map to place your pin'}
              </button>
            ) : (
              <div className="reveal">
                <div className="reveal-info">
                  <strong>{revealed.location.name}</strong>
                  <span>
                    {formatDistance(revealed.distanceKm)} away · {revealed.baseScore}
                    {revealed.multiplier > 1 ? ` ×${revealed.multiplier} = ${revealed.points}` : ''} pts
                  </span>
                </div>
                <button className="primary" onClick={nextRound}>
                  {round + 1 >= ROUNDS_PER_GAME ? 'See results' : 'Next clue'}
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {screen === 'done' && (
        <main className="done">
          <h2>{mode === 'daily' ? `UKTap · ${dayKey}` : 'Practice complete'}</h2>
          <div className="final-score">
            {total}<span>/ {MAX_SCORE}</span>
          </div>
          <div className="result-grid">
            {results.map((r, i) => (
              <div key={i} className="result-row">
                <span className="result-emoji">{scoreEmoji(r.baseScore)}</span>
                <span className="result-name">{r.location.name}</span>
                <span className="result-dist">{formatDistance(r.distanceKm)}</span>
                <span className="result-pts">{r.points}</span>
              </div>
            ))}
          </div>
          <div className="done-actions">
            <button className="primary" onClick={share}>
              {copied ? 'Copied!' : 'Share result'}
            </button>
            <button className="secondary" onClick={() => startGame('practice')}>
              Practice again
            </button>
            <button className="ghost" onClick={() => setScreen('home')}>
              Home
            </button>
          </div>
        </main>
      )}

      <footer className="sitefoot">
        UKTap · a UK-only daily geography game · inspired by MapTap
      </footer>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
