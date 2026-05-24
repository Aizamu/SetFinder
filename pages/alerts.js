import { useState } from 'react';
import { US_STATES } from '../lib/constants';
import Head from 'next/head';
import styles from './alerts.module.css';

const POPULAR_DJS = [
  'Eric Prydz', 'John Summit', 'Fisher', 'Charlotte de Witte',
  'Subtronics', 'REZZ', 'Disclosure', 'Armin van Buuren',
  'Goldie', 'Chris Lake', 'Jamie Jones', 'Amelie Lens',
];

export default function AlertsPage() {
  const [email, setEmail] = useState('');
  const [selectedDJs, setSelectedDJs] = useState([]);
  const [customDJ, setCustomDJ] = useState('');
  const [state, setState] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function toggleDJ(dj) {
    setSelectedDJs(prev =>
      prev.includes(dj) ? prev.filter(d => d !== dj) : [...prev, dj]
    );
  }

  function addCustomDJ() {
    const name = customDJ.trim();
    if (name && !selectedDJs.includes(name)) {
      setSelectedDJs(prev => [...prev, name]);
      setCustomDJ('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || selectedDJs.length === 0) return;
    setLoading(true);
    // In production: POST to /api/subscribe
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.successBox}>
          <div className={styles.successIcon}>◈</div>
          <h2 className={styles.successTitle}>You're in.</h2>
          <p className={styles.successSub}>
            We'll email you at <strong>{email}</strong> the moment any of your followed DJs announce a show{state ? ` in ${state}` : ''}.
          </p>
          <div className={styles.followedList}>
            {selectedDJs.map(dj => (
              <span key={dj} className={styles.followedTag}>{dj}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Get DJ Alerts — SetFinder</title>
        <meta name="description" content="Follow your favorite DJs and get email alerts the moment they announce near you." />
      </Head>

      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <div className={styles.badge}>◈ Free Forever</div>
            <h1 className={styles.title}>Get DJ Alerts</h1>
            <p className={styles.sub}>
              Follow the DJs you care about. We'll email you the second they announce a show near you — before tickets sell out.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.section}>
              <label className={styles.sectionLabel}>Your email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={styles.emailInput}
              />
            </div>

            <div className={styles.section}>
              <label className={styles.sectionLabel}>Notify me for shows in (optional)</label>
              <select value={state} onChange={e => setState(e.target.value)}>
                <option value="">Anywhere in the US</option>
                {US_STATES.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.section}>
              <label className={styles.sectionLabel}>
                DJs to follow
                {selectedDJs.length > 0 && (
                  <span className={styles.selectedCount}> · {selectedDJs.length} selected</span>
                )}
              </label>
              <div className={styles.djGrid}>
                {POPULAR_DJS.map(dj => (
                  <button
                    key={dj}
                    type="button"
                    className={`${styles.djChip} ${selectedDJs.includes(dj) ? styles.djChipActive : ''}`}
                    onClick={() => toggleDJ(dj)}
                  >
                    {selectedDJs.includes(dj) && <span className={styles.check}>✓ </span>}
                    {dj}
                  </button>
                ))}
              </div>

              <div className={styles.customRow}>
                <input
                  type="text"
                  placeholder="Add any DJ not listed..."
                  value={customDJ}
                  onChange={e => setCustomDJ(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomDJ(); } }}
                  className={styles.customInput}
                />
                <button type="button" className={styles.addBtn} onClick={addCustomDJ}>
                  + Add
                </button>
              </div>

              {selectedDJs.length > 0 && (
                <div className={styles.selectedTags}>
                  {selectedDJs.map(dj => (
                    <span key={dj} className={styles.selectedTag}>
                      {dj}
                      <button type="button" onClick={() => toggleDJ(dj)} className={styles.removeTag}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!email || selectedDJs.length === 0 || loading}
            >
              {loading ? 'Setting up alerts...' : selectedDJs.length > 0 ? `Follow ${selectedDJs.length} DJ${selectedDJs.length !== 1 ? 's' : ''} — Get Alerts Free` : 'Select DJs to Follow'}
            </button>

            <p className={styles.legal}>No spam. Unsubscribe anytime. We never sell your email.</p>
          </form>
        </div>
      </div>
    </>
  );
}
