# Database Switching Feature

## Overview
The dashboard now supports switching between two trading bot databases in real-time without page refresh:
- **Ichigo Bot**: Database `ichigo`, Schema `ichigo`
- **Asterdex Bot**: Database `asterdex`, Schema `ichigo`

## Implementation

### UI Location
The database switcher is located in the header, next to the dark/light mode toggle.

- **Desktop**: Both switchers are visible side-by-side
- **Mobile**: Responsive design with smaller text and spacing

### Features
1. **Real-time Switching**: Click the switcher to toggle between Ichigo and Asterdex
2. **Persistent Selection**: Your database selection is saved in localStorage
3. **Visual Feedback**: Toggle shows current database (left = Ichigo, right = Asterdex)
4. **Minimal Design Changes**: Matches existing design aesthetic perfectly

### Technical Details

#### Architecture
```
contexts/DatabaseContext.tsx     → React Context for database state
hooks/useStats.ts                → Updated to include database parameter
lib/db.ts                        → Dynamic connection pooling per database
lib/queries.ts                   → All queries accept optional database parameter
app/api/stats/route.ts          → API route accepts database query parameter
app/page.tsx                     → UI with database switcher
```

#### Database Structure
Both databases share the same schema structure:
- Schema name: `ichigo`
- Tables: `decisions`, `orders`, `current_position_v`, etc.
- Views: `open_tp_orders_enhanced_v`, `recent_trades_pnl_v`, etc.

#### Connection Pooling
The system creates separate connection pools for each database:
- Pool for `ichigo` database
- Pool for `asterdex` database
- Automatic pool management and reuse

### Usage

#### For End Users
1. Open the dashboard
2. Look for the switcher button in the top-right header
3. Click to toggle between ICHIGO and ASTERDEX
4. Data refreshes automatically

#### For Developers
The database selection is available via the `useDatabase()` hook:

```typescript
import { useDatabase } from '@/contexts/DatabaseContext';

function MyComponent() {
  const { database, setDatabase } = useDatabase();
  
  // database is either 'ichigo' or 'asterdex'
  // setDatabase('ichigo') or setDatabase('asterdex')
}
```

All query functions accept an optional `database` parameter:
```typescript
const stats = await getDashboardStats('asterdex');
const position = await getCurrentPosition('ichigo');
```

### Environment Variables
No changes needed to existing environment variables:
- `DB_HOST` - Same host for both databases
- `DB_PORT` - Same port for both databases
- `DB_USER` - Same user credentials
- `DB_PASSWORD` - Same password

The dashboard dynamically connects to either `ichigo` or `asterdex` database based on user selection.

### Benefits
1. **Single Dashboard**: Monitor both bots from one interface
2. **Easy Comparison**: Quickly switch to compare performance
3. **No Duplication**: One codebase serves both bots
4. **Scalable**: Easy to add more databases in the future
5. **Clean Design**: Minimal visual changes, intuitive UX

### Future Enhancements
Potential additions:
- Side-by-side comparison view
- Multi-database statistics
- Custom database configuration
- Additional bot support

