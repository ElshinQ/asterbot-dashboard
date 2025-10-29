# Astro Bot Dashboard - User Guide

Complete guide to understanding and using the Astro Bot Dashboard.

## Dashboard Overview

The Astro Bot Dashboard provides real-time visibility into your trading bot's performance with automatic updates every 3 minutes.

## Dashboard Sections

### 1. Ticker Tape (Top Bar)

**What it shows:** Animated scrolling ticker with current ASTER/USDT price

**Example:** `ASTERUSDT $1.09900`

**Purpose:** Quick price reference at a glance

---

### 2. Total Account Value (Center, Large)

**What it shows:** Combined value of all assets in USDT

**Calculation:**
```
Account Value = (ASTER Balance × Current Price) + USDT Balance
              = (1253.61 × $1.099) + $0.59
              = $1378.32
```

**Why it matters:** This is your total portfolio value at current market prices.

---

### 3. Position Card

**Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| **STATUS** | Whether bot has an active position | `ACTIVE` or `IDLE` |
| **ASTER BALANCE** | Total ASTER holdings (free + in TPs) | `1253.61` |
| **ENTRY PRICE** | Average price paid for current position | `$1.0880` |
| **CURRENT PRICE** | Latest ASTER market price | `$1.0990` |
| **OPEN TPS** | Number of active take-profit orders | `3` |
| **QTY IN TPS** | ASTER quantity in TP orders | `1253.61` |

**Status Indicators:**
- 🟢 **ACTIVE** (Green) - Bot has an open position with TPs
- ⚪ **IDLE** (Gray) - Bot is not in a position

---

### 4. P&L Card (Profit & Loss)

**Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| **REALIZED** | Profit/loss from closed trades | `$163.00` |
| **UNREALIZED** | Current open position profit/loss | `$13.94 (+1.01%)` |
| **TOTAL** | Sum of realized + unrealized | `+$176.93` |

**Color Coding:**
- 🟢 **Green** - Profit (positive value)
- 🔴 **Red** - Loss (negative value)

**Understanding Unrealized P&L:**

```
Entry: Bought 1253.61 ASTER @ $1.0880 = $1364.38
Current: 1253.61 ASTER @ $1.0990 = $1378.32
Unrealized P&L = $1378.32 - $1364.38 = $13.94 (+1.01%)
```

This becomes "realized" when you sell.

---

### 5. Trades Card

**Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| **TOTAL DECISIONS** | All bot decisions since start | `1,245` |
| **BUYS** | Number of buy decisions | `72 (5.8%)` |
| **SELLS** | Number of sell decisions | `14 (1.1%)` |
| **HOLDS** | Number of hold decisions | `1,120` |

**What the percentages mean:**
- Buy Rate = (Buys / Total Decisions) × 100 = (72 / 1245) × 100 = 5.8%
- Sell Rate = (Sells / Total Decisions) × 100 = (14 / 1245) × 100 = 1.1%

**Interpretation:**
- High hold % (90%+) - Bot is selective, waiting for good opportunities
- High buy % (10%+) - Bot is aggressive, entering frequently
- Buy > Sell - Bot may be accumulating or TPs are hitting

---

### 6. Bot Status Card

**Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| **STATUS** | Bot connectivity indicator | `ACTIVE` or `IDLE` |
| **LAST ACTION** | Most recent decision made | `HOLD` |
| **LAST UPDATE** | Time since last decision | `2m ago` |
| **RUNTIME** | Total time bot has been running | `2d 16h` |
| **STARTED** | Date bot first started | `10/26/2025` |

**Status Indicators:**
- 🟢 **ACTIVE** (Green, pulsing) - Bot updated within last 5 minutes
- 🟡 **IDLE** (Yellow) - Bot hasn't updated recently (may be offline)

**Last Action Values:**
- `BUY` - Bot entered a position
- `SELL` - Bot closed a position
- `HOLD` - Bot decided to wait

---

### 7. Detailed View (Bottom Section)

**Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| **ASTER BALANCE** | Total ASTER holdings | `1253.61 ASTER` |
| **USDT BALANCE** | Available USDT (not in position) | `$0.59` |
| **CURRENT PRICE** | Latest market price | `$1.09900` |

**Purpose:** Quick reference for exact balances.

---

## Understanding the Data

### Account Value Components

```
Total Account Value = ASTER Value + USDT Value

ASTER Value = ASTER Balance × Current Price
            = 1253.61 × $1.099
            = $1377.73

USDT Value = $0.59

Total = $1377.73 + $0.59 = $1378.32
```

### P&L Breakdown

**Realized P&L:**
- Money you've actually made/lost from completed trades
- Locked in, cannot change unless you trade more
- Example: Bought at $1.05, sold at $1.10 = realized profit

**Unrealized P&L:**
- Paper profit/loss on current open position
- Changes as price moves
- Not "real" until you close the position
- Example: Bought at $1.088, price now $1.099 = unrealized profit

**Total P&L:**
- Your complete profit/loss since bot started
- Includes both realized and unrealized

### Trade Statistics

**Total Decisions:**
- Every 3 minutes, bot makes a decision
- Decision can be BUY, SELL, or HOLD
- Higher number = bot has been running longer

**Buy/Sell Ratio:**
- Buys should roughly equal sells over time
- More buys than sells = bot is currently in position or accumulating
- More sells than buys = impossible (can't sell what you didn't buy)

**Holds:**
- Most decisions are holds (95%+)
- Bot only trades when conditions are favorable
- High hold count = bot is being cautious/selective

---

## Auto-Refresh Behavior

### How It Works

1. Dashboard loads initial data
2. Every 3 minutes (180 seconds), dashboard automatically fetches new data
3. UI updates smoothly without page reload
4. No manual refresh needed

