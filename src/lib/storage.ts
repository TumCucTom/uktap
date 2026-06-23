// Persists per-player stats and saved daily results in localStorage.

import { todayKey } from './game'
import type { RoundResult } from './game'

// Bumped to v2 when scoring changed from "points, higher better" to
// "total miles off, lower better" — the two are not comparable, so old
// records are intentionally not migrated.
const STATS_KEY = 'uktap.stats.v2'
const RESULT_PREFIX = 'uktap.result.v2.'

export interface Stats {
  played: number
  currentStreak: number
  maxStreak: number
  lastDay: string | null // YYYY-MM-DD
  /** Lowest total-miles score ever achieved (best = fewest). 0 = none yet. */
  bestMiles: number
  totalMiles: number
}

const EMPTY_STATS: Stats = {
  played: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastDay: null,
  bestMiles: 0,
  totalMiles: 0,
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return { ...EMPTY_STATS }
    return { ...EMPTY_STATS, ...JSON.parse(raw) }
  } catch {
    return { ...EMPTY_STATS }
  }
}

function saveStats(stats: Stats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch {
    /* ignore quota / private-mode errors */
  }
}

function isYesterday(prev: string, current: string): boolean {
  const a = new Date(prev + 'T00:00:00Z').getTime()
  const b = new Date(current + 'T00:00:00Z').getTime()
  return b - a === 86_400_000
}

/** Record a completed daily game and return the updated stats. */
export function recordDailyResult(key: string, miles: number): Stats {
  const stats = loadStats()
  if (stats.lastDay === key) return stats // already counted today

  let currentStreak = 1
  if (stats.lastDay && isYesterday(stats.lastDay, key)) {
    currentStreak = stats.currentStreak + 1
  }

  const updated: Stats = {
    played: stats.played + 1,
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    lastDay: key,
    // Best = fewest miles. First-ever game seeds the record directly.
    bestMiles: stats.played === 0 ? miles : Math.min(stats.bestMiles, miles),
    totalMiles: stats.totalMiles + miles,
  }
  saveStats(updated)
  return updated
}

export interface SavedResult {
  key: string
  miles: number
  emoji: string
  /** Full round-by-round results, so today's score can be re-shown. */
  results: RoundResult[]
}

export function saveResultRecord(r: SavedResult): void {
  try {
    localStorage.setItem(RESULT_PREFIX + r.key, JSON.stringify(r))
  } catch {
    /* ignore */
  }
}

export function loadResultRecord(key: string): SavedResult | null {
  try {
    const raw = localStorage.getItem(RESULT_PREFIX + key)
    return raw ? (JSON.parse(raw) as SavedResult) : null
  } catch {
    return null
  }
}

export function hasPlayedToday(): boolean {
  return loadResultRecord(todayKey()) !== null
}

const TUTORIAL_KEY = 'uktap.tutorial.v1'

/** Whether the player has dismissed the first-time how-to-play tutorial. */
export function hasSeenTutorial(): boolean {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === '1'
  } catch {
    return false
  }
}

export function markTutorialSeen(): void {
  try {
    localStorage.setItem(TUTORIAL_KEY, '1')
  } catch {
    /* ignore quota / private-mode errors */
  }
}
