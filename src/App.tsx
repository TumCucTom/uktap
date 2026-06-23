import { useMemo, useState, type CSSProperties } from 'react'
import MapBoard from './components/MapBoard'
import HowToPlay from './components/HowToPlay'
import mattyAvatar from './assets/matty-happy.png'
import {
  dailyPuzzle,
  practicePuzzle,
  makeRoundResult,
  buildShareText,
  milesTier,
  formatMiles,
  totalMiles,
  todayKey,
  ROUNDS_PER_GAME,
  type RoundResult,
} from './lib/game'
import {
  loadStats,
  recordDailyResult,
  saveResultRecord,
  hasPlayedToday,
  hasSeenTutorial,
  markTutorialSeen,
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
  // Which round the player spent their one double on (null until used).
  const [doubleRound, setDoubleRound] = useState<number | null>(null)
  // Whether the double is armed for the round currently being played.
  const [armed, setArmed] = useState(false)
  const [stats, setStats] = useState<Stats>(() => loadStats())
  const [copied, setCopied] = useState(false)
  // Show the how-to-play tutorial automatically on a player's first ever visit.
  const [showHelp, setShowHelp] = useState(() => !hasSeenTutorial())

  function closeHelp() {
    markTutorialSeen()
    setShowHelp(false)
  }

  const dayKey = todayKey()
  const playedToday = useMemo(() => hasPlayedToday(), [screen])

  function startGame(m: Mode) {
    setMode(m)
    setPuzzle(m === 'daily' ? dailyPuzzle(dayKey) : practicePuzzle())
    setRound(0)
    setResults([])
    setPin(null)
    setRevealed(null)
    setDoubleRound(null)
    setArmed(false)
    setCopied(false)
    setScreen('play')
  }

  // The double must be spent somewhere: if it's still unused on the last
  // round, it's forced onto it.
  const lastRound = round === ROUNDS_PER_GAME - 1
  const doubleSpent = doubleRound !== null
  const forcedDouble = lastRound && !doubleSpent
  const willDouble = forcedDouble || armed

  function submitGuess() {
    if (!pin) return
    const doubled = forcedDouble || armed
    const result = makeRoundResult(puzzle[round], pin[0], pin[1], doubled)
    if (doubled) setDoubleRound(round)
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
    setArmed(false)
  }

  function finishGame() {
    const total = totalMiles(results)
    if (mode === 'daily') {
      const emoji = results.map((r) => milesTier(r.distanceMiles).emoji).join('')
      saveResultRecord({ key: dayKey, miles: total, emoji })
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

  const total = totalMiles(results)
  const current = puzzle[round]

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('home')}>
          <img className="brand-avatar" src={mattyAvatar} alt="" />
          Where’s <span>Matty?</span>
        </button>
        <div className="stat-pills">
          <button
            className="icon-btn"
            onClick={() => setShowHelp(true)}
            aria-label="How to play"
            title="How to play"
          >
            ?
          </button>
          <span title="Current streak">🔥 {stats.currentStreak}</span>
          <span title="Games played">🎯 {stats.played}</span>
        </div>
      </header>

      {showHelp && <HowToPlay onClose={closeHelp} />}

      {screen === 'home' && (
        <main className="home">
          <span className="home-kicker">Daily UK Matty hunt</span>
          <h1>Where’s Matty?</h1>
          <p className="tagline">
            Matty’s hiding in five places across the UK. Tap the map where you think he
            is — the fewer total miles off, the better. One round is your <strong>double</strong>.
          </p>
          <div className="home-stripe" />
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
            <Stat label="Best (mi)" value={stats.played ? stats.bestMiles : '—'} />
          </div>
          {playedToday && (
            <p className="muted">You’ve already completed today’s daily. Come back tomorrow!</p>
          )}
        </main>
      )}

      {screen === 'play' && current && (
        <main className="play">
          <div className="round-bar">
            <div className="round-dots" aria-label={`Round ${round + 1} of ${ROUNDS_PER_GAME}`}>
              {Array.from({ length: ROUNDS_PER_GAME }, (_, i) => {
                const state =
                  i < results.length ? 'done' : i === round ? 'current' : 'todo'
                const isDoubled = i < results.length && results[i].doubled
                return (
                  <span
                    key={i}
                    className={`dot dot-${state}${isDoubled ? ' dot-doubled' : ''}`}
                    style={
                      state === 'done'
                        ? ({ '--dot': milesTier(results[i].distanceMiles).color } as CSSProperties)
                        : undefined
                    }
                  />
                )
              })}
            </div>
            <span className="round-score">{total} mi</span>
          </div>

          <div className="clue">
            <div className="clue-head">
              <span className="clue-label">Round {round + 1} · Matty’s hiding in…</span>
              {willDouble && <span className="double-chip">⚡ Double</span>}
            </div>
            <p>{current.name}</p>
          </div>

          {!revealed &&
            (doubleSpent ? (
              <div className="double-note">⚡ Double already used on round {doubleRound + 1}</div>
            ) : forcedDouble ? (
              <div className="double-note on">⚡ Double locked on — last round, counts ×2</div>
            ) : (
              <button
                type="button"
                className={`double-btn${armed ? ' on' : ''}`}
                aria-pressed={armed}
                onClick={() => setArmed((a) => !a)}
              >
                {armed
                  ? '⚡ Double armed — this round counts ×2 · tap to undo'
                  : '⚡ Use your double here? · one per game, ×2 miles'}
              </button>
            ))}

          <MapBoard active={!revealed} revealed={revealed} onPinChange={(la, ln) => setPin([la, ln])} />

          <div className="play-footer">
            {!revealed ? (
              <button className="primary" disabled={!pin} onClick={submitGuess}>
                {pin ? (willDouble ? 'Spot Matty (×2)' : 'Spot Matty') : 'Tap the map to find Matty'}
              </button>
            ) : (
              <div className="reveal">
                <span
                  className="acc-badge"
                  style={{ '--tier': milesTier(revealed.distanceMiles).color } as CSSProperties}
                >
                  {milesTier(revealed.distanceMiles).label}
                </span>
                <div className="reveal-info">
                  <strong>{revealed.location.name}</strong>
                  <span>
                    {formatMiles(revealed.distanceMiles)} off
                    {revealed.doubled ? ` · ×2 = ${revealed.scoreMiles} mi` : ''}
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
          <h2>{mode === 'daily' ? `Where’s Matty? · ${dayKey}` : 'Practice complete'}</h2>
          <div className="final-score">
            {total}<span>mi off</span>
          </div>
          <p className="done-sub">Total miles off — lower is better</p>
          <div className="result-grid">
            {results.map((r, i) => (
              <div
                key={i}
                className="result-row"
                style={{ '--tier': milesTier(r.distanceMiles).color } as CSSProperties}
              >
                <span className="result-emoji">{milesTier(r.distanceMiles).emoji}</span>
                <span className="result-name">
                  {r.location.name}
                  {r.doubled && <span className="result-double">⚡×2</span>}
                </span>
                <span className="result-dist">{r.doubled ? formatMiles(r.distanceMiles) : ''}</span>
                <span className="result-pts">{r.scoreMiles} mi</span>
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
        Where’s Matty? · a UK-only daily hide-and-seek · inspired by Where’s Wally · Imagery © Esri
      </footer>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
