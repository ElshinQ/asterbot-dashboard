# Deployment Guide - Astro Bot Dashboard

Step-by-step guide to deploy the Astro Bot Dashboard to Vercel.

## Prerequisites

- [x] GitHub account
- [x] Vercel account (free tier works)
- [x] Database credentials
- [x] Working local development environment

## Deployment Methods

Choose one of the following methods:

---

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub

```bash
cd /Users/noorelshin/Documents/ASTERBOT/asterbot-dashboard

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Astro Bot Dashboard"

# Add remote repository (create on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/asterbot-dashboard.git

# Push to GitHub
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [https://vercel.com/](https://vercel.com/)
2. Click "Add New Project"
3. Click "Import Git Repository"
4. Select your GitHub repository
5. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables

In the Vercel dashboard, add the following environment variables:

| Variable | Value | Example |
|----------|-------|---------|
| `DB_HOST` | Database host IP/domain | `147.93.127.165` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `ichigo` |
| `DB_USER` | Database username | `noor` |
| `DB_PASSWORD` | Database password | `MyDB123456` |
| `DB_SCHEMA` | Database schema | `ichigo` |

**Important:** Mark `DB_PASSWORD` as sensitive.

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Click on the deployment URL
4. Verify dashboard loads correctly

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy

```bash
cd /Users/noorelshin/Documents/ASTERBOT/asterbot-dashboard

# First deployment (follow prompts)
vercel

# You'll be asked:
# - Set up and deploy? [Y/n] → Y
# - Which scope? → Select your account
# - Link to existing project? [y/N] → N
# - Project name? → asterbot-dashboard
# - Directory? → ./ (default)
# - Override settings? [y/N] → N
```

### Step 4: Add Environment Variables

```bash
# Add each variable
vercel env add DB_HOST
# Enter value: 147.93.127.165
# Select environments: Production, Preview, Development

vercel env add DB_PORT
# Enter value: 5432

vercel env add DB_NAME
# Enter value: ichigo

vercel env add DB_USER
# Enter value: noor

vercel env add DB_PASSWORD
# Enter value: MyDB123456
# Mark as sensitive: Yes

vercel env add DB_SCHEMA
# Enter value: ichigo
```

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## Method 3: Deploy via GitHub Integration (Automatic)

### Step 1: Connect Vercel to GitHub

1. Go to [https://vercel.com/](https://vercel.com/)
2. Settings → Git Integration
3. Connect your GitHub account
4. Grant Vercel access to repositories

### Step 2: Enable Auto-Deploy

1. Vercel dashboard → Settings → Git
2. Enable "Automatic Deployments"
3. Select branch: `main`

### Step 3: Push Changes

```bash
git push origin main
```

Vercel will automatically:
- Detect the push
- Build the project
- Deploy to production

---

## Post-Deployment Checklist

After deployment, verify the following:

### 1. Database Connection

Check Vercel Function Logs:
1. Go to Vercel dashboard
2. Click on your project
3. Navigate to "Functions" tab
4. Check `/api/stats` logs for errors

**Expected log:**
```
Database connected successfully: 2025-10-29T12:00:00.000Z
```

**Error log (if connection fails):**
```
Database connection error: ECONNREFUSED
```

### 2. Dashboard Loads

Visit your deployment URL:
```
https://asterbot-dashboard-your-username.vercel.app
```

**Expected:** Dashboard loads with live data

**Error:** Shows "CONNECTING TO SERVER" indefinitely

### 3. Auto-Refresh Works

1. Note current values
2. Wait 3 minutes
3. Verify values update automatically
4. Check browser Network tab for `/api/stats` calls

### 4. Data Accuracy

Compare dashboard values with database:

```bash
PGPASSWORD=MyDB123456 psql -h 147.93.127.165 -U noor -d ichigo -c "
  SELECT 
    base_free + qty_in_tp_orders as aster_balance,
    quote_free as usdt_balance,
    total_value_usdt as account_value
  FROM ichigo.current_position_v;
"
```

Values should match dashboard.

---

## Troubleshooting Deployment Issues

### Issue: Build Fails

**Error:** `Type error: Cannot find module '@/lib/types'`

**Solution:**
```bash
# Verify all files are committed
git status

# Make sure tsconfig.json has correct paths
cat tsconfig.json
```

### Issue: Database Connection Fails

**Error:** `ECONNREFUSED` or `connection timeout`

**Solutions:**

1. **Check environment variables:**
   ```bash
   vercel env ls
   ```
   Ensure all 6 variables are set.

2. **Verify database accepts external connections:**
   ```bash
   PGPASSWORD=MyDB123456 psql -h 147.93.127.165 -U noor -d ichigo -c "SELECT 1"
   ```

3. **Check firewall rules:**
   - Vercel uses dynamic IPs
   - Database must allow connections from `0.0.0.0/0` or Vercel IP ranges
   - Alternatively, use a connection proxy

4. **Test from Vercel:**
   - Go to Functions logs
   - Check actual error message
   - May need to whitelist Vercel IPs

### Issue: Environment Variables Not Loading

**Error:** `DB_HOST is undefined`

**Solution:**
1. Verify variables are set for "Production" environment
2. Redeploy after adding variables:
   ```bash
   vercel --prod
   ```
3. Check if `.env.local` is in `.gitignore` (it should be)

### Issue: Slow Loading

**Causes:**
- Database query is slow
- High network latency
- Cold start (serverless functions)

**Solutions:**
1. Add database indexes:
   ```sql
   CREATE INDEX idx_decisions_decided_at ON ichigo.decisions(decided_at DESC);
   ```
2. Enable connection pooling (already configured)
3. Consider using Vercel's Edge Functions for faster response

### Issue: 500 Internal Server Error

**Check Vercel Function Logs:**

1. Go to Vercel dashboard
2. Project → Functions
3. Click on `/api/stats`
4. View error details

**Common causes:**
- Missing environment variable
- Database connection timeout
- SQL syntax error
- TypeScript compilation error

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Vercel dashboard → Your project
2. Settings → Domains
3. Add domain: `dashboard.yourdomain.com`

### Step 2: Configure DNS

Add these DNS records to your domain provider:

**For subdomain (dashboard.yourdomain.com):**
```
Type: CNAME
Name: dashboard
Value: cname.vercel-dns.com
```

**For root domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21

Type: AAAA  
Name: @
Value: 2606:4700:d0::6b76:1515
```

