import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import { LatLngBounds, divIcon } from 'leaflet'
import type { RoundResult } from '../lib/game'
import { formatMiles, milesTier } from '../lib/game'
import matty1Happy from '../assets/matty-happy.png'
import matty1Medium from '../assets/matty-medium.png'
import matty1Sad from '../assets/matty-sad.png'
import matty2Happy from '../assets/matty2-happy.png'
import matty2Medium from '../assets/matty2-medium.png'
import matty2Sad from '../assets/matty2-sad.png'

// Bounding box drawn generously around the UK so the whole country fits.
const UK_BOUNDS = new LatLngBounds([49.7, -9.0], [61.1, 2.2])
const UK_CENTER: [number, number] = [54.5, -3.2]

// CSS-styled pins (divIcons) — no external image assets, fully themeable.
const guessIcon = divIcon({
  className: 'pin-wrap',
  html: '<div class="pin pin-guess"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})
// Matty himself marks where the place actually was — his expression reflects
// how close the guess landed (happy = nailed it, sad = miles off).
type Mood = 'happy' | 'medium' | 'sad'
// Two interchangeable Mattys — which one is hiding is picked per reveal.
const MATTY_SRC: Record<'a' | 'b', Record<Mood, string>> = {
  a: { happy: matty1Happy, medium: matty1Medium, sad: matty1Sad },
  b: { happy: matty2Happy, medium: matty2Medium, sad: matty2Sad },
}
// Pseudo-random pick that's stable for a given reveal (so it doesn't flicker
// on re-render) but varies play to play.
function pickMatty(r: RoundResult): 'a' | 'b' {
  const seed = Math.round(
    Math.abs((r.guessLat + r.location.lat) * 1000 + (r.guessLng + r.location.lng) * 1000),
  )
  return seed % 2 === 0 ? 'a' : 'b'
}
function mattyIcon(mood: Mood, who: 'a' | 'b') {
  return divIcon({
    className: 'matty-wrap',
    html: `<div class="matty-marker"><img src="${MATTY_SRC[who][mood]}" alt="Matty" draggable="false" /></div>`,
    iconSize: [54, 54],
    iconAnchor: [27, 27],
  })
}

interface Props {
  /** Whether the player can still place/move a pin this round. */
  active: boolean
  /** Latest revealed result for the round, or null before submission. */
  revealed: RoundResult | null
  onPinChange: (lat: number, lng: number) => void
}

function ClickHandler({
  disabled,
  onPick,
}: {
  disabled: boolean
  onPick: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      if (disabled) return
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// When a round is revealed, ease the map to frame both points.
function FitToReveal({ revealed }: { revealed: RoundResult | null }) {
  const map = useMap()
  useEffect(() => {
    if (!revealed) return
    const bounds = new LatLngBounds(
      [revealed.location.lat, revealed.location.lng],
      [revealed.guessLat, revealed.guessLng],
    )
    map.flyToBounds(bounds, { padding: [70, 70], maxZoom: 9, duration: 0.8 })
  }, [revealed, map])
  return null
}

export default function MapBoard({ active, revealed, onPinChange }: Props) {
  const [pin, setPin] = useState<[number, number] | null>(null)

  // Clear the pin when a fresh round begins.
  useEffect(() => {
    if (active && !revealed) setPin(null)
  }, [active, revealed])

  function handlePick(lat: number, lng: number) {
    setPin([lat, lng])
    onPinChange(lat, lng)
  }

  return (
    <MapContainer
      center={UK_CENTER}
      zoom={5}
      minZoom={5}
      maxZoom={17}
      maxBounds={UK_BOUNDS}
      maxBoundsViscosity={0.9}
      className="map"
      attributionControl={false}
      zoomControl={false}
    >
      {/* Plain satellite imagery — no labels, roads, or place names. */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={18}
      />
      <ClickHandler disabled={!active || !!revealed} onPick={handlePick} />
      <FitToReveal revealed={revealed} />

      {pin && <Marker position={pin} icon={guessIcon} interactive={false} />}

      {revealed && (
        <>
          <Polyline
            positions={[
              [revealed.guessLat, revealed.guessLng],
              [revealed.location.lat, revealed.location.lng],
            ]}
            pathOptions={{ color: '#f8fafc', weight: 2, dashArray: '4 8', opacity: 0.9 }}
          >
            <Tooltip permanent direction="center" className="dist-tip">
              {formatMiles(revealed.distanceMiles)}
            </Tooltip>
          </Polyline>
          <Marker
            position={[revealed.location.lat, revealed.location.lng]}
            icon={mattyIcon(milesTier(revealed.distanceMiles).mood, pickMatty(revealed))}
            interactive={false}
          >
            <Tooltip permanent direction="top" className="target-tip" offset={[0, -30]}>
              Matty was in {revealed.location.name}
            </Tooltip>
          </Marker>
        </>
      )}
    </MapContainer>
  )
}
