// UKTap location dataset.
// Each location is a real point in the United Kingdom that the player must pin on the map.
// The player is simply shown the `name` and must find it; `difficulty`
// (1 = easy/famous, 5 = obscure) orders a daily puzzle from easy to hard.

export interface UKLocation {
  id: string
  name: string
  lat: number
  lng: number
  category: 'city' | 'landmark' | 'history' | 'nature' | 'island'
  difficulty: 1 | 2 | 3 | 4 | 5
}

export const LOCATIONS: UKLocation[] = [
  // --- Difficulty 1: household-name cities & landmarks ---
  { id: 'london', name: 'London', lat: 51.5074, lng: -0.1278, category: 'city', difficulty: 1 },
  { id: 'edinburgh', name: 'Edinburgh', lat: 55.9533, lng: -3.1883, category: 'city', difficulty: 1 },
  { id: 'cardiff', name: 'Cardiff', lat: 51.4816, lng: -3.1791, category: 'city', difficulty: 1 },
  { id: 'belfast', name: 'Belfast', lat: 54.5973, lng: -5.9301, category: 'city', difficulty: 1 },
  { id: 'manchester', name: 'Manchester', lat: 53.4808, lng: -2.2426, category: 'city', difficulty: 1 },

  // --- Difficulty 2: well-known cities & sights ---
  { id: 'stonehenge', name: 'Stonehenge', lat: 51.1789, lng: -1.8262, category: 'landmark', difficulty: 2 },
  { id: 'liverpool', name: 'Liverpool', lat: 53.4084, lng: -2.9916, category: 'city', difficulty: 2 },
  { id: 'glasgow', name: 'Glasgow', lat: 55.8642, lng: -4.2518, category: 'city', difficulty: 2 },
  { id: 'birmingham', name: 'Birmingham', lat: 52.4862, lng: -1.8904, category: 'city', difficulty: 2 },
  { id: 'oxford', name: 'Oxford', lat: 51.7520, lng: -1.2577, category: 'city', difficulty: 2 },
  { id: 'snowdon', name: 'Snowdon (Yr Wyddfa)', lat: 53.0685, lng: -4.0763, category: 'nature', difficulty: 2 },

  // --- Difficulty 3: regional cities & notable places ---
  { id: 'newcastle', name: 'Newcastle upon Tyne', lat: 54.9783, lng: -1.6178, category: 'city', difficulty: 3 },
  { id: 'bristol', name: 'Bristol', lat: 51.4545, lng: -2.5879, category: 'city', difficulty: 3 },
  { id: 'york', name: 'York', lat: 53.9600, lng: -1.0873, category: 'city', difficulty: 3 },
  { id: 'bennevis', name: 'Ben Nevis', lat: 56.7969, lng: -5.0036, category: 'nature', difficulty: 3 },
  { id: 'lochness', name: 'Loch Ness', lat: 57.3229, lng: -4.4244, category: 'nature', difficulty: 3 },
  { id: 'aberystwyth', name: 'Aberystwyth', lat: 52.4153, lng: -4.0829, category: 'city', difficulty: 3 },
  { id: 'hastings', name: 'Hastings', lat: 50.8543, lng: 0.5735, category: 'history', difficulty: 3 },

  // --- Difficulty 4: trickier towns, history & geography ---
  { id: 'cromer', name: 'Cromer', lat: 52.9319, lng: 1.3026, category: 'city', difficulty: 4 },
  { id: 'lindisfarne', name: 'Lindisfarne (Holy Island)', lat: 55.6800, lng: -1.8030, category: 'island', difficulty: 4 },
  { id: 'culloden', name: 'Culloden', lat: 57.4778, lng: -4.0939, category: 'history', difficulty: 4 },
  { id: 'tintagel', name: 'Tintagel', lat: 50.6682, lng: -4.7593, category: 'history', difficulty: 4 },
  { id: 'stdavids', name: 'St Davids', lat: 51.8819, lng: -5.2660, category: 'city', difficulty: 4 },
  { id: 'whitby', name: 'Whitby', lat: 54.4858, lng: -0.6206, category: 'city', difficulty: 4 },
  { id: 'gretna', name: 'Gretna Green', lat: 54.9967, lng: -3.0676, category: 'history', difficulty: 4 },

  // --- Difficulty 5: obscure / remote ---
  { id: 'johnogroats', name: "John o' Groats", lat: 58.6373, lng: -3.0689, category: 'landmark', difficulty: 5 },
  { id: 'landsend', name: "Land's End", lat: 50.0657, lng: -5.7132, category: 'landmark', difficulty: 5 },
  { id: 'stornoway', name: 'Stornoway', lat: 58.2090, lng: -6.3890, category: 'island', difficulty: 5 },
  { id: 'kirkwall', name: 'Kirkwall', lat: 58.9810, lng: -2.9605, category: 'island', difficulty: 5 },
  { id: 'lerwick', name: 'Lerwick', lat: 60.1551, lng: -1.1494, category: 'island', difficulty: 5 },
  { id: 'fishguard', name: 'Fishguard', lat: 51.9939, lng: -4.9772, category: 'city', difficulty: 5 },
  { id: 'eigg', name: 'Isle of Eigg', lat: 56.9094, lng: -6.1364, category: 'island', difficulty: 5 },
  { id: 'berwick', name: 'Berwick-upon-Tweed', lat: 55.7708, lng: -2.0050, category: 'city', difficulty: 5 },
]

export function locationById(id: string): UKLocation | undefined {
  return LOCATIONS.find((l) => l.id === id)
}
