# 2D Space Shooter Game

A classic 2D space shooter game built with Next.js 16 and Tailwind CSS, inspired by retro arcade games.

## Features

### Core Gameplay
- **Player Ship**: Blue spaceship with smooth controls
- **6 Enemy Types**: Basic, Fast, Tank, Zigzag, Shooter, and Boss enemies
- **Shooting Mechanics**: Fire bullets to destroy aliens
- **Wave System**: Progressive difficulty with endless waves
- **Lives System**: Start with 3 lives, collect power-ups for more (max 5)
- **Combo System**: Chain kills for bonus points

### Power-Up System (10 Types)
- **⚡⚡ Double Shot**: Fire two bullets simultaneously
- **⚡⚡⚡ Triple Shot**: Fire three bullets in a spread pattern
- **🛡️ Shield**: Temporary invincibility
- **⚡ Speed Boost**: Increased movement speed
- **🔥 Rapid Fire**: Faster shooting rate
- **🔆 Laser Beam**: Continuous damage beam (visual indicator)
- **🎯 Homing Missile**: Smart targeting (visual indicator)
- **⏱️ Time Slow**: Slows enemy movement by 50%
- **✨ Score Multiplier**: 2x points for 10 seconds
- **❤️ Extra Life**: Gain an additional life

### Visual Effects
- **Animated Starfield**: Scrolling background with 100 stars
- **Particle System**: Colorful explosions and effects
- **Boss Health Bar**: Prominent HP display for boss enemies
- **Power-Up Icons**: Spinning, glowing collectibles
- **Screen Shake**: Impact feedback on hits
- **Glowing Effects**: Ships, bullets, and UI elements

### Controls
- **Desktop**: Arrow keys/WASD + Space to shoot, ESC to pause
- **Mobile**: Touch controls with swipe movement and fire button

### Game States
- **Start Screen**: Retro-styled menu with controls
- **Gameplay**: Active combat with HUD
- **Pause Menu**: ESC to pause/resume/restart/quit
- **Game Over**: Final score with play again option

## Controls

### Desktop
- **Move Left**: `←` (Left Arrow) or `A`
- **Move Right**: `→` (Right Arrow) or `D`
- **Shoot**: `SPACE`
- **Pause**: `ESC`
- **Mute/Unmute**: Click button in HUD

### Mobile
- **Move**: Swipe left/right on screen
- **Shoot**: Tap the fire button (🔥)
- **Pause**: Not available on mobile (coming soon)

## How to Play

1. Press "START GAME" to begin
2. Move your blue ship left and right to avoid red aliens
3. Press SPACE to shoot bullets at the aliens
4. Destroy aliens to earn points
5. Avoid collisions with aliens (you have 3 lives)
6. Try to achieve the highest score possible!

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

The game will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
3d-game/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   └── SpaceShooterGame.tsx  # Main game component
│   └── styles/
│       └── globals.css      # Global styles and animations
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Technologies Used

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Animations**: Custom animations for game effects

## Game Mechanics

### Collision Detection
- Bullet-to-alien collision detection
- Player-to-alien collision detection
- Precise hitbox calculations

### Difficulty Scaling
- Alien spawn rate increases with score
- Alien movement speed increases with score
- Maximum difficulty cap to maintain playability

### Performance
- Optimized game loop running at 20 FPS (50ms intervals)
- Efficient state management with React hooks
- Smooth animations using CSS transforms

## Recent Updates (v1.1.0)

### 🎮 New Features
- ✅ Visual power-up icons with spinning animations
- ✅ Boss health bar with real-time HP display
- ✅ Mobile touch controls (swipe + fire button)
- ✅ Score multiplier power-up (2x points)
- ✅ Time slow power-up (50% enemy speed reduction)
- ✅ Extra life power-up (up to 5 lives)

### ⚡ Performance
- ✅ Replaced setInterval with requestAnimationFrame (60 FPS)
- ✅ Smoother gameplay and better frame timing
- ✅ Reduced CPU usage when tab is inactive

### 🎨 UI/UX
- ✅ Enhanced power-up indicators with icons
- ✅ Color-coded power-up system
- ✅ Dynamic lives display (scales to 5)
- ✅ Improved particle effects

See [CHANGELOG.md](./CHANGELOG.md) for full details.

## Future Improvements

See [FEATURE_REQUESTS.md](./FEATURE_REQUESTS.md) for planned features including:
- Component refactoring for better code organization
- Difficulty settings (Easy/Normal/Hard)
- Achievements system
- Local leaderboard
- More enemy types
- Special weapons
- And 15+ more improvements!

## License

MIT License - Feel free to use and modify for your own projects!

## Credits

Created with Next.js 16, React 19, and Tailwind CSS
