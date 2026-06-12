# skini

BMI sparklines with you and your friends — gamified.

Each person gets a card with a 30-day BMI sparkline (the green band marks the
healthy 18.5–24.9 range), a streak counter, and a score. Cards are ranked into
a leaderboard.

## Game modes

Tap the pill on a card to switch modes:

- **🛡 maintain** — earn 10 points per consecutive day your BMI stays inside
  the healthy band.
- **📉 lose** (weight-loss mode) — earn 25 points per kg lost from your peak
  weight, plus 5 points per consecutive day your weight trends down.

Skipping more than 2 days between weigh-ins breaks your streak either way.

Log today's weight on your own card. Data lives in `localStorage`; first run
seeds demo data for you and three friends.

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check + production build
```

Built with React 19 + TypeScript + Vite. No other runtime dependencies — the
sparklines are hand-rolled SVG.
