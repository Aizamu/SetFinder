import { useState, useEffect } from 'react';
import { US_STATES, EDM_GENRES } from '../lib/constants';
import styles from './FilterBar.module.css';

const CITIES_BY_STATE = {
  CA: ['Los Angeles', 'San Francisco', 'San Diego', 'Oakland', 'Sacramento'],
  NY: ['New York', 'Brooklyn', 'Queens', 'Albany', 'Buffalo'],
  FL: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
  TX: ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth'],
  IL: ['Chicago', 'Naperville', 'Aurora', 'Peoria'],
  CO: ['Denver', 'Boulder', 'Colorado Springs', 'Fort Collins'],
  NV: ['Las Vegas', 'Reno', 'Henderson'],
  WA: ['Seattle', 'Tacoma', 'Spokane', 'Bellingham'],
  GA: ['Atlanta', 'Savannah', 'Augusta'],
  MI: ['Detroit', 'Grand Rapids', 'Ann Arbor'],
  MN: ['Minneapolis', 'Saint Paul', 'Duluth'],
  TN: ['Nashville', 'Memphis', 'Knoxville'],
  OR: ['Portland', 'Eugene', 'Salem'],
  AZ: ['Phoenix', 'Tucson', 'Scottsdale', 'Tempe'],
  MA: ['Boston', 'Cambridge', 'Worcester'],
};

export default function FilterBar({ filters, onChange }) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const newCities = CITIES_BY_STATE[filters.state] || [];
    setCities(newCities);
    // Only clear city if state changed and current city is not in new state's list
    if (filters.city && newCities.length > 0 && !newCities.includes(filters.city)) {
      onChange({ ...filters, city: '' });
    }
  }, [filters.state]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className={styles.bar}>
      <div className={styles.field}>
        <label className={styles.label}>State</label>
        <select value={filters.state} onChange={e => update('state', e.target.value)}>
          <option value="">All States</option>
          {US_STATES.map(s => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>City</label>
        {filters.state && cities.length > 0 ? (
          <select value={filters.city} onChange={e => update('city', e.target.value)}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        ) : (
          <input
            type="text"
            placeholder="Any city..."
            value={filters.city}
            onChange={e => update('city', e.target.value)}
          />
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Genre</label>
        <select value={filters.genre} onChange={e => update('genre', e.target.value)}>
          {EDM_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>From Date</label>
        <input
          type="date"
          value={filters.dateFrom}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => update('dateFrom', e.target.value)}
        />
      </div>

      <button
        className={styles.clearBtn}
        onClick={() => onChange({ state: '', city: '', genre: 'All Genres', dateFrom: '' })}
      >
        Clear
      </button>
    </div>
  );
}
