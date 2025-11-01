# Visual Guide: Database Switcher

## 🎨 UI Layout

### Desktop View (Light Mode)
```
┌─────────────────────────────────────────────────────────────────────┐
│  [🍓]  |  LIVE DASHBOARD              [ICHIGO ⬜]  [LIGHT ⬜]      │
│                                            ↑            ↑            │
│                                      Database      Theme            │
└─────────────────────────────────────────────────────────────────────┘
```

### Desktop View (Dark Mode)
```
┌─────────────────────────────────────────────────────────────────────┐
│      |  LIVE DASHBOARD              [ICHIGO ⬜]  [DARK ⬜]         │
│      └─ Logo slides off              (Green borders & text)        │
└─────────────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌────────────────────────────┐
│ [🍓] | LIVE                │
│     [ICHIGO ⬜] [LIGHT ⬜] │
│     (Smaller size)         │
└────────────────────────────┘
```

## 🔄 Toggle States

### Database Switcher

#### State 1: ICHIGO Selected
```
┌──────────────────┐
│ ICHIGO  [■▫]    │  ← Indicator on LEFT
└──────────────────┘
```

#### State 2: ASTERDEX Selected
```
┌──────────────────┐
│ ASTERDEX  [▫■]  │  ← Indicator on RIGHT
└──────────────────┘
```

### Theme Switcher (for comparison)

#### Light Mode
```
┌──────────────────┐
│ LIGHT  [■▫]     │
└──────────────────┘
```

#### Dark Mode
```
┌──────────────────┐
│ DARK  [▫■]      │
└──────────────────┘
```

## 🎯 Color Schemes

### Light Mode Colors
- **Background**: White (#ffffff)
- **Border**: Dark Gray (#1f2937)
- **Text**: Dark Gray (#1f2937)
- **Toggle Indicator**: Dark Gray (#1f2937)

### Dark Mode Colors
- **Background**: Black (#000000)
- **Border**: Green (#16a34a)
- **Text**: Green (#16a34a)
- **Toggle Indicator**: Green (#16a34a)

## 📱 Responsive Breakpoints

### Desktop (md: 768px+)
- Full text labels
- Normal spacing (gap-3)
- Full padding (px-3 py-1.5)
- Text size: text-xs

### Mobile (< 768px)
- Compact text labels
- Reduced spacing (gap-2)
- Reduced padding (px-2 py-1.5)
- Text size: text-[10px]

## ⚡ Interaction States

### Hover Effect
```
Normal: border-2 solid
Hover:  background slightly darker
        (Light: #f9fafb, Dark: #001100)
```

### Click Animation
```
Smooth transition on all properties (0.3s)
Toggle indicator slides with easing
Label updates instantly
```

### Loading State
```
While data is loading:
- Toggle remains active
- Existing data stays visible
- Loading spinner in content area
```

## 🔧 Implementation Details

### Button Structure
```tsx
<button>
  <span>ICHIGO / ASTERDEX</span>  {/* Label */}
  <div class="toggle-container">   {/* Toggle frame */}
    <div class="indicator" />      {/* Sliding indicator */}
  </div>
</button>
```

### Toggle Container Dimensions
- Width: 32px (w-8)
- Height: 16px (h-4)
- Border: 2px solid
- Background: transparent

### Indicator Dimensions
- Width: 12px (w-3)
- Height: 100% (h-full)
- Position: absolute
- Left: 0 (Ichigo) or calc(100% - 12px) (Asterdex)
- Transition: 0.3s ease all

## 🎬 Animation Sequence

### Switching from Ichigo to Asterdex
```
1. User clicks button
2. Label changes: "ICHIGO" → "ASTERDEX"
3. Indicator slides: left → right (0.3s)
4. useDatabase hook updates
5. localStorage saves selection
6. API call with ?database=asterdex
7. Data refetches
8. UI updates with new data
```

## 📐 Spacing & Alignment

### Header Layout
```
┌─────────────────────────────────────────────────┐
│  [Logo + Divider + Title]          [Controls]   │
│  ← flex-grow                        → flex-none │
│  gap-4 between elements             gap-3       │
└─────────────────────────────────────────────────┘
```

### Controls Section
```
[Database Switcher]  [Theme Switcher]
    gap-2 (mobile)
    gap-3 (desktop)
```

## 🎨 Design Principles

1. **Consistency**: Matches existing design language
2. **Clarity**: Clear labels show current selection
3. **Feedback**: Immediate visual response on interaction
4. **Accessibility**: High contrast, clear labels
5. **Responsiveness**: Adapts smoothly to all screen sizes

## 💡 Best Practices Used

- Semantic HTML (proper button elements)
- Inline styles for dynamic theming
- Smooth CSS transitions
- Proper focus states
- Touch-friendly tap targets (min 44x44px)
- Clear hover states
- Screen reader friendly labels (title attribute)

## 🔍 Testing Checklist

Visual Testing:
- [ ] Buttons aligned horizontally
- [ ] Labels clearly readable
- [ ] Toggle indicators visible
- [ ] Colors match theme
- [ ] Smooth animations
- [ ] Responsive on mobile
- [ ] No layout shift on switch
- [ ] Proper spacing maintained

Interaction Testing:
- [ ] Click switches database
- [ ] Hover shows feedback
- [ ] Focus states visible
- [ ] Touch targets adequate
- [ ] Loading states handled
- [ ] Error states clear

## 📱 Mobile Specific Notes

### Touch Optimization
- Minimum touch target: 44x44px (iOS) / 48x48px (Android)
- Adequate spacing between buttons (gap-2)
- No hover states on mobile
- Instant feedback on tap

### Text Scaling
- Uses text-[10px] on mobile (10px)
- Uses text-xs on desktop (12px)
- Font remains IBM Plex Mono (monospace)
- UPPERCASE for emphasis

## 🎯 Accessibility Features

- Clear labels: "Switch to Ichigo" / "Switch to Asterdex"
- Title attributes for screen readers
- Proper button semantics
- Keyboard accessible (tab navigation)
- High contrast ratios (WCAG AA compliant)
- Visual and text indicators of state

## 🌟 Polish Details

1. **Logo animation**: Slides off in dark mode (desktop only)
2. **Smooth transitions**: All property changes animated
3. **Consistent motion**: Same easing as theme toggle
4. **Micro-interactions**: Satisfying click feedback
5. **Professional appearance**: Clean, modern, minimalist

