# Astro Bot Dashboard

Real-time statistics dashboard for the Astro Bot trading system. Built with Next.js 15, TypeScript, and Tailwind CSS, designed to mimic the nof1.ai aesthetic.

![Astro Bot Dashboard](/.playwright-mcp/astro-bot-dashboard-live.png)

## Features

- ✅ **Real-time Updates** - Auto-refreshes every 3 minutes (matches bot heartbeat)
- ✅ **Live Account Value** - Total portfolio value in USDT
- ✅ **P&L Tracking** - Realized & unrealized profit/loss
- ✅ **Position Monitoring** - Current ASTER holdings and open TP orders
- ✅ **Trade Statistics** - Total decisions, buys, sells, success rate
- ✅ **Bot Status** - Runtime, last action, active/idle status
- ✅ **Price Ticker** - Animated ticker tape showing ASTER/USDT price
- ✅ **Dark Theme** - Terminal-style aesthetic with green accents

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (remote connection)
- **Data Fetching**: TanStack React Query (client-side polling)
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ 
- Access to PostgreSQL database (ichigo schema)
- Database credentials (host, port, user, password)

## Installation

### 1. Clone the repository

```bash
cd /Users/noorelshin/Documents/ASTERBOT/asterbot-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
DB_HOST=147.93.127.165
DB_PORT=5432
DB_NAME=ichigo
DB_USER=noor
DB_PASSWORD=MyDB123456
DB_SCHEMA=ichigo
```

**⚠️ Security Note**: Never commit `.env.local` to version control. This file is already in `.gitignore`.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
asterbot-dashboard/
├── app/
│   ├── api/
│   │   └── stats/
│   │       └── route.ts          # API endpoint for statistics
│   ├── globals.css                # Global styles and animations
│   ├── layout.tsx                 # Root layout with React Query
│   ├── page.tsx                   # Main dashboard page
│   └── providers.tsx              # Query client provider
├── components/
│   ├── AccountValue.tsx           # Large account value display
│   ├── BotStatus.tsx              # Bot status card
│   ├── LoadingState.tsx           # Loading skeleton
│   ├── PnLCard.tsx                # P&L metrics card
│   ├── PositionCard.tsx           # Position details card
│   ├── TickerTape.tsx             # Animated price ticker
│   └── TradeStats.tsx             # Trade statistics card
├── hooks/
│   └── useStats.ts                # React Query hook for polling
├── lib/
│   ├── db.ts                      # PostgreSQL connection pool
│   ├── queries.ts                 # Database query functions
│   ├── types.ts                   # TypeScript interfaces
│   └── utils.ts                   # Utility functions
├── .env.local                     # Environment variables (not committed)
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Database Schema

The dashboard queries the following PostgreSQL views and tables:

### Views
- `ichigo.current_position_v` - Current holdings, unrealized P&L, open TPs
- `ichigo.recent_trades_pnl_v` - Completed trades with realized P&L
- `ichigo.commission_summary_v` - Total fees paid

### Tables
- `ichigo.decisions` - Bot decisions, runtime, actions
- `ichigo.orders` - Individual orders
- `ichigo.executions` - Order fills
- `ichigo.balances` - Account snapshots

## API Endpoints

### GET `/api/stats`

Returns aggregated dashboard statistics.

**Response:**
```json
{
  "accountValue": 1378.32,
  "asterBalance": 1253.61,
  "usdtBalance": 0.59,
  "currentPrice": 1.099,
  "unrealizedPnL": 13.94,
  "unrealizedPnLPercent": 1.01,
  "realizedPnL": 163.00,
  "totalDecisions": 1245,
  "buyCount": 72,
  "sellCount": 14,
  "holdCount": 1120,
  "openTPOrders": 3,
  "qtyInTpOrders": 1253.61,
  "lastDecision": {
    "timestamp": "2025-10-29T09:43:00.254Z",
    "action": "hold"
  },
  "runtime": {
    "firstDecision": "2025-10-26T17:38:02.366Z",
    "lastDecision": "2025-10-29T09:43:00.254Z",
    "daysSinceStart": 2,
    "totalRuntime": "2d 16h"
  },
  "position": {
    "hasPosition": true,
    "entryPrice": 1.088,
    "entryTime": "2025-10-28T21:03:39.374Z",
    "currentQty": 1253.61
  }
}
```

**Caching:** No cache, always fresh data.

**Refresh Interval:** Client polls every 3 minutes (180,000ms).

## Deployment to Vercel

### 1. Install Vercel CLI (optional)

```bash
npm i -g vercel
```

### 2. Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_SCHEMA`
6. Click "Deploy"

### 3. Deploy via CLI

```bash
cd /Users/noorelshin/Documents/ASTERBOT/asterbot-dashboard
vercel
```

Follow the prompts and add environment variables when asked.

## Configuration

### Polling Interval

To change the auto-refresh interval, edit `hooks/useStats.ts`:

```typescript
refetchInterval: 3 * 60 * 1000, // Change this value (in milliseconds)
```

### Theme Colors

To customize colors, edit `app/globals.css` and component files. Current theme:

- Background: `#0a0a0a`
- Text: `#e5e5e5`
- Accent (Green): `#10b981`
- Error (Red): `#ef4444`

### Database Connection

Database configuration is in `lib/db.ts`. Connection pooling is enabled with:

- Max connections: 20
- Idle timeout: 30 seconds
- Connection timeout: 10 seconds

## Troubleshooting

### Database Connection Errors

**Problem:** "Database connection failed"

**Solution:**
1. Verify `.env.local` credentials are correct
2. Check database server is running and accessible
3. Verify IP address is not blocked by firewall
4. Test connection manually:
   ```bash
   PGPASSWORD=MyDB123456 psql -h 147.93.127.165 -U noor -d ichigo -c "SELECT 1"
   ```

### Slow Loading

**Problem:** Dashboard takes too long to load

**Solution:**
1. Check database query performance
2. Verify network latency to database
3. Consider adding database indexes on frequently queried columns

### Stale Data

**Problem:** Data not updating

**Solution:**
1. Open browser DevTools → Network tab
2. Verify `/api/stats` is being called every 3 minutes
3. Check for JavaScript errors in Console tab
4. Verify bot is still running and writing to database

## Development

### Run in Development Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run start
```

### Run Linter

```bash
npm run lint
```

## Contributing

This dashboard is part of the Astro Bot trading system. To contribute:

1. Test changes locally first
2. Verify database queries work correctly
3. Ensure responsive design on mobile
4. Follow existing code style
5. Update documentation if needed

## Performance

- **Initial Load**: < 2 seconds
- **API Response**: < 500ms (depends on database latency)
- **Auto-refresh**: Every 3 minutes (no user interaction required)
- **Bundle Size**: Optimized with Next.js tree-shaking

## Security

- Environment variables stored in `.env.local` (not committed)
- Database credentials never exposed to client
- API routes run server-side only
- No authentication (assumes internal network)

**Production Recommendation**: Add authentication middleware if exposing publicly.

## License

Internal tool for Astro Bot trading system.

## Support

For issues related to:
- **Dashboard**: Check this README and troubleshooting section
- **Database**: See `ASTERBOT/docs/REMOTE_DATABASE_ACCESS.md`
- **Trading Bot**: See `ASTERBOT/docs/ichigo/ICHIGO_COMPLETE_GUIDE.md`

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: October 29, 2025  
**Author**: Astro Bot Team
