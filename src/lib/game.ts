import { LOCATIONS, type UKLocation } from '../data/locations'

export const ROUNDS_PER_GAME = 5
// Conversion for the scoring system: distances are measured to the player in
// miles, and the score is the *total* miles off — lower is better, golf-style.
export const KM_PER_MILE = 1.609344

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

export interface RoundResult {
  location: UKLocation
  guessLat: number
  guessLng: number
  distanceKm: number
  /** Whole miles between the guess and the target — the accuracy of the pin. */
  distanceMiles: number
  /** Whether the player spent their double on this round. */
  doubled: boolean
  /** Miles this round adds to the total: distanceMiles, ×2 when doubled. */
  scoreMiles: number
}

export function makeRoundResult(
  location: UKLocation,
  guessLat: number,
  guessLng: number,
  doubled: boolean,
): RoundResult {
  const distanceKm = haversineKm(location.lat, location.lng, guessLat, guessLng)
  const distanceMiles = Math.round(distanceKm / KM_PER_MILE)
  return {
    location,
    guessLat,
    guessLng,
    distanceKm,
    distanceMiles,
    doubled,
    scoreMiles: distanceMiles * (doubled ? 2 : 1),
  }
}

/** Total miles off across a game — this is the score, lower is better. */
export function totalMiles(results: RoundResult[]): number {
  return results.reduce((a, r) => a + r.scoreMiles, 0)
}

export interface Tier {
  label: string
  color: string
  emoji: string
  /** Which Matty face to show on the map for this accuracy. */
  mood: 'happy' | 'medium' | 'sad'
}

/**
 * Accuracy tier for a single pin, by how many miles off it landed. Drives the
 * reveal badge, the progress-dot colours, the result rows, the share grid, and
 * Matty's expression on the map — so they all always agree. Thresholds are
 * tuned to the ~600-mile span of GB.
 */
export function milesTier(miles: number): Tier {
  if (miles <= 5) return { label: 'Found him!', color: '#34d399', emoji: '🟩', mood: 'happy' }
  if (miles <= 30) return { label: 'Warm', color: '#facc15', emoji: '🟨', mood: 'happy' }
  if (miles <= 80) return { label: 'Close-ish', color: '#fb923c', emoji: '🟧', mood: 'medium' }
  if (miles <= 200) return { label: 'Chilly', color: '#ef4444', emoji: '🟥', mood: 'medium' }
  return { label: 'Stone cold', color: '#64748b', emoji: '⬛', mood: 'sad' }
}

export function formatMiles(miles: number): string {
  if (miles <= 0) return 'spot on'
  return `${miles.toLocaleString('en-GB')} mi`
}

export function buildShareText(key: string, results: RoundResult[]): string {
  const total = totalMiles(results)
  const grid = results.map((r) => milesTier(r.distanceMiles).emoji).join('')
  const dbl = results.findIndex((r) => r.doubled)
  const dblNote = dbl >= 0 ? ` · ⚡R${dbl + 1}` : ''
  return `Where's Matty? ${key}\n${total} mi${dblNote}\n${grid}\nwheresmatty.gg`
}
