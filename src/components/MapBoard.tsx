import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polyline,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import { LatLngBounds } from 'leaflet'
import type { RoundResult } from '../lib/game'
import { formatDistance } from '../lib/game'

// Bounding box drawn generously around the UK so the whole country fits.
const UK_BOUNDS = new LatLngBounds([49.7, -9.0], [61.1, 2.2])
const UK_CENTER: [number, number] = [54.5, -3.2]

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
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 9, animate: true })
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
      maxZoom={12}
      maxBounds={UK_BOUNDS}
      maxBoundsViscosity={0.9}
      className="map"
      attributionControl
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ClickHandler disabled={!active || !!revealed} onPick={handlePick} />
      <FitToReveal revealed={revealed} />

      {pin && (
        <CircleMarker
          center={pin}
          radius={8}
          pathOptions={{ color: '#1d4ed8', fillColor: '#3b82f6', fillOpacity: 0.9 }}
        >
          <Tooltip permanent direction="top">Your guess</Tooltip>
        </CircleMarker>
      )}

      {revealed && (
        <>
          <CircleMarker
            center={[revealed.location.lat, revealed.location.lng]}
            radius={8}
            pathOptions={{ color: '#b91c1c', fillColor: '#ef4444', fillOpacity: 0.9 }}
          >
            <Tooltip permanent direction="top">{revealed.location.name}</Tooltip>
          </CircleMarker>
          <Polyline
            positions={[
              [revealed.guessLat, revealed.guessLng],
              [revealed.location.lat, revealed.location.lng],
            ]}
            pathOptions={{ color: '#64748b', dashArray: '6 8' }}
          >
            <Tooltip permanent direction="center">
              {formatDistance(revealed.distanceKm)}
            </Tooltip>
          </Polyline>
        </>
      )}
    </MapContainer>
  )
}
