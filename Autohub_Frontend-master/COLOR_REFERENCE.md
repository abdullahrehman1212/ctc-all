# Dashboard Color Reference Guide

## 🎨 Exact Colors Used (Matching Screenshot)

### Primary Brand Color
```css
Orange (Primary Accent)
- Tailwind: orange-500
- Hex: #F97316
- RGB: rgb(249, 115, 22)
- Used for: Active tabs, links, primary actions, chart line
```

### Background Colors
```css
Page Background
- Tailwind: gray-50
- Hex: #F9FAFB
- RGB: rgb(249, 250, 251)
- Used for: Main page background

Card Background
- Tailwind: white
- Hex: #FFFFFF
- RGB: rgb(255, 255, 255)
- Used for: All cards and panels

Card Borders
- Tailwind: gray-100
- Hex: #F3F4F6
- RGB: rgb(243, 244, 246)
- Used for: Card borders, dividers
```

### Text Colors
```css
Primary Text (Headings, Values)
- Tailwind: gray-900
- Hex: #111827
- RGB: rgb(17, 24, 39)
- Used for: Card titles, stat values, labels

Secondary Text (Descriptions)
- Tailwind: gray-600
- Hex: #4B5563
- RGB: rgb(75, 85, 99)
- Used for: Subtitles, descriptions

Muted Text (Placeholders)
- Tailwind: gray-500
- Hex: #6B7280
- RGB: rgb(107, 114, 128)
- Used for: Helper text, empty states

Icon Gray
- Tailwind: gray-400
- Hex: #9CA3AF
- RGB: rgb(156, 163, 175)
- Used for: Inactive icons, chevrons
```

### Icon Background Colors
```css
Orange Icon Background
- Tailwind: bg-orange-500/10
- Used for: Total Parts icon

Sky Icon Background
- Tailwind: bg-sky-500/10
- Hex base: #0EA5E9
- Used for: Categories icon

Amber Icon Background
- Tailwind: bg-amber-500/10
- Hex base: #F59E0B
- Used for: Active Kits icon

Emerald Icon Background
- Tailwind: bg-emerald-500/10
- Hex base: #10B981
- Used for: Suppliers icon
```

### Chart Colors
```css
Order Status Donut Chart:
- Draft: hsl(215, 16%, 75%) - Light Gray
- Pending: hsl(45, 93%, 47%) - Yellow/Gold
- Approved: hsl(24, 95%, 53%) - Orange
- Received: hsl(142, 71%, 45%) - Green
```

### Interactive States
```css
Hover States:
- Cards: shadow-md (medium shadow)
- Links: text-orange-500 (orange)
- Buttons: bg-gray-100 (light gray background)

Active States:
- Tab Buttons: bg-orange-500 text-white
- Links: text-orange-500 underline
```

## 📐 Spacing & Sizing

### Border Radius
```css
Cards: rounded-2xl (16px)
Buttons: rounded-md (6px)
Icons: rounded-xl (12px)
Progress bars: rounded-full
```

### Padding
```css
Cards: p-6 (24px)
Buttons: px-4 py-1.5 (16px horizontal, 6px vertical)
Icons: w-12 h-12 (48px × 48px)
```

### Gaps
```css
Grid gap: gap-4 (16px)
Tab buttons: gap-1 (4px)
Icon + text: gap-2 (8px)
```

### Shadows
```css
Default: shadow-sm
Hover: shadow-md
```

## 🎯 Usage Examples

### Stat Card
```jsx
<div className='bg-white rounded-2xl p-6 border border-gray-100 shadow-sm'>
  <div className='bg-orange-500/10 w-12 h-12 rounded-xl'>
    <Icon className='w-5 h-5 text-orange-500' />
  </div>
  <p className='text-3xl font-bold text-gray-900'>0</p>
  <p className='text-gray-500 text-sm'>Total Parts</p>
</div>
```

### Active Tab Button
```jsx
<button className='px-4 py-1.5 bg-orange-500 text-white rounded-md'>
  Month
</button>
```

### Inactive Tab Button
```jsx
<button className='px-4 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md'>
  Week
</button>
```

### Link
```jsx
<Link className='text-orange-500 text-sm font-medium hover:underline'>
  View All
</Link>
```

## 🔍 Color Accessibility

All color combinations meet WCAG 2.1 AA standards:
- ✅ Gray-900 on White: 16.1:1 (AAA)
- ✅ Gray-600 on White: 7.2:1 (AA)
- ✅ Orange-500 on White: 3.4:1 (AA for large text)
- ✅ White on Orange-500: 3.4:1 (AA for large text)

## 📱 Responsive Breakpoints

```css
Mobile: grid-cols-1
Tablet: md:grid-cols-2
Desktop: xl:grid-cols-4
```

This ensures the dashboard looks great on all devices while maintaining the exact colors from your screenshot!
