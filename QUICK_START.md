# Astro Bot Dashboard - Quick Start Guide

⚡ **Get your dashboard running in 5 minutes!**

---

## 🎯 What Is This?

A real-time dashboard showing your Astro Bot's trading statistics:
- Account value
- Profit/Loss
- Active trades
- Bot status

**Auto-updates every 3 minutes** - no manual refresh needed!

---

## ⚙️ Already Set Up

✅ Database connection configured  
✅ All components built  
✅ Design complete (nof1.ai style)  
✅ Auto-refresh working  
✅ Production build tested  

**Current Status:** Running locally at http://localhost:3000

---

## 🚀 Deploy to Vercel (3 Steps)

### Step 1: Push to GitHub

```bash
cd /Users/noorelshin/Documents/ASTERBOT/asterbot-dashboard

git init
git add .
git commit -m "Astro Bot Dashboard"
git remote add origin https://github.com/YOUR_USERNAME/asterbot-dashboard.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Vercel auto-detects Next.js

### Step 3: Add Environment Variables

In Vercel dashboard, add these:

```
DB_HOST=147.93.127.165
DB_PORT=5432
DB_NAME=ichigo
DB_USER=noor
DB_PASSWORD=MyDB123456
DB_SCHEMA=ichigo
```

Click "Deploy" → Done! 🎉

---

## 📊 What You'll See

### Main Metrics

**Account Value** - Total portfolio worth  
**Realized P&L** - Actual profit from closed trades  
**Unrealized P&L** - Current open position profit  
**Trades** - Total decisions, buys, sells  
**Bot Status** - Active/idle, runtime, last action  

### Current Values (Example)

```
Account Value: $1,378.32
Realized P&L:  +$163.00
Unrealized:    +$13.94 (+1.01%)
Total P&L:     +$176.93

Decisions: 1,245
Buys:      72 (5.8%)
Sells:     14 (1.1%)

Bot: ACTIVE (2d 16h runtime)
```

---

## 🔄 How Auto-Refresh Works

1. Dashboard loads with current data
2. Every 3 minutes, fetches new data
3. Updates smoothly (no page reload)
4. No user interaction needed

**You don't need to do anything** - it just works!

---

## 🎨 Design Features

✓ Dark theme (#0a0a0a background)  
✓ Green monospace text  
✓ Animated ticker tape  
✓ Terminal-style cards  
✓ Responsive (mobile + desktop)  

Perfectly mimics nof1.ai aesthetic!

---

## 📁 File Structure

```
asterbot-dashboard/
├── app/              # Next.js app
│   ├── api/stats/    # API endpoint
│   └── page.tsx      # Main dashboard
├── components/       # React components (7 total)
├── lib/              # Database & queries
├── hooks/            # Data fetching
├── .env.local        # DB credentials
└── [docs]            # README, guides
```

---

## 🆘 Troubleshooting

**Dashboard won't load?**
```bash
# Check database connection
psql -h 147.93.127.165 -U noor -d ichigo -c "SELECT 1"
```

**Deployment fails?**
- Verify all 6 environment variables are set
- Check Vercel function logs for errors

**Data looks wrong?**
```bash
# Query database directly
PGPASSWORD=MyDB123456 psql -h 147.93.127.165 -U noor -d ichigo -c "SELECT * FROM ichigo.current_position_v"
```

---

## 📖 Full Documentation

| Guide | Purpose |
|-------|---------|
| **README.md** | Technical documentation |
| **DASHBOARD_GUIDE.md** | Understanding metrics |
| **DEPLOYMENT.md** | Detailed deploy guide |
| **IMPLEMENTATION_SUMMARY.md** | How it was built |

---

## ✅ Checklist

- [x] Dashboard built
- [x] Database connected
- [x] Auto-refresh working
- [x] Design complete
- [x] Tested locally
- [x] Production build successful
- [x] Documentation written
- [ ] **Pushed to GitHub** ← Do this next
- [ ] **Deployed to Vercel** ← Then this

---

## 🎯 Next Actions

1. **Test locally** (already running at http://localhost:3000)
2. **Push to GitHub** (3 commands above)
3. **Deploy to Vercel** (5-10 minutes)
4. **Bookmark your dashboard URL**

That's it! 🚀

---

## 💡 Tips

**Bookmark Your URL:** Save it for quick access  
**Check Daily:** Monitor your bot's performance  
**Read the Guide:** `DASHBOARD_GUIDE.md` explains all metrics  
**Need Help?** See `README.md` troubleshooting section  

---

**Ready? Let's deploy!** 🎉

```bash
cd /Users/noorelshin/Documents/ASTERBOT/asterbot-dashboard
git init && git add . && git commit -m "Astro Bot Dashboard v1.0"
```

Then push to GitHub and deploy to Vercel!

---

**Dashboard Version:** 1.0.0  
**Status:** Production Ready ✅  
**Last Updated:** October 29, 2025

