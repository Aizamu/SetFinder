import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import EventCard from '../components/EventCard';
import FilterBar from '../components/FilterBar';
import { searchEvents } from '../lib/events';
import styles from './events.module.css';

export default function EventsPage() {
  const router = useRouter();
  const { q, state, city, genre, dateFrom } = router.query;

  const [filters, setFilters] = useState({
    state: '', city: '', genre: 'All Genres', dateFrom: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync URL → state and run search in one effect to avoid double-fire
  useEffect(() => {
    if (!router.isReady) return;
    const newFilters = {
      state: state || '',
      city: city || '',
      genre: genre || 'All Genres',
      dateFrom: dateFrom || '',
    };
    const newQuery = q || '';
    setFilters(newFilters);
    setSearchQuery(newQuery);
    setLoading(true);
    searchEvents({
      query: newQuery,
      state: newFilters.state,
      city: newFilters.city,
      genre: newFilters.genre,
      dateFrom: newFilters.dateFrom,
    }).then(results => {
      setEvents(results);
    }).catch(err => {
      console.error('Search failed:', err);
      setEvents([]);
    }).finally(() => {
      setLoading(false);
    });
  }, [router.isReady, q, state, city, genre, dateFrom]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (newFilters.state) params.set('state', newFilters.state);
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.genre !== 'All Genres') params.set('genre', newFilters.genre);
    if (newFilters.dateFrom) params.set('dateFrom', newFilters.dateFrom);
    router.replace(`/events?${params.toString()}`, undefined, { shallow: true });
  }

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.state) params.set('state', filters.state);
    if (filters.city) params.set('city', filters.city);
    if (filters.genre !== 'All Genres') params.set('genre', filters.genre);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    router.push(`/events?${params.toString()}`);
  }

  const activeFilters = [
    filters.state && `State: ${filters.state}`,
    filters.city && `City: ${filters.city}`,
    filters.genre !== 'All Genres' && filters.genre,
    filters.dateFrom && `From: ${filters.dateFrom}`,
  ].filter(Boolean);

  return (
    <>
      <Head>
        <title>EDM Events — SetFinder</title>
        <meta name="description" content="Browse upcoming EDM events, raves, and festivals across the US. Filter by state, city, and genre." />
      </Head>

      <div className={styles.page}>
        <div className={styles.inner}>

          {/* Header + search */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                {searchQuery ? `Results for "${searchQuery}"` : 'Upcoming Events'}
              </h1>
              {activeFilters.length > 0 && (
                <div className={styles.activeTags}>
                  {activeFilters.map(f => (
                    <span key={f} className={styles.activeTag}>{f}</span>
                  ))}
                </div>
              )}
            </div>

            <form className={styles.inlineSearch} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search artist or festival..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className={styles.searchBtn}>Search</button>
            </form>
          </div>

          {/* Filters */}
          <FilterBar filters={filters} onChange={handleFilterChange} />

          {/* Results */}
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <span>Finding events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>◈</div>
              <h3>No events found</h3>
              <p>Try adjusting your filters or search for a specific artist.</p>
            </div>
          ) : (
            <>
              <div className={styles.resultCount}>
                {events.length} event{events.length !== 1 ? 's' : ''} found
              </div>
              <div className={styles.eventList}>
                {events.map((event, i) => (
                  <div key={event.id} style={{ animationDelay: `${i * 0.05}s` }}>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
