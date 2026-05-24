import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { MAJOR_EDM_CITIES, EDM_GENRES } from '../lib/constants';
import styles from './index.module.css';

const HERO_DOTS = Array.from({ length: 80 });

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/events?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/events');
    }
  }

  const genres = EDM_GENRES.filter(g => g !== 'All Genres').slice(0, 6);

  return (
    <>
      <Head>
        <title>SetFinder — Find Every DJ Show Near You</title>
        <meta name="description" content="Search any DJ, filter by state and city, follow artists, get alerts. The US-first EDM event database." />
      </Head>

      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroGrid} aria-hidden="true">
            {HERO_DOTS.map((_, i) => (
              <span key={i} className={styles.dot} style={{ animationDelay: `${(i * 0.04).toFixed(2)}s` }} />
            ))}
          </div>

          <div className={styles.heroContent}>
            <div className={styles.badge}>◈ US EDM Event Database</div>
            <h1 className={styles.heroTitle}>
              Find where<br />
              <span className={styles.heroAccent}>any DJ</span><br />
              is playing.
            </h1>
            <p className={styles.heroSub}>
              Search 50,000+ events across every US city and state.<br />
              Filter by genre. Follow artists. Get notified first.
            </p>

            <form className={styles.searchForm} onSubmit={handleSearch}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search a DJ, artist, or festival..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className={styles.searchBtn}>
                Search
              </button>
            </form>

            <div className={styles.quickLinks}>
              <span className={styles.quickLabel}>Trending:</span>
              {['Sub Focus', 'Eric Prydz', 'John Summit', 'REZZ', 'Charlotte de Witte'].map(dj => (
                <button
                  key={dj}
                  className={styles.quickTag}
                  onClick={() => router.push(`/events?q=${encodeURIComponent(dj)}`)}
                >
                  {dj}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div className={styles.statsBar}>
          <div className={styles.stat}><span className={styles.statNum}>50K+</span><span className={styles.statLabel}>Events</span></div>
          <div className={styles.statDivider} />
          <div className={styles.stat}><span className={styles.statNum}>16K+</span><span className={styles.statLabel}>DJs</span></div>
          <div className={styles.statDivider} />
          <div className={styles.stat}><span className={styles.statNum}>50</span><span className={styles.statLabel}>States</span></div>
          <div className={styles.statDivider} />
          <div className={styles.stat}><span className={styles.statNum}>500+</span><span className={styles.statLabel}>Festivals</span></div>
        </div>

        {/* Browse by City */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Browse by City</h2>
              <Link href="/cities" className={styles.seeAll}>See all cities →</Link>
            </div>
            <div className={styles.cityGrid}>
              {MAJOR_EDM_CITIES.map(({ city, state }) => (
                <Link
                  key={`${city}-${state}`}
                  href={`/events?city=${encodeURIComponent(city)}&state=${state}`}
                  className={styles.cityCard}
                >
                  <span className={styles.cityName}>{city}</span>
                  <span className={styles.cityState}>{state}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by Genre */}
        <section className={styles.section} style={{ background: 'var(--surface)' }}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Browse by Genre</h2>
            </div>
            <div className={styles.genreGrid}>
              {genres.map(genre => (
                <Link
                  key={genre}
                  href={`/events?genre=${encodeURIComponent(genre)}`}
                  className={styles.genreCard}
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Alert CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Never miss a show again.</h2>
            <p className={styles.ctaSub}>Follow your favorite DJs. Get email alerts the moment they announce near you.</p>
            <Link href="/alerts" className={styles.ctaBtn}>Set Up Alerts — Free</Link>
          </div>
        </section>
      </main>
    </>
  );
}
