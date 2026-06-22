// Persists per-player stats and saved daily results in localStorage.

import { todayKey } from './game'

const STATS_KEY = 'uktap.stats.v1'
const RESULT_PREFIX = 'uktap.result.'

export interface Stats {
  played: number
  currentStreak: number
  maxStreak: number
  lastDay: string | null // YYYY-MM-DD
  bestScore: number
  totalScore: number
}

const EMPTY_STATS: Stats = {
  played: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastDay: null,
  bestScore: 0,
  totalScore: 0,
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
export function recordDailyResult(key: string, score: number): Stats {
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
    bestScore: Math.max(stats.bestScore, score),
    totalScore: stats.totalScore + score,
  }
  saveStats(updated)
  return updated
}

export interface SavedResult {
  key: string
  score: number
  emoji: string
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
