import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { searchEvents } from '../lib/events';
import EventCard from '../components/EventCard';
import { US_STATES } from '../lib/constants';
import styles from './festivals.module.css';

const MAJOR_FESTIVALS = [
  { name: 'EDC Las Vegas', keyword: 'EDC Las Vegas', state: 'NV', month: 'May' },
  { name: 'Electric Forest', keyword: 'Electric Forest', state: 'MI', month: 'Jun' },
  { name: 'Lost Lands', keyword: 'Lost Lands', state: 'OH', month: 'Sep' },
  { name: 'Forbidden Kingdom', keyword: 'Forbidden Kingdom', state: 'FL', month: 'May' },
  { name: 'Imagine', keyword: 'Imagine Music Festival', state: 'GA', month: 'Sep' },
  { name: 'Nocturnal Wonderland', keyword: 'Nocturnal Wonderland', state: 'CA', month: 'Sep' },
  { name: 'Beyond Wonderland', keyword: 'Beyond Wonderland', state: 'CA', month: 'Mar' },
  { name: 'Dreamstate', keyword: 'Dreamstate', state: 'CA', month: 'Nov' },
  { name: 'Lights All Night', keyword: 'Lights All Night', state: 'TX', month: 'Dec' },
  { name: 'Freaky Deaky', keyword: 'Freaky Deaky', state: 'TX', month: 'Oct' },
  { name: 'Ubbi Dubbi', keyword: 'Ubbi Dubbi', state: 'TX', month: 'Apr' },
  { name: 'Spring Awakening', keyword: 'Spring Awakening', state: 'IL', month: 'Jun' },
];

export default function FestivalsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState('');
  const [activeFestival, setActiveFestival] = useState('');

  useEffect(() => {
    loadFestivals('', '');
  }, []);

  async function loadFestivals(keyword, state) {
    setLoading(true);
    try {
      const results = await searchEvents({
        query: keyword || 'festival',
        state,
      });
      setEvents(results);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  function handleStateChange(e) {
    setStateFilter(e.target.value);
    setActiveFestival('');
    loadFestivals('festival', e.target.value);
  }

  function handleFestivalClick(festival) {
    setActiveFestival(festival.name);
    setStateFilter('');
    loadFestivals(festival.keyword, festival.state);
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
            <p className={styles.sub}>Browse major festivals and find tickets.</p>
          </div>

          {/* Quick festival picks */}
          <div className={styles.festGrid}>
            {MAJOR_FESTIVALS.map(f => (
              <button
                key={f.name}
                className={`${styles.festChip} ${activeFestival === f.name ? styles.festChipActive : ''}`}
                onClick={() => handleFestivalClick(f)}
              >
                <span className={styles.festName}>{f.name}</span>
                <span className={styles.festMeta}>{f.month} · {f.state}</span>
              </button>
            ))}
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
            {(stateFilter || activeFestival) && (
              <button className={styles.clearBtn} onClick={() => {
                setStateFilter('');
                setActiveFestival('');
                loadFestivals('', '');
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
