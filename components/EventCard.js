import styles from './EventCard.module.css';
import { format, parseISO } from 'date-fns';

export default function EventCard({ event }) {
  const dateObj = event.date ? parseISO(event.date) : new Date();
  const dayNum = format(dateObj, 'd');
  const month = format(dateObj, 'MMM').toUpperCase();
  const weekday = format(dateObj, 'EEE').toUpperCase();

  const genreColor = {
    'House': '#00c8ff',
    'Techno': '#ff4545',
    'Trance': '#a855f7',
    'Drum & Bass': '#ff8c00',
    'Bass Music': '#b3ff00',
    'Dubstep': '#00ff88',
    'Festival EDM': '#ff6b9d',
    'Hardstyle': '#ffdd00',
  }[event.genre] || '#888';

  return (
    <div className={styles.card}>
      <div className={styles.datePill}>
        <span className={styles.month}>{month}</span>
        <span className={styles.day}>{dayNum}</span>
        <span className={styles.weekday}>{weekday}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.genre} style={{ color: genreColor, borderColor: genreColor + '44' }}>
            {event.genre}
          </span>
          {event.afterParty && (
            <span className={styles.afterParty}>After Party</span>
          )}
          {event.ageRestriction && (
            <span className={styles.age}>{event.ageRestriction}</span>
          )}
        </div>

        <h3 className={styles.title}>{event.title}</h3>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {event.venue}, {event.city}, {event.state}
          </span>
          {event.time && (
            <span className={styles.metaItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {event.time}
            </span>
          )}
          {event.festivalSize && (
            <span className={styles.metaItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {event.festivalSize} capacity
            </span>
          )}
        </div>

        {event.vibe && (
          <div className={styles.vibe}>"{event.vibe}"</div>
        )}

        {event.crowdRating != null && (
          <div className={styles.rating}>
            <span className={styles.stars}>
              {'★'.repeat(Math.round(event.crowdRating))}{'☆'.repeat(5 - Math.round(event.crowdRating))}
            </span>
            <span className={styles.ratingNum}>{event.crowdRating}</span>
            <span className={styles.ratingCount}>({event.crowdReviews} reviews)</span>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <a
          href={event.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ticketBtn}
        >
          Get Tickets
        </a>
        <button className={styles.followBtn} aria-label="Save event">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
