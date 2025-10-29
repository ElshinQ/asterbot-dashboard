# 🚨 Quick Fix: Vercel Connection Error

## Problem
Dashboard shows "Failed to connect to server" on Vercel deployment.

## Root Cause
Missing database environment variables in Vercel.

---

## ✅ SOLUTION (Choose One Method)

### Method 1: Vercel Dashboard (5 minutes)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your `asterbot-dashboard` project

2. **Add Environment Variables**
   - Navigate to: **Settings** → **Environment Variables**
   - Click "Add New" for each variable:

   | Variable | Value |
   |----------|-------|
   | `DB_HOST` | `147.93.127.165` |
   | `DB_PORT` | `5432` |
   | `DB_NAME` | `ichigo` |
   | `DB_USER` | `noor` |
   | `DB_PASSWORD` | `MyDB123456` |
   | `DB_SCHEMA` | `ichigo` |

3. **Important Settings**
   - For each variable, select **all environments**:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Mark `DB_PASSWORD` as **sensitive** (eye icon)

4. **Redeploy**
   - Go to **Deployments** tab
   - Click ⋯ (three dots) on the latest deployment
   - Click **Redeploy**
   - Wait 2-3 minutes for build to complete

5. **Verify**
   - Visit your deployment URL
   - Dashboard should load with live data
   - Check Vercel function logs for confirmation

---

### Method 2: Vercel CLI (Automated)

1. **Make the script executable**
   ```bash
   cd /Users/noorelshin/Documents/ASTERBOT/asterbot-dashboard
   chmod +x setup-vercel-env.sh
   ```

2. **Run the setup script**
   ```bash
   ./setup-vercel-env.sh
   ```

3. **The script will automatically:**
   - Install Vercel CLI (if needed)
   - Login to your Vercel account
   - Add all 6 environment variables
   - Redeploy to production

4. **Wait for deployment**
   - Takes 2-3 minutes
   - Check the URL provided in terminal

---

## 🔍 Verify It Works

### Check Function Logs
1. Go to Vercel Dashboard
2. Click on your project
3. Navigate to **Functions** tab
4. Look for `/api/stats` logs

**Success logs:**
```
Database connected successfully: 2025-10-29T12:00:00.000Z
```

**Before fix (error logs):**
```
Missing environment variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
```

### Test Dashboard
Visit your deployment URL:
```
https://asterbot-dashboard-[your-username].vercel.app
```

**Expected:** Dashboard loads with:
- ✅ Account value displayed
- ✅ ASTER/USDT balances
- ✅ Recent decisions shown
- ✅ Chart rendered
- ✅ Auto-refresh every 3 minutes

---

## 🚨 Still Not Working?

### Issue: Database Connection Timeout

**Error Message:**
```
Database Connection Failed: Could not connect to PostgreSQL database
```

**Possible Causes:**
1. Database server is down
2. Firewall blocking Vercel IPs
3. Invalid credentials

**Solutions:**

1. **Test database from local machine:**
   ```bash
   PGPASSWORD=MyDB123456 psql -h 147.93.127.165 -U noor -d ichigo -c "SELECT 1"
   ```

2. **Check database firewall:**
   - Database must allow connections from Vercel
   - Vercel uses dynamic IPs from AWS
   - Consider whitelisting `0.0.0.0/0` (all IPs) or using connection proxy

3. **Verify credentials:**
   - Double-check each environment variable value
   - No extra spaces or quotes
   - Password is case-sensitive

### Issue: Environment Variables Not Loading

**Error Message:**
```
Configuration Error: Missing environment variables: DB_HOST
```

**Solution:**
1. Verify variables are set for **Production** environment
2. Click "Redeploy" (not just rebuild)
3. Check if variable names match exactly (case-sensitive)

---

## 📊 Database Security Note

**Current Setup:**
- Using superuser account (`noor`)
- Not recommended for production

**Recommended: Create Read-Only User**

```sql
-- Connect to database
PGPASSWORD=MyDB123456 psql -h 147.93.127.165 -U noor -d ichigo

-- Create read-only user for dashboard
CREATE USER dashboard_readonly WITH PASSWORD 'SecurePassword123!';
GRANT CONNECT ON DATABASE ichigo TO dashboard_readonly;
GRANT USAGE ON SCHEMA ichigo TO dashboard_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA ichigo TO dashboard_readonly;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA ichigo TO dashboard_readonly;

-- Future tables will also be readable
ALTER DEFAULT PRIVILEGES IN SCHEMA ichigo 
GRANT SELECT ON TABLES TO dashboard_readonly;
```

Then update Vercel environment variables:
- `DB_USER` → `dashboard_readonly`
- `DB_PASSWORD` → `SecurePassword123!`

---

## 📝 Troubleshooting Checklist

- [ ] All 6 environment variables added in Vercel
- [ ] Variables applied to Production environment
- [ ] DB_PASSWORD marked as sensitive
- [ ] Redeployed after adding variables (not just saved)
- [ ] Database is accessible from internet
- [ ] Database firewall allows Vercel connections
- [ ] Credentials are correct (tested locally)
- [ ] Function logs checked for specific error

---

## 🎯 Expected Behavior After Fix

1. **Homepage loads in < 3 seconds**
2. **Shows real-time data:**
   - Account value
   - ASTER balance
   - USDT balance
   - Recent trading decisions
3. **Auto-refreshes every 3 minutes**
4. **No error messages**
5. **Green "ACTIVE" status indicator**

---

## 📞 Need More Help?

Check these resources:
- Vercel Docs: https://vercel.com/docs/environment-variables
- PostgreSQL Connection Guide: `docs/REMOTE_DATABASE_ACCESS.md`
- Full Deployment Guide: `DEPLOYMENT.md`

---

**Status After Fix:** ✅ Dashboard Working  
**Time Required:** 5 minutes  
**Difficulty:** Easy

