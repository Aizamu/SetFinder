import Head from 'next/head';
import Link from 'next/link';
import { US_STATES } from '../lib/constants';
import styles from './cities.module.css';

const CITIES_BY_STATE = {
  CA: ['Los Angeles', 'San Francisco', 'San Diego', 'Oakland'],
  NY: ['New York', 'Brooklyn', 'Albany'],
  FL: ['Miami', 'Orlando', 'Tampa'],
  TX: ['Austin', 'Houston', 'Dallas'],
  IL: ['Chicago'],
  CO: ['Denver', 'Boulder'],
  NV: ['Las Vegas', 'Reno'],
  WA: ['Seattle', 'Tacoma'],
  GA: ['Atlanta'],
  MI: ['Detroit', 'Ann Arbor'],
  MN: ['Minneapolis'],
  TN: ['Nashville', 'Memphis'],
  OR: ['Portland'],
  AZ: ['Phoenix', 'Tucson'],
  MA: ['Boston'],
  PA: ['Philadelphia', 'Pittsburgh'],
  OH: ['Columbus', 'Cleveland'],
  NC: ['Charlotte', 'Raleigh'],
  WI: ['Milwaukee'],
};

export default function CitiesPage() {
  const statesWithCities = US_STATES.filter(s => CITIES_BY_STATE[s.code]);

  return (
    <>
      <Head>
        <title>Browse EDM Events by City — SetFinder</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.title}>Browse by City</h1>
          <p className={styles.sub}>Find EDM events, raves, and festivals in every major US city.</p>

          <div className={styles.stateList}>
            {statesWithCities.map(({ code, name }) => (
              <div key={code} className={styles.stateGroup}>
                <div className={styles.stateName}>{name}</div>
                <div className={styles.cityRow}>
                  {(CITIES_BY_STATE[code] || []).map(city => (
                    <Link
                      key={city}
                      href={`/events?city=${encodeURIComponent(city)}&state=${code}`}
                      className={styles.cityLink}
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
