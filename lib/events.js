/**
 * SetFinder — Event Data Layer
 * Powered by Ticketmaster Discovery API
 * API Key: stored in TICKETMASTER_API_KEY env var
 */

const TM_KEY = process.env.TICKETMASTER_API_KEY || 'GLdhJtSnxYozUD97JnxmjmiEBzhm7mAq';
const TM_BASE = 'https://app.ticketmaster.com/discovery/v2';

// Genre segment/genre IDs for EDM filtering on Ticketmaster
const EDM_GENRE_MAP = {
  'House':         { segmentId: 'KZFzniwnSyZfZ7v7nJ', genreId: 'KnvZfZ7vAvF' },
  'Techno':        { segmentId: 'KZFzniwnSyZfZ7v7nJ', genreId: 'KnvZfZ7vAvd' },
  'Trance':        { segmentId: 'KZFzniwnSyZfZ7v7nJ', genreId: 'KnvZfZ7vAve' },
  'Drum & Bass':   { segmentId: 'KZFzniwnSyZfZ7v7nJ', genreId: 'KnvZfZ7vAvt' },
  'Bass Music':    { segmentId: 'KZFzniwnSyZfZ7v7nJ', genreId: 'KnvZfZ7vAvF' },
  'Festival EDM':  { segmentId: 'KZFzniwnSyZfZ7v7nJ', genreId: 'KnvZfZ7vAeA' },
  'Electronic':    { segmentId: 'KZFzniwnSyZfZ7v7nJ' },
};

// ─── Map Ticketmaster event → SetFinder event shape ──────────────────────────

function mapTMEvent(e) {
  const venue = e._embedded?.venues?.[0];
  const city = venue?.city?.name || '';
  const stateCode = venue?.state?.stateCode || '';
  const venueName = venue?.name || '';
  const attraction = e._embedded?.attractions?.[0];
  const artist = attraction?.name || e.name || '';
  const lineup = (e._embedded?.attractions || []).map(a => a.name).filter(Boolean);
  const lineupImages = (e._embedded?.attractions || []).map(a => {
    const realImages = (a.images || []).filter(i => !i.fallback);
    return (realImages.find(i => i.ratio === '3_2') || realImages.find(i => i.ratio === '16_9'))?.url || null;
  }).filter(Boolean);
  const imageUrl = e.images?.find(i => i.ratio === '16_9' && i.width > 500)?.url || null;
  const genre = e.classifications?.[0]?.genre?.name || 'Electronic';
  const subGenre = e.classifications?.[0]?.subGenre?.name || '';
  const artistNameForGenre = attraction?.name || '';
  const startDate = e.dates?.start?.localDate || '';
  const startTime = e.dates?.start?.localTime
    ? formatTime(e.dates.start.localTime)
    : '';

  return {
    id: e.id,
    title: e.name,
    artist,
    lineup,
    lineupImages,
    artistId: attraction?.id || null,
    date: startDate,
    time: startTime,
    venue: venueName,
    city,
    state: stateCode,
    genre: normalizeGenre(genre, subGenre, artistNameForGenre),
    ticketUrl: e.url,
    imageUrl,
    ageRestriction: e.ageRestrictions?.legalAgeEnforced ? '18+' : null,
    festivalSize: null,
    afterParty: false,
    vibe: subGenre && subGenre !== genre ? subGenre : null,
    crowdRating: null,
    crowdReviews: 0,
    priceMin: e.priceRanges?.[0]?.min || null,
    priceMax: e.priceRanges?.[0]?.max || null,
  };
}

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

// Artist-level genre overrides — Ticketmaster classifications are often wrong
const ARTIST_GENRE_MAP = {
  // Melodic Bass / Melodic Dubstep
  'jason ross': 'Melodic Bass',
  'seven lions': 'Melodic Bass',
  'illenium': 'Melodic Bass',
  'trivecta': 'Melodic Bass',
  'sullivan king': 'Melodic Bass',
  'excision': 'Melodic Bass',
  'rezz': 'Melodic Bass',

  // Drum & Bass
  'sub focus': 'Drum & Bass',
  'goldie': 'Drum & Bass',
  'shy fx': 'Drum & Bass',
  'andy c': 'Drum & Bass',
  'chase & status': 'Drum & Bass',
  'dimension': 'Drum & Bass',
  'netsky': 'Drum & Bass',
  'high contrast': 'Drum & Bass',
  'london elektricity': 'Drum & Bass',
  'friction': 'Drum & Bass',
  'calyx & teebee': 'Drum & Bass',

  // Dubstep / Riddim
  'subtronics': 'Dubstep',
  'svdden death': 'Dubstep',
  'caspa': 'Dubstep',
  'rusko': 'Dubstep',
  'skrillex': 'Dubstep',
  'flux pavilion': 'Dubstep',
  'doctor p': 'Dubstep',

  // Techno
  'charlotte de witte': 'Techno',
  'amelie lens': 'Techno',
  'adam beyer': 'Techno',
  'bicep': 'Techno',
  'dax j': 'Techno',
  'hyde': 'Techno',
  'sara landry': 'Techno',
  'alignment': 'Techno',

  // Trance
  'armin van buuren': 'Trance',
  'tiesto': 'Trance',
  'paul van dyk': 'Trance',
  'above & beyond': 'Trance',
  'ferry corsten': 'Trance',
  'markus schulz': 'Trance',
  'aly & fila': 'Trance',
  'dash berlin': 'Trance',

  // Psytrance
  'blastoyz': 'Psytrance',
  'vini vici': 'Psytrance',
  'astrix': 'Psytrance',
  'infected mushroom': 'Psytrance',
  'captain hook': 'Psytrance',

  // Tech House
  'fisher': 'Tech House',
  'chris lake': 'Tech House',
  'john summit': 'Tech House',
  'jamie jones': 'Tech House',
  'green velvet': 'Tech House',
  'patrick topping': 'Tech House',
  'solardo': 'Tech House',

  // House
  'eric prydz': 'House',
  'disclosure': 'House',
  'peggy gou': 'House',
  'black coffee': 'House',
  'josh wink': 'House',

  // Hardstyle
  'headhunterz': 'Hardstyle',
  'brennan heart': 'Hardstyle',
  'da tweekaz': 'Hardstyle',
  'wildstylez': 'Hardstyle',
};

