# SetFinder — US EDM Event Database

**Find where any DJ is playing. Filter by state, city, genre. Follow artists. Get alerts.**

Built with Next.js. Deploys free on Vercel in under 5 minutes.

---

## What this is

- Search any DJ → see all upcoming US shows
- Filter by State → City → Genre → Date
- Browse all major EDM cities
- Follow DJs → email alerts when they announce near you
- Ticket affiliate links (your revenue)

---

## Quick Start (local dev)

```bash
cd SetFinder
npm install
npm run dev
```

Opens at http://localhost:3000

Works immediately with mock data — no API keys needed to see the full UI.

---

## Deploy to Vercel (free)

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import that repo
3. Deploy — done. Live in ~2 minutes.

---

## Connect Real Event Data

Add these to Vercel's Environment Variables:

| Variable | Where to get it | Cost |
|---|---|---|
| `SONGKICK_API_KEY` | songkick.com/developer | Free |
| `BANDSINTOWN_APP_ID` | bandsintown.com/api | Free |

Once set, the app automatically switches from mock data to live events.

---

## Revenue Streams

### 1. Ticket Affiliate Links (passive)
- Songkick affiliate program: ~5% per ticket sale
- Ticketmaster affiliate: ~3-5% per sale
- Sign up at: songkick.com/partners

Update `ticketUrl` in EventCard.js with your affiliate tracking URLs.

### 2. Email Alerts Pro Tier
Gate the alerts feature behind Stripe for power users:
- Free: Follow 3 DJs, one state
- Pro ($4.99/month): Unlimited follows, any state, festival alerts

Add Stripe: `npm install stripe @stripe/stripe-js`

### 3. Promoted Listings
Promoters pay $50-200/month to appear featured/highlighted in search results.
Add a `featured: true` flag to event cards.

### 4. Festival Guides
SEO-optimized pages for each major festival (EDC, Tomorrowland, etc.)
with lineup, logistics, hotel links (affiliate).

---

## File Structure

```
SetFinder/
├── pages/
│   ├── index.js          # Homepage — hero, city browse, genre browse
│   ├── events.js         # Main search + filter page
│   ├── djs.js            # DJ search and browse
│   ├── alerts.js         # Email alert signup
│   └── cities.js         # Browse all US cities
├── components/
│   ├── Nav.js            # Sticky navigation
│   ├── EventCard.js      # Event display card
│   └── FilterBar.js      # State/city/genre/date filters
├── lib/
│   ├── events.js         # API integration (Songkick + Bandsintown + mock)
│   └── constants.js      # US states, cities, genres
└── styles/
    └── globals.css       # Dark theme, fonts, base styles
```

---

## Adding More Data Sources

Edit `lib/events.js` to add:
- **Resident Advisor** scraper via Apify ($5/month)
- **Dice.FM** scraper via Apify
- **Ticketmaster Discovery API** (free, 5000 calls/day)

All three together cover virtually every EDM event in the US.

---

## Domain

Register `setfinder.io` or `setfinder.co` (~$12/year at Namecheap).
Point DNS to Vercel — takes 5 minutes.
