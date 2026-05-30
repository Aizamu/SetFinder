import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { searchFestivals } from '../lib/events';
import EventCard from '../components/EventCard';
import { US_STATES } from '../lib/constants';
import styles from './festivals.module.css';

export default function FestivalsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState('');

  useEffect(() => {
    loadFestivals('');
  }, []);

  async function loadFestivals(state) {
    setLoading(true);
    try {
      const results = await searchFestivals(state);
      setEvents(results);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  function handleStateChange(e) {
    setStateFilter(e.target.value);
    loadFestivals(e.target.value);
  }

  return (
    <>
      <Head>
        <title>EDM Festivals — SetFinder</title>
        <meta name="description" content="Browse upcoming EDM festivals across the US. Find lineups, dates, and tickets." />
      </Head>

      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={styles.title}>US EDM Festivals</h1>
            <p className={styles.sub}>Browse upcoming festivals and find tickets.</p>
          </div>

          {/* State filter */}
          <div className={styles.filterRow}>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Filter by State</label>
              <select value={stateFilter} onChange={handleStateChange}>
                <option value="">All States</option>
                {US_STATES.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
            {stateFilter && (
              <button className={styles.clearBtn} onClick={() => {
                setStateFilter('');
                loadFestivals('');
              }}>Clear</button>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className={styles.loading}><div className={styles.spinner} /></div>
          ) : events.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>◈</div>
              <h3>No festivals found</h3>
              <p>Try a different state or browse all events.</p>
              <Link href="/events" className={styles.eventsLink}>Browse All Events →</Link>
            </div>
          ) : (
            <>
              <div className={styles.resultCount}>{events.length} festival{events.length !== 1 ? 's' : ''} found</div>
              <div className={styles.list}>
                {events.map((event, i) => (
                  <div key={event.id} style={{ animationDelay: `${i * 0.04}s` }}>
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
