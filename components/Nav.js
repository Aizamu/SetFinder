import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Nav.module.css';

export default function Nav() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/events', label: 'Events' },
    { href: '/djs', label: 'DJs' },
    { href: '/festivals', label: 'Festivals' },
    { href: '/cities', label: 'Browse Cities' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>◈</span>
          <span className={styles.logoText}>SetFinder</span>
        </Link>

        <div className={styles.links}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${router.pathname.startsWith(l.href) ? styles.active : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/alerts" className={styles.alertBtn} onClick={() => setMenuOpen(false)}>
          Get Alerts
        </Link>

        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {links.map(l => (
            <Link key={l.href} href={l.href} className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/alerts" className={styles.mobileAlertBtn}
            onClick={() => setMenuOpen(false)}>
            Get Alerts
          </Link>
        </div>
      )}
    </nav>
  );
}
