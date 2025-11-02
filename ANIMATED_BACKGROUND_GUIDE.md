# 🌟 Animated Background Guide

## What's Included

Your IMindMesh now has a **beautiful animated particle background** with:

### ✨ Features

1. **Floating Particles**
   - Teal-colored particles (#5BC0BE)
   - Random sizes (1-4px)
   - Smooth floating motion
   - Variable opacity (0.2-0.7)

2. **Connecting Lines**
   - Particles within 120px connect with lines
   - Line opacity fades with distance
   - Creates a network/mesh effect
   - Matches your "Knowledge Mesh" theme!

3. **Responsive**
   - Particle count adjusts to screen size
   - Smooth on all devices
   - GPU-accelerated canvas rendering

4. **Performance Optimized**
   - Uses HTML5 Canvas
   - RequestAnimationFrame for smooth 60fps
   - Efficient particle system
   - Low CPU usage

## How It Works

### Particle System

```javascript
class Particle {
  - Random position on screen
  - Random velocity (slow drift)
  - Random size (1-4px)
  - Random opacity (0.2-0.7)
  - Wraps around screen edges
}
```

### Connection Algorithm

```javascript
For each particle pair:
  - Calculate distance
  - If distance < 120px:
    - Draw line between them
    - Line opacity = 0.15 * (1 - distance/120)
    - Creates fading effect
```

### Animation Loop

```
1. Clear canvas
2. Update all particle positions
3. Draw all particles
4. Draw connection lines
5. Request next frame
```

## Visual Effect

```
     ●────────●
    /│\      /│
   / │ \    / │
  ●  │  ●──●  │
   \ │ /    \ │
    \│/      \│
     ●────────●
```

Particles float and connect, creating a dynamic mesh network that:
- Complements your Knowledge Mesh feature
- Adds depth to the UI
- Provides subtle movement
- Doesn't distract from content

## Customization Options

### Change Particle Count

In `AnimatedBackground.jsx`, line ~51:
```javascript
// Current: 1 particle per 15000 pixels
const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

// More particles (denser):
const particleCount = Math.floor((canvas.width * canvas.height) / 10000);

// Fewer particles (lighter):
const particleCount = Math.floor((canvas.width * canvas.height) / 20000);
```

### Change Particle Speed

In `Particle` constructor, line ~25:
```javascript
// Current: Slow drift
this.speedX = Math.random() * 0.5 - 0.25;
this.speedY = Math.random() * 0.5 - 0.25;

// Faster:
this.speedX = Math.random() * 1 - 0.5;
this.speedY = Math.random() * 1 - 0.5;

// Slower:
this.speedX = Math.random() * 0.2 - 0.1;
this.speedY = Math.random() * 0.2 - 0.1;
```

### Change Connection Distance

In `connectParticles()`, line ~65:
```javascript
// Current: 120px
if (distance < 120) {

// Longer connections:
if (distance < 150) {

// Shorter connections:
if (distance < 100) {
```

### Change Particle Color

In `Particle.draw()`, line ~41:
```javascript
// Current: Teal
ctx.fillStyle = `rgba(91, 192, 190, ${this.opacity})`;

// Blue:
ctx.fillStyle = `rgba(28, 37, 65, ${this.opacity})`;

// Purple:
ctx.fillStyle = `rgba(147, 51, 234, ${this.opacity})`;

// White:
ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
```

### Change Particle Size

In `Particle` constructor, line ~23:
```javascript
// Current: 1-4px
this.size = Math.random() * 3 + 1;

// Larger:
this.size = Math.random() * 5 + 2;

// Smaller:
this.size = Math.random() * 2 + 0.5;
```

## Performance Tips

### If Animation is Laggy:

1. **Reduce particle count**:
   ```javascript
   const particleCount = Math.floor((canvas.width * canvas.height) / 20000);
   ```

2. **Disable connections**:
   Comment out `connectParticles()` in animate loop

3. **Reduce connection checks**:
   ```javascript
   if (distance < 80) { // Smaller radius = fewer checks
   ```

### If You Want More Particles:

1. **Increase density**:
   ```javascript
   const particleCount = Math.floor((canvas.width * canvas.height) / 8000);
   ```

2. **Add more variety**:
   ```javascript
   this.size = Math.random() * 6 + 1; // Bigger range
   ```

## Alternative Styles

### Style 1: Starfield
```javascript
// No connections, just floating dots
// Comment out connectParticles() call
// Increase particle count
// Reduce opacity
```

### Style 2: Neural Network
```javascript
// More connections, slower movement
// Increase connection distance to 200
// Reduce speed to 0.1
// Increase line opacity
```

### Style 3: Bubbles
```javascript
// Larger particles, no connections
// Increase size to 5-15px
// Comment out connectParticles()
// Add blur effect
```

## Layering

The background is on `z-index: 0`, content is on `z-index: 10`:

```jsx
<div className="min-h-screen relative">
  <AnimatedBackground />  {/* z-0 */}
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</div>
```

This ensures:
- Background stays behind everything
- Content remains interactive
- No pointer events on canvas

## Browser Compatibility

- ✅ Chrome/Edge: Perfect
- ✅ Firefox: Perfect
- ✅ Safari: Perfect
- ✅ Mobile: Works great
- ✅ Canvas API: Universal support

## Accessibility

- **Motion**: Respects `prefers-reduced-motion`
- **Performance**: Lightweight, no lag
- **Pointer Events**: Disabled, doesn't interfere
- **Screen Readers**: Ignored (decorative)

## Combining with Gradient

You now have **both**:
1. Animated gradient background (CSS)
2. Floating particles (Canvas)

They work together beautifully:
- Gradient provides color shifts
- Particles add movement and depth
- Combined effect is stunning!

## Troubleshooting

### Particles not showing?
- Check browser console for errors
- Verify canvas is rendering
- Check z-index layering

### Performance issues?
- Reduce particle count
- Disable connections
- Check GPU acceleration

### Want to disable?
Comment out in `App.jsx`:
```jsx
{/* <AnimatedBackground /> */}
```

---

**Result**: A beautiful, animated, performant particle background that complements your Knowledge Mesh theme! 🌟

**IMindMesh v2.0** | Animated & Beautiful ✨
