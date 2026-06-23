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
  { id: 'birmingham', name: 'Birmingham', lat: 52.4862, lng: -1.8904, category: 'city', difficulty: 1 },
  { id: 'glasgow', name: 'Glasgow', lat: 55.8642, lng: -4.2518, category: 'city', difficulty: 1 },
  { id: 'liverpool', name: 'Liverpool', lat: 53.4084, lng: -2.9916, category: 'city', difficulty: 1 },
  { id: 'bristol', name: 'Bristol', lat: 51.4545, lng: -2.5879, category: 'city', difficulty: 1 },
  { id: 'leeds', name: 'Leeds', lat: 53.8008, lng: -1.5491, category: 'city', difficulty: 1 },
  { id: 'newcastle', name: 'Newcastle upon Tyne', lat: 54.9783, lng: -1.6178, category: 'city', difficulty: 1 },
  { id: 'sheffield', name: 'Sheffield', lat: 53.3811, lng: -1.4701, category: 'city', difficulty: 1 },
  { id: 'nottingham', name: 'Nottingham', lat: 52.9548, lng: -1.1581, category: 'city', difficulty: 1 },
  { id: 'oxford', name: 'Oxford', lat: 51.7520, lng: -1.2577, category: 'city', difficulty: 1 },
  { id: 'cambridge', name: 'Cambridge', lat: 52.2053, lng: 0.1218, category: 'city', difficulty: 1 },
  { id: 'stonehenge', name: 'Stonehenge', lat: 51.1789, lng: -1.8262, category: 'landmark', difficulty: 1 },
  { id: 'brighton', name: 'Brighton', lat: 50.8225, lng: -0.1372, category: 'city', difficulty: 1 },
  { id: 'dover', name: 'Dover', lat: 51.1295, lng: 1.3089, category: 'landmark', difficulty: 1 },
  { id: 'windsor', name: 'Windsor', lat: 51.4839, lng: -0.6044, category: 'landmark', difficulty: 1 },
  { id: 'bigben', name: 'Big Ben', lat: 51.5007, lng: -0.1246, category: 'landmark', difficulty: 1 },

  // --- Difficulty 2: well-known cities & sights ---
  { id: 'snowdon', name: 'Snowdon (Yr Wyddfa)', lat: 53.0685, lng: -4.0763, category: 'nature', difficulty: 2 },
  { id: 'swansea', name: 'Swansea', lat: 51.6214, lng: -3.9436, category: 'city', difficulty: 2 },
  { id: 'aberdeen', name: 'Aberdeen', lat: 57.1497, lng: -2.0943, category: 'city', difficulty: 2 },
  { id: 'dundee', name: 'Dundee', lat: 56.4620, lng: -2.9707, category: 'city', difficulty: 2 },
  { id: 'inverness', name: 'Inverness', lat: 57.4778, lng: -4.2247, category: 'city', difficulty: 2 },
  { id: 'bath', name: 'Bath', lat: 51.3811, lng: -2.3590, category: 'city', difficulty: 2 },
  { id: 'york', name: 'York', lat: 53.9600, lng: -1.0873, category: 'city', difficulty: 2 },
  { id: 'chester', name: 'Chester', lat: 53.1934, lng: -2.8931, category: 'city', difficulty: 2 },
  { id: 'canterbury', name: 'Canterbury', lat: 51.2802, lng: 1.0789, category: 'history', difficulty: 2 },
  { id: 'stratford', name: 'Stratford-upon-Avon', lat: 52.1917, lng: -1.7073, category: 'history', difficulty: 2 },
  { id: 'plymouth', name: 'Plymouth', lat: 50.3755, lng: -4.1427, category: 'city', difficulty: 2 },
  { id: 'southampton', name: 'Southampton', lat: 50.9097, lng: -1.4044, category: 'city', difficulty: 2 },
  { id: 'portsmouth', name: 'Portsmouth', lat: 50.8198, lng: -1.0880, category: 'city', difficulty: 2 },
  { id: 'leicester', name: 'Leicester', lat: 52.6369, lng: -1.1398, category: 'city', difficulty: 2 },
  { id: 'derry', name: 'Derry / Londonderry', lat: 54.9966, lng: -7.3086, category: 'city', difficulty: 2 },
  { id: 'lochlomond', name: 'Loch Lomond', lat: 56.1037, lng: -4.6308, category: 'nature', difficulty: 2 },
  { id: 'giantscauseway', name: "Giant's Causeway", lat: 55.2408, lng: -6.5116, category: 'nature', difficulty: 2 },
  { id: 'lakedistrict', name: 'Windermere', lat: 54.3807, lng: -2.9063, category: 'nature', difficulty: 2 },
  { id: 'stirling', name: 'Stirling', lat: 56.1165, lng: -3.9369, category: 'city', difficulty: 2 },
  { id: 'norwich', name: 'Norwich', lat: 52.6309, lng: 1.2974, category: 'city', difficulty: 2 },

  // --- Difficulty 3: regional cities & notable places ---
  { id: 'bennevis', name: 'Ben Nevis', lat: 56.7969, lng: -5.0036, category: 'nature', difficulty: 3 },
  { id: 'lochness', name: 'Loch Ness', lat: 57.3229, lng: -4.4244, category: 'nature', difficulty: 3 },
  { id: 'aberystwyth', name: 'Aberystwyth', lat: 52.4153, lng: -4.0829, category: 'city', difficulty: 3 },
  { id: 'hastings', name: 'Hastings', lat: 50.8543, lng: 0.5735, category: 'history', difficulty: 3 },
  { id: 'exeter', name: 'Exeter', lat: 50.7184, lng: -3.5339, category: 'city', difficulty: 3 },
  { id: 'lincoln', name: 'Lincoln', lat: 53.2307, lng: -0.5406, category: 'city', difficulty: 3 },
  { id: 'durham', name: 'Durham', lat: 54.7761, lng: -1.5733, category: 'city', difficulty: 3 },
  { id: 'perth', name: 'Perth', lat: 56.3950, lng: -3.4308, category: 'city', difficulty: 3 },
  { id: 'wrexham', name: 'Wrexham', lat: 53.0466, lng: -2.9931, category: 'city', difficulty: 3 },
  { id: 'bangor', name: 'Bangor', lat: 53.2274, lng: -4.1294, category: 'city', difficulty: 3 },
  { id: 'scarborough', name: 'Scarborough', lat: 54.2830, lng: -0.3990, category: 'city', difficulty: 3 },
  { id: 'blackpool', name: 'Blackpool', lat: 53.8175, lng: -3.0357, category: 'city', difficulty: 3 },
  { id: 'fortwilliam', name: 'Fort William', lat: 56.8198, lng: -5.1052, category: 'city', difficulty: 3 },
  { id: 'conwy', name: 'Conwy', lat: 53.2800, lng: -3.8261, category: 'history', difficulty: 3 },
  { id: 'caernarfon', name: 'Caernarfon', lat: 53.1407, lng: -4.2766, category: 'history', difficulty: 3 },
  { id: 'salisbury', name: 'Salisbury', lat: 51.0688, lng: -1.7945, category: 'city', difficulty: 3 },
  { id: 'cheddar', name: 'Cheddar Gorge', lat: 51.2811, lng: -2.7649, category: 'nature', difficulty: 3 },
  { id: 'armagh', name: 'Armagh', lat: 54.3503, lng: -6.6528, category: 'city', difficulty: 3 },
  { id: 'galloway', name: 'Dumfries', lat: 55.0701, lng: -3.6053, category: 'city', difficulty: 3 },
  { id: 'matlock', name: 'Matlock', lat: 53.1389, lng: -1.5557, category: 'city', difficulty: 3 },

  // --- Difficulty 4: trickier towns, history & geography ---
  { id: 'cromer', name: 'Cromer', lat: 52.9319, lng: 1.3026, category: 'city', difficulty: 4 },
  { id: 'lindisfarne', name: 'Lindisfarne (Holy Island)', lat: 55.6800, lng: -1.8030, category: 'island', difficulty: 4 },
  { id: 'culloden', name: 'Culloden', lat: 57.4778, lng: -4.0939, category: 'history', difficulty: 4 },
  { id: 'tintagel', name: 'Tintagel', lat: 50.6682, lng: -4.7593, category: 'history', difficulty: 4 },
  { id: 'stdavids', name: 'St Davids', lat: 51.8819, lng: -5.2660, category: 'city', difficulty: 4 },
  { id: 'whitby', name: 'Whitby', lat: 54.4858, lng: -0.6206, category: 'city', difficulty: 4 },
  { id: 'gretna', name: 'Gretna Green', lat: 54.9967, lng: -3.0676, category: 'history', difficulty: 4 },
  { id: 'oban', name: 'Oban', lat: 56.4152, lng: -5.4719, category: 'city', difficulty: 4 },
  { id: 'harlech', name: 'Harlech', lat: 52.8600, lng: -4.1090, category: 'history', difficulty: 4 },
  { id: 'tenby', name: 'Tenby', lat: 51.6727, lng: -4.7026, category: 'city', difficulty: 4 },
  { id: 'wells', name: 'Wells', lat: 51.2092, lng: -2.6470, category: 'history', difficulty: 4 },
  { id: 'glastonbury', name: 'Glastonbury Tor', lat: 51.1442, lng: -2.6987, category: 'history', difficulty: 4 },
  { id: 'lyme', name: 'Lyme Regis', lat: 50.7256, lng: -2.9365, category: 'nature', difficulty: 4 },
  { id: 'dunnottar', name: 'Dunnottar Castle', lat: 56.9461, lng: -2.1972, category: 'history', difficulty: 4 },
  { id: 'enniskillen', name: 'Enniskillen', lat: 54.3438, lng: -7.6315, category: 'city', difficulty: 4 },
  { id: 'beaumaris', name: 'Beaumaris', lat: 53.2643, lng: -4.0911, category: 'history', difficulty: 4 },
  { id: 'eyemouth', name: 'Eyemouth', lat: 55.8722, lng: -2.0903, category: 'city', difficulty: 4 },
  { id: 'thurso', name: 'Thurso', lat: 58.5936, lng: -3.5223, category: 'city', difficulty: 4 },
  { id: 'kielder', name: 'Kielder Water', lat: 55.1900, lng: -2.5900, category: 'nature', difficulty: 4 },
  { id: 'malham', name: 'Malham Cove', lat: 54.0726, lng: -2.1547, category: 'nature', difficulty: 4 },

  // --- Difficulty 5: obscure / remote ---
  { id: 'johnogroats', name: "John o' Groats", lat: 58.6373, lng: -3.0689, category: 'landmark', difficulty: 5 },
  { id: 'landsend', name: "Land's End", lat: 50.0657, lng: -5.7132, category: 'landmark', difficulty: 5 },
  { id: 'stornoway', name: 'Stornoway', lat: 58.2090, lng: -6.3890, category: 'island', difficulty: 5 },
  { id: 'kirkwall', name: 'Kirkwall', lat: 58.9810, lng: -2.9605, category: 'island', difficulty: 5 },
  { id: 'lerwick', name: 'Lerwick', lat: 60.1551, lng: -1.1494, category: 'island', difficulty: 5 },
  { id: 'fishguard', name: 'Fishguard', lat: 51.9939, lng: -4.9772, category: 'city', difficulty: 5 },
  { id: 'eigg', name: 'Isle of Eigg', lat: 56.9094, lng: -6.1364, category: 'island', difficulty: 5 },
  { id: 'berwick', name: 'Berwick-upon-Tweed', lat: 55.7708, lng: -2.0050, category: 'city', difficulty: 5 },
  { id: 'tobermory', name: 'Tobermory', lat: 56.6230, lng: -6.0689, category: 'island', difficulty: 5 },
  { id: 'portree', name: 'Portree', lat: 57.4125, lng: -6.1956, category: 'island', difficulty: 5 },
  { id: 'ullapool', name: 'Ullapool', lat: 57.8959, lng: -5.1591, category: 'city', difficulty: 5 },
  { id: 'durness', name: 'Durness', lat: 58.5672, lng: -4.7461, category: 'nature', difficulty: 5 },
  { id: 'barra', name: 'Castlebay (Barra)', lat: 56.9544, lng: -7.4889, category: 'island', difficulty: 5 },
  { id: 'stmarys', name: "St Mary's (Isles of Scilly)", lat: 49.9145, lng: -6.3000, category: 'island', difficulty: 5 },
  { id: 'aberdaron', name: 'Aberdaron', lat: 52.8050, lng: -4.7110, category: 'island', difficulty: 5 },
  { id: 'staffa', name: 'Isle of Staffa', lat: 56.4319, lng: -6.3417, category: 'island', difficulty: 5 },
  { id: 'capewrath', name: 'Cape Wrath', lat: 58.6258, lng: -4.9981, category: 'landmark', difficulty: 5 },
  { id: 'rathlin', name: 'Rathlin Island', lat: 55.2960, lng: -6.1990, category: 'island', difficulty: 5 },
  { id: 'foula', name: 'Foula', lat: 60.1306, lng: -2.0556, category: 'island', difficulty: 5 },
  { id: 'lochinver', name: 'Lochinver', lat: 58.1469, lng: -5.2469, category: 'nature', difficulty: 5 },
]

export function locationById(id: string): UKLocation | undefined {
  return LOCATIONS.find((l) => l.id === id)
}
