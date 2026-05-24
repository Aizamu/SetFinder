import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { searchDJs } from '../lib/events';
import styles from './djs.module.css';

const POPULAR_SEARCHES = [
  'Sub Focus', 'Eric Prydz', 'John Summit', 'Charlotte de Witte',
  'Subtronics', 'REZZ', 'Fisher', 'Armin van Buuren',
  'Goldie', 'Disclosure', 'Chris Lake', 'Amelie Lens',
];

export default function DJsPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [djs, setDjs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    searchDJs(query.trim()).then(results => {
      setDjs(results);
    }).catch(() => {
      setDjs([]);
    }).finally(() => {
      setLoading(false);
    });
  }

  function quickSearch(name) {
    setQuery(name);
    setLoading(true);
    setSearched(true);
    searchDJs(name).then(results => {
      setDjs(results);
    }).catch(() => {
      setDjs([]);
    }).finally(() => {
      setLoading(false);
    });
  }

  const genreColors = {
    'House': '#00c8ff', 'Tech House': '#00c8ff', 'Progressive House': '#00c8ff',
    'Techno': '#ff4545', 'Trance': '#a855f7', 'Bass Music': '#b3ff00',
    'Drum & Bass': '#ff8c00', 'Dubstep': '#00ff88', 'Electronic': '#888',
  };

  return (
    <>
      <Head>
        <title>Browse DJs — SetFinder</title>
        <meta name="description" content="Find any DJ and see all their upcoming US tour dates." />
      </Head>

      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={styles.title}>Browse DJs</h1>
            <p className={styles.sub}>Search any artist to see all their upcoming shows.</p>

            <form className={styles.search} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search a DJ or producer..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className={styles.searchBtn}>Search</button>
            </form>

            <div className={styles.popular}>
              <span className={styles.popularLabel}>Popular:</span>
              {POPULAR_SEARCHES.map(name => (
                <button key={name} className={styles.popularTag} onClick={() => quickSearch(name)}>
                  {name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}><div className={styles.spinner} /></div>
          ) : searched && djs.length === 0 ? (
            <div className={styles.empty}>
              <p>No artists found for "{query}". Try a different name.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {djs.map((dj, i) => (
                <button
                  key={dj.id}
                  className={styles.djCard}
                  style={{ animationDelay: `${i * 0.04}s` }}
                  onClick={() => router.push(`/events?q=${encodeURIComponent(dj.name)}`)}
                >
                  <div className={styles.avatar}>
                    {(dj.name || '??').slice(0, 2).toUpperCase()}
                  </div>
                  <div className={styles.djInfo}>
                    <div className={styles.djName}>{dj.name}</div>
                    <div className={styles.djGenre} style={{ color: genreColors[dj.genre] || '#888' }}>
                      {dj.genre}
                    </div>
                    {dj.followers > 0 && (
                      <div className={styles.djOrigin}>{dj.followers} upcoming shows on Ticketmaster</div>
                    )}
                  </div>
                  <div className={styles.djArrow}>→</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
