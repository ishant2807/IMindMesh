# 🎨 Visual Design Guide

## Color System

### Primary Colors
```
Deep Navy:     #0B132B  ███████  Main backgrounds
Electric Blue: #1C2541  ███████  Secondary backgrounds  
Medium Blue:   #2D3561  ███████  Gradient accent
Aqua Teal:     #5BC0BE  ███████  Accent & Glows ⭐
```

### Teal Glow Variations
```css
/* Subtle Glow (Cards) */
rgba(91, 192, 190, 0.15)  /* Default shadow */
rgba(91, 192, 190, 0.3)   /* Hover shadow */

/* Medium Glow (Buttons) */
rgba(91, 192, 190, 0.3)   /* Default */
rgba(91, 192, 190, 0.5)   /* Hover */

/* Strong Glow (Focus/Active) */
rgba(91, 192, 190, 0.6)   /* Intense glow */
```

## Component Styling

### Cards
```
Background:    bg-white/10 (10% white transparency)
Backdrop:      backdrop-blur-md (frosted glass)
Border:        border-white/20 (subtle outline)
Shadow:        Teal glow (0.15 opacity)
Hover:         Stronger teal glow (0.3 opacity)
```

### Buttons
```
Background:    bg-accent (#5BC0BE)
Text:          text-white
Shadow:        Teal glow (0.3 opacity)
Hover:         
  - Stronger glow (0.5 opacity)
  - Lift effect (translateY -2px)
  - Outer glow ring
```

### Flashcards
```
Container:     card + glow-accent
Front:         White text on dark
Back:          Accent background tint
Flip:          3D rotation animation
Glow:          Consistent teal (not white!)
```

## Animations

### Background Gradient
```
Duration:      15 seconds
Easing:        ease
Loop:          infinite
Effect:        Smooth color shift
Colors:        Navy → Blue → Medium Blue → Blue → Navy
```

### Card Hover
```
Duration:      300ms
Effect:        Glow intensifies + border brightens
Easing:        ease-in-out
```

### Button Hover
```
Duration:      300ms
Effects:       
  - Glow strengthens
  - Lifts 2px upward
  - Adds outer glow ring
Easing:        ease-in-out
```

### Fade In
```
Duration:      300ms
Effect:        Opacity 0→1 + translateY 10px→0
Usage:         Page transitions
```

### Slide Up
```
Duration:      400ms
Effect:        Opacity 0→1 + translateY 30px→0
Usage:         Modal/dialog entry
```

## Glassmorphism Effect

All cards use glassmorphism:
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 8px 32px 0 rgba(91, 192, 190, 0.15);
```

## Glow Utility Classes

### .glow-accent
```css
box-shadow: 
  0 0 20px rgba(91, 192, 190, 0.4),
  0 0 40px rgba(91, 192, 190, 0.2);
```
**Usage**: Flashcards, special cards

### .glow-accent-strong
```css
box-shadow: 
  0 0 30px rgba(91, 192, 190, 0.6),
  0 0 60px rgba(91, 192, 190, 0.3),
  0 0 90px rgba(91, 192, 190, 0.1);
```
**Usage**: Active states, focus states

## Typography

### Headings
```
h1: text-3xl font-bold text-primary
h2: text-2xl font-bold text-primary
h3: text-xl font-semibold text-primary
h4: text-lg font-semibold text-primary
```

### Body Text
```
Default:  text-base text-text-muted
Emphasis: text-primary font-medium
Small:    text-sm text-text-muted
```

## Spacing System

```
xs:  0.5rem  (8px)
sm:  1rem    (16px)
md:  1.5rem  (24px)
lg:  2rem    (32px)
xl:  3rem    (48px)
```

## Border Radius

```
sm:  0.5rem  (8px)
md:  0.75rem (12px)
lg:  1rem    (16px)
xl:  1.5rem  (24px)
```

## Shadows

### Soft Shadow (Default)
```css
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```

### Soft Shadow Large (Hover)
```css
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
```

### Teal Glow Shadow
```css
box-shadow: 0 8px 32px 0 rgba(91, 192, 190, 0.15);
```

## Interactive States

### Hover
- Glow intensifies
- Border brightens
- Slight scale/lift (buttons)
- Smooth 300ms transition

### Focus
- Ring outline (accent color)
- Maintained accessibility
- No outline removal

### Active
- Slightly darker
- Stronger glow
- Immediate feedback

### Disabled
- Reduced opacity (0.5)
- No hover effects
- Cursor not-allowed

## Responsive Breakpoints

```
sm:  640px   (Mobile landscape)
md:  768px   (Tablet)
lg:  1024px  (Desktop)
xl:  1280px  (Large desktop)
2xl: 1536px  (Extra large)
```

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Accent color readable on dark backgrounds
- White text on teal buttons (high contrast)

### Focus Indicators
- Visible focus rings
- Accent color outlines
- 2px ring width

### Motion
- Respects prefers-reduced-motion
- Smooth, non-jarring animations
- Optional animation disable

## Design Principles

1. **Consistency**: Same teal glow everywhere
2. **Clarity**: Clear visual hierarchy
3. **Feedback**: Immediate hover/click response
4. **Beauty**: Modern glassmorphism aesthetic
5. **Performance**: GPU-accelerated animations

## Usage Examples

### Creating a Glowing Card
```jsx
<div className="card glow-accent">
  <h3 className="text-xl font-bold text-primary">Title</h3>
  <p className="text-text-muted">Content</p>
</div>
```

### Creating a Primary Button
```jsx
<button className="btn-primary">
  Click Me
</button>
```

### Creating a Badge
```jsx
<span className="badge badge-primary">
  New
</span>
```

## Quick Reference

| Element | Glow Color | Intensity | Animation |
|---------|-----------|-----------|-----------|
| Cards | Teal | 0.15→0.3 | 300ms |
| Buttons | Teal | 0.3→0.5 | 300ms + lift |
| Flashcards | Teal | 0.4 | 500ms flip |
| Background | Gradient | N/A | 15s cycle |
| Modals | Teal | 0.2 | 400ms slide |

---

**IMindMesh Design System v2.0** | Consistent, Beautiful, Accessible ✨