function normalizeGenre(genre, subGenre, artistName) {
  // Check artist override first — most accurate
  if (artistName) {
    const key = artistName.toLowerCase().trim();
    if (ARTIST_GENRE_MAP[key]) return ARTIST_GENRE_MAP[key];
  }

  const g = (genre + ' ' + subGenre).toLowerCase();

  // Specific subgenres first
  if (g.includes('psy') || g.includes('goa')) return 'Psytrance';
  if (g.includes('drum and bass') || g.includes('drum & bass') || g.includes('dnb') || g.includes('jungle')) return 'Drum & Bass';
  if (g.includes('dubstep') || g.includes('riddim') || g.includes('brostep')) return 'Dubstep';
  if (g.includes('hardstyle') || g.includes('hard dance') || g.includes('hardcore')) return 'Hardstyle';
  if (g.includes('melodic') || g.includes('future bass')) return 'Melodic Bass';
  if (g.includes('trance')) return 'Trance';
  if (g.includes('techno')) return 'Techno';
  if (g.includes('tech house')) return 'Tech House';
  if (g.includes('deep house')) return 'Deep House';
  if (g.includes('house')) return 'House';
  if (g.includes('breaks') || g.includes('breakbeat')) return 'Breaks';
  if (g.includes('ambient') || g.includes('downtempo') || g.includes('chillout')) return 'Ambient / Downtempo';

  return 'Electronic';
}

// ─── Core fetch with error handling ──────────────────────────────────────────

async function tmFetch(endpoint, params = {}) {
  const url = new URL(`${TM_BASE}${endpoint}`);
  url.searchParams.set('apikey', TM_KEY);
  url.searchParams.set('countryCode', 'US');
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, v);
    }
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      console.error(`TM API error ${res.status}: ${endpoint}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timeout);
    console.error(`TM fetch failed: ${err.message}`);
    return null;
  }
}

// ─── Public API functions ─────────────────────────────────────────────────────

export async function searchEvents({ query = '', state = '', city = '', genre = '', dateFrom = '' }) {
  const params = {
    size: 50,
    sort: 'date,asc',
    segmentName: 'Music',
    classificationName: 'Electronic',
  };

  if (query) params.keyword = query;
  if (state) params.stateCode = state;
  if (city) params.city = city;
  if (dateFrom) params.startDateTime = `${dateFrom}T00:00:00Z`;

  // Add genre filter if specific genre selected
  if (genre && genre !== 'All Genres' && EDM_GENRE_MAP[genre]) {
    params.classificationName = genre;
  }

  const data = await tmFetch('/events.json', params);
  if (!data?._embedded?.events) return [];

  return data._embedded.events.map(mapTMEvent);
}

export async function searchFestivals(state = '') {
  const params = {
    size: 50,
    sort: 'date,asc',
    segmentName: 'Music',
    keyword: 'festival',
  };
  if (state) params.stateCode = state;
  const data = await tmFetch('/events.json', params);
  if (!data?._embedded?.events) return [];
  return data._embedded.events.map(mapTMEvent);
}

export async function getDJEvents(artistId) {
  if (!artistId) return [];
  const data = await tmFetch('/events.json', {
    attractionId: artistId,
    size: 50,
    sort: 'date,asc',
  });
  if (!data?._embedded?.events) return [];
  return data._embedded.events.map(mapTMEvent);
}

export async function searchDJs(query) {
  if (!query) return [];
  const data = await tmFetch('/attractions.json', {
    keyword: query,
    classificationName: 'Electronic',
    size: 20,
  });
  if (!data?._embedded?.attractions) return [];

  return data._embedded.attractions.map(a => {
    const realImages = a.images?.filter(i => !i.fallback) || [];
    const imageUrl = (realImages.find(i => i.ratio === '3_2') || realImages.find(i => i.ratio === '16_9'))?.url || null;
    return {
      id: a.id,
      name: a.name,
      genre: a.classifications?.[0]?.genre?.name || 'Electronic',
      origin: null,
      followers: a.upcomingEvents?.ticketmaster || 0,
      imageUrl,
      url: a.url,
    };
  });
}

export async function getEventsByCity(city, state) {
  return searchEvents({ city, state });
}

export async function getUpcomingFestivals(state = '') {
  return searchEvents({ genre: 'Festival EDM', state });
}
