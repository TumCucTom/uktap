# UKTap 🇬🇧

A UK-only daily geography game, inspired by [MapTap.gg](https://maptap.gg).

Each day you get **5 clues** describing British places — cities, landmarks, and
sites of history. Tap the map where you think each one is. The closer you are,
the higher your score (0–100 per clue). Later rounds carry **×2 and ×3
multipliers**, so a perfect day is **900 points**.

## Features

- **Daily puzzle** — the same 5 locations for everyone, seeded by the date.
- **Distance scoring** — great-circle (haversine) distance, decaying score.
- **Streaks & stats** — played count, current/best streak, best score (saved in `localStorage`).
- **Shareable results** — Wordle-style emoji grid via the Web Share API / clipboard.
- **Practice mode** — random puzzles that don't affect your streak.
- UK-bounded **Leaflet / OpenStreetMap** map (no API key required).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

Build for production:

```bash
npm run build
npm run preview
```

## Project layout

```
src/
  data/locations.ts    # the UK location dataset (name, coords, clue, difficulty)
  lib/game.ts          # daily puzzle selection, scoring, sharing
  lib/storage.ts       # streak & result persistence (localStorage)
  components/MapBoard.tsx   # the interactive Leaflet map
  App.tsx              # screens & game state machine
```

## Extending

Add more places by appending to `LOCATIONS` in `src/data/locations.ts`. Each
entry needs a `difficulty` (1 easy → 5 obscure); the daily puzzle picks one
location per band so games ramp from famous to fiendish.
