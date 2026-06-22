import { LOCATIONS, type UKLocation } from '../data/locations'

export const ROUNDS_PER_GAME = 5
// Later rounds are worth more, mirroring MapTap's escalating multipliers.
export const ROUND_MULTIPLIERS = [1, 1, 2, 2, 3]
export const MAX_SCORE = ROUND_MULTIPLIERS.reduce((a, m) => a + m * 100, 0) // 900

/** Today's puzzle key in UTC, e.g. "2026-06-22". */
export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

/** Whole number of days since the epoch — the daily puzzle index. */
function dayNumber(key: string): number {
  return Math.floor(new Date(key + 'T00:00:00Z').getTime() / 86_400_000)
}

// Deterministic PRNG so every player gets the same puzzle on a given day.
function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Build a 5-location puzzle from a seed. Picks one location from each
 * difficulty band so the puzzle ramps from easy to hard, like MapTap.
 */
function buildPuzzle(seed: number): UKLocation[] {
  const rand = mulberry32(seed)
  const picks: UKLocation[] = []
  for (let band = 1; band <= ROUNDS_PER_GAME; band++) {
    const pool = LOCATIONS.filter((l) => l.difficulty === band)
    const source = pool.length ? pool : LOCATIONS
    picks.push(shuffle(source, rand)[0])
  }
  return picks
}

/** The deterministic puzzle for a given day key. */
export function dailyPuzzle(key = todayKey()): UKLocation[] {
  return buildPuzzle(dayNumber(key) * 2654435761)
}

/** A random practice puzzle (non-deterministic). */
export function practicePuzzle(): UKLocation[] {
  return buildPuzzle(Math.floor(Math.random() * 1e9))
}

/** Great-circle distance between two points, in kilometres. */
export function haversineKm(
  aLat: number, aLng: number, bLat: number, bLng: number,
): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const lat1 = toRad(aLat)
  const lat2 = toRad(bLat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}

/**
 * Score 0–100 for a single guess. Within 5km is a perfect 100; the score
 * decays exponentially with distance and hits 0 around 500km — a sensible
 * scale for the size of the UK.
 */
export function scoreForDistance(distanceKm: number): number {
  if (distanceKm <= 5) return 100
  const score = 100 * Math.exp(-distanceKm / 120)
  return Math.max(0, Math.round(score))
}

export interface RoundResult {
  location: UKLocation
  guessLat: number
  guessLng: number
  distanceKm: number
  baseScore: number
  multiplier: number
  points: number
}

export function makeRoundResult(
  location: UKLocation,
  roundIndex: number,
  guessLat: number,
  guessLng: number,
): RoundResult {
  const distanceKm = haversineKm(location.lat, location.lng, guessLat, guessLng)
  const baseScore = scoreForDistance(distanceKm)
  const multiplier = ROUND_MULTIPLIERS[roundIndex] ?? 1
  return {
    location,
    guessLat,
    guessLng,
    distanceKm,
    baseScore,
    multiplier,
    points: baseScore * multiplier,
  }
}

/** Emoji rating per round for the shareable result grid. */
export function scoreEmoji(baseScore: number): string {
  if (baseScore >= 95) return '🟩'
  if (baseScore >= 70) return '🟨'
  if (baseScore >= 40) return '🟧'
  if (baseScore > 0) return '🟥'
  return '⬛'
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

export function buildShareText(key: string, results: RoundResult[]): string {
  const total = results.reduce((a, r) => a + r.points, 0)
  const grid = results.map((r) => scoreEmoji(r.baseScore)).join('')
  return `UKTap ${key}\n${total}/${MAX_SCORE}\n${grid}\nuktap.gg`
}