### Step 3: Wait for Propagation

- DNS changes take 5-60 minutes
- Vercel will auto-issue SSL certificate
- HTTPS will be enabled automatically

---

## Performance Optimization

### 1. Enable Edge Caching

Update `app/api/stats/route.ts`:

```typescript
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds
```

**Trade-off:** Faster response, but data may be 30 seconds stale.

### 2. Database Connection Pooling

Already configured in `lib/db.ts`:
```typescript
max: 20,                      // Max 20 connections
idleTimeoutMillis: 30000,     // Keep alive 30s
connectionTimeoutMillis: 10000 // Timeout after 10s
```

### 3. Image Optimization

No images in current version, but if adding:
```jsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  width={100} 
  height={100} 
  alt="Astro Bot"
/>
```

### 4. Bundle Size Analysis

```bash
npm run build

# Check output for bundle sizes
# Optimize large dependencies if needed
```

---

## Monitoring & Alerts

### Vercel Analytics

Enable in Vercel dashboard:
1. Project → Analytics
2. Enable "Web Analytics"
3. View real-time traffic and performance

### Vercel Monitoring

1. Project → Monitoring
2. View function execution times
3. Check error rates
4. Monitor cold starts

### Custom Alerts (Future)

Add alert system in dashboard:
```typescript
// Alert if bot hasn't updated in 10 minutes
if (timeSinceLastUpdate > 10 * 60 * 1000) {
  // Send notification (email, Slack, etc.)
}
```

---

## Updating the Dashboard

### Deploy New Changes

```bash
# Make changes locally
git add .
git commit -m "Update: description of changes"
git push origin main

# Vercel will auto-deploy (if GitHub integration is enabled)
```

### Manual Redeploy

```bash
# From CLI
vercel --prod

# Or click "Redeploy" in Vercel dashboard
```

### Rollback to Previous Version

1. Vercel dashboard → Deployments
2. Find previous working deployment
3. Click "⋯" → "Promote to Production"

---

## Security Considerations

### 1. Database Credentials

- **Never commit** `.env.local` to Git
- Use Vercel's encrypted environment variables
- Consider read-only database user for dashboard:

```sql
CREATE USER dashboard_readonly WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE ichigo TO dashboard_readonly;
GRANT USAGE ON SCHEMA ichigo TO dashboard_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA ichigo TO dashboard_readonly;
```

### 2. Authentication (Optional)

Add basic auth middleware:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !isValid(authHeader)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic' },
    });
  }
}
```

### 3. Rate Limiting

Prevent abuse with Vercel's built-in rate limiting:

```typescript
// vercel.json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "X-Rate-Limit",
          "value": "100"
        }
      ]
    }
  ]
}
```

---

## Costs

### Vercel Free Tier

**Included:**
- 100 GB bandwidth/month
- 100 hours function execution/month
- Unlimited deployments
- Automatic HTTPS
- Preview deployments

**Sufficient for:** Personal use, low traffic dashboards

### Vercel Pro ($20/month)

**Includes:**
- 1 TB bandwidth
- 1000 hours function execution
- Advanced analytics
- Custom domains

**Recommended for:** Production use, team access

### Database Costs

- Using your own PostgreSQL server: $0 (already running)
- Connection pooling: Configured, no extra cost

---

## Backup & Disaster Recovery

### 1. Database Backups

```bash
# Backup database
pg_dump -h 147.93.127.165 -U noor -d ichigo > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -h 147.93.127.165 -U noor -d ichigo < backup_20251029.sql
```

### 2. Code Backups

- GitHub serves as primary backup
- Vercel keeps deployment history (last 30 days)
- Local git repository is also a backup

### 3. Disaster Recovery Plan

**If dashboard goes down:**
1. Check Vercel status page
2. View function logs for errors
3. Rollback to previous deployment
4. Verify database is accessible

**If database goes down:**
1. Dashboard will show "Failed to fetch stats" error
2. Restore database from backup
3. Dashboard will auto-recover on next refresh (3 min)

---

## Support & Resources

**Official Documentation:**
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- React Query: https://tanstack.com/query/latest

**Vercel Support:**
- Email: support@vercel.com
- Community: https://github.com/vercel/next.js/discussions

**Dashboard Issues:**
- Check `README.md` for troubleshooting
- Review function logs in Vercel dashboard
- Test database connection manually

---

## Next Steps

After successful deployment:

1. ✅ Bookmark your dashboard URL
2. ✅ Set up monitoring/alerts
3. ✅ Share URL with team members
4. ✅ Consider adding authentication
5. ✅ Plan future enhancements

---

**Deployment Status**: Ready for Production  
**Vercel Compatible**: ✅ Yes  
**Database Tested**: ✅ Yes  
**Documentation**: Complete

**Good luck with your deployment! 🚀**