### Visual Indicators

- **Bot Status**: Pulsing green dot = data is recent (< 5 min old)
- **Last Update**: Shows time since last bot decision (e.g., "2m ago")

### What Happens During Refresh

1. Dashboard calls `/api/stats` endpoint
2. Server queries PostgreSQL database
3. Fresh data returned to dashboard
4. UI updates with new values

**Note:** You won't see a loading spinner during refresh - values simply update smoothly.

---

## Common Questions

### Why does USDT balance seem low?

If USDT balance is very low ($0.59), it means most of your capital is deployed in ASTER:
- ASTER holdings: $1377.73
- USDT balance: $0.59
- Total: $1378.32

This is normal when bot has an active position.

### Why are there more holds than trades?

The bot runs every 3 minutes but only trades when:
- Market conditions are favorable
- Entry signals are strong
- Risk management rules are met

95%+ holds is expected and healthy behavior.

### What does "QTY IN TPS" mean?

**QTY IN TPS** = Quantity in Take-Profit orders

When bot buys ASTER, it immediately places 3 TP (take-profit) orders at higher prices. The ASTER allocated to those orders is "locked" until:
- TP orders fill (price reaches targets)
- Bot manually cancels them (on SELL decision)

### Why is unrealized P&L changing?

Unrealized P&L is based on current market price:
- Price goes up → unrealized profit increases
- Price goes down → unrealized profit decreases

It's only "realized" when you close the position.

### How accurate is the data?

- **Accuracy**: 100% (pulls directly from PostgreSQL)
- **Latency**: 0-3 minutes (depends on when last bot decision was made)
- **Refresh**: Every 3 minutes

Data is as real-time as the bot's heartbeat allows.

---

## Troubleshooting

### Dashboard shows "CONNECTING TO SERVER"

**Possible causes:**
1. API endpoint is down
2. Database connection failed
3. Network issue

**Solution:**
1. Check browser console for errors (F12 → Console)
2. Verify database is accessible
3. Restart development server

### Bot status shows "IDLE" but should be "ACTIVE"

**Possible causes:**
1. Bot hasn't made a decision in > 5 minutes
2. Bot may be offline
3. Database not receiving updates

**Solution:**
1. Check when "Last Update" was
2. Verify bot is running (check N8N workflow)
3. Check database for recent decisions:
   ```sql
   SELECT decided_at, action FROM ichigo.decisions 
   ORDER BY decided_at DESC LIMIT 5;
   ```

### Values seem wrong

**Solution:**
1. Verify data in database directly:
   ```sql
   SELECT * FROM ichigo.current_position_v;
   ```
2. Compare dashboard values with database values
3. Check API response: `curl http://localhost:3000/api/stats | jq`

### Dashboard not auto-refreshing

**Solution:**
1. Check browser console for errors
2. Verify React Query is set up correctly
3. Check network tab - should see `/api/stats` calls every 3 min

---

## Best Practices

### Monitoring

- Check dashboard at least once daily
- Watch for unexpected drops in account value
- Monitor realized P&L to track actual profits
- Ensure bot status stays "ACTIVE"

### Understanding Performance

- **Good sign**: Steady increase in total P&L
- **Warning sign**: Large unrealized losses
- **Critical**: Bot status "IDLE" for extended period

### Making Decisions

- Don't panic over unrealized losses (price fluctuations are normal)
- Focus on realized P&L for actual performance
- Watch buy/sell ratio over weeks, not days

---

## Advanced Metrics

### Win Rate Calculation

To calculate win rate, you need to look at individual trades:

```sql
SELECT 
  COUNT(*) FILTER (WHERE pnl_usdt > 0) as wins,
  COUNT(*) as total,
  (COUNT(*) FILTER (WHERE pnl_usdt > 0)::numeric / COUNT(*)) * 100 as win_rate
FROM ichigo.recent_trades_pnl_v
WHERE pnl_usdt IS NOT NULL;
```

### Average Hold Time

```sql
SELECT AVG(hold_time_minutes) as avg_hold_minutes
FROM ichigo.recent_trades_pnl_v
WHERE pnl_usdt IS NOT NULL;
```

### Daily P&L

```sql
SELECT 
  DATE(exit_time) as date,
  SUM(pnl_usdt) as daily_pnl
FROM ichigo.recent_trades_pnl_v
WHERE pnl_usdt IS NOT NULL
GROUP BY DATE(exit_time)
ORDER BY date DESC;
```

---

## Metrics Glossary

| Term | Definition |
|------|------------|
| **ASTER** | Token being traded (ASTERUSDT) |
| **USDT** | Tether stablecoin ($1 per token) |
| **TP** | Take-Profit order (sell at target price) |
| **P&L** | Profit & Loss |
| **Realized** | Actual profit/loss from closed trades |
| **Unrealized** | Paper profit/loss from open positions |
| **Entry Price** | Average price paid when buying |
| **Mark Price** | Current market price |
| **Hold** | Bot decision to not trade this cycle |

---

## Future Enhancements

Potential features for future versions:

- 📊 Historical P&L chart
- 📈 Price chart with entry/exit markers
- 📋 Recent trades table (last 10 trades)
- 🔔 Alert system for large moves
- 📱 Mobile-optimized view
- 🌙 Light mode theme
- 📊 Regime performance breakdown
- 💰 ROI calculator
- 📅 Calendar view of trades

---

**Need Help?**

- Check main `README.md` for technical issues
- Review `ASTERBOT/docs/` for bot-specific questions
- Verify database connection with `REMOTE_DATABASE_ACCESS.md`

---

**Dashboard Version**: 1.0.0  
**Last Updated**: October 29, 2025  
**Astro Bot Team**

