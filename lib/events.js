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
  const imageUrl = e.images?.find(i => i.ratio === '16_9' && i.width > 500)?.url || null;
  const genre = e.classifications?.[0]?.genre?.name || 'Electronic';
  const subGenre = e.classifications?.[0]?.subGenre?.name || '';
  const startDate = e.dates?.start?.localDate || '';
  const startTime = e.dates?.start?.localTime
    ? formatTime(e.dates.start.localTime)
    : '';

  return {
    id: e.id,
    title: e.name,
    artist,
    artistId: attraction?.id || null,
    date: startDate,
    time: startTime,
    venue: venueName,
    city,
    state: stateCode,
    genre: normalizeGenre(genre, subGenre),
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

function normalizeGenre(genre, subGenre) {
  const g = (genre + ' ' + subGenre).toLowerCase();
  if (g.includes('house') || g.includes('tech house')) return 'House';
  if (g.includes('techno')) return 'Techno';
  if (g.includes('trance')) return 'Trance';
  if (g.includes('drum') || g.includes('bass') || g.includes('dnb')) return 'Drum & Bass';
  if (g.includes('dubstep') || g.includes('riddim')) return 'Bass Music';
  if (g.includes('hardstyle') || g.includes('hard dance')) return 'Hardstyle';
  if (g.includes('electronic') || g.includes('edm') || g.includes('dance')) return 'Festival EDM';
  return genre || 'Electronic';
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

  return data._embedded.attractions.map(a => ({
    id: a.id,
    name: a.name,
    genre: a.classifications?.[0]?.genre?.name || 'Electronic',
    origin: null,
    followers: a.upcomingEvents?.ticketmaster || 0,
    imageUrl: a.images?.find(i => i.ratio === '16_9')?.url || null,
    url: a.url,
  }));
}

export async function getEventsByCity(city, state) {
  return searchEvents({ city, state });
}

export async function getUpcomingFestivals(state = '') {
  return searchEvents({ genre: 'Festival EDM', state });
}
