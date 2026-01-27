# 2D Space Shooter Game

A classic 2D space shooter game built with Next.js 16 and Tailwind CSS, inspired by retro arcade games.

## Features

### Core Gameplay
- **Player Ship**: Blue spaceship controlled by keyboard or touch
- **Alien Enemies**: Multiple enemy types (Basic, Fast, Tank, Zigzag, Shooter, Boss)
- **Shooting Mechanics**: Fire bullets to destroy aliens
- **Score System**: Earn points per alien destroyed with combo multipliers
- **Lives System**: Start with 3 lives (displayed as blue diamonds)
- **Progressive Difficulty**: Game gets harder with each wave
- **Wave System**: Survive increasingly difficult waves of enemies

### Power-ups (10 Types)
- **Double Shot**: Fire two bullets simultaneously
- **Triple Shot**: Fire three bullets in a spread pattern
- **Shield**: Temporary invulnerability
- **Speed Boost**: Increased movement speed
- **Rapid Fire**: Reduced fire delay
- **Laser Beam**: Continuous vertical damage beam
- **Homing Missile**: Auto-targeting missiles
- **Time Slow**: Slows down enemies and bullets
- **Score Multiplier**: Increases points earned
- **Extra Life**: Gain an additional life

### Visual Effects
- Animated starfield background
- Explosion effects when aliens are destroyed
- Particle system with gravity simulation
- Screen shake on impacts
- Boss health bar display
- Glowing effects on UI elements
- Power-up indicators with countdown timers

### Game Controls
- **Pause Button**: Pause/resume game with button or ESC key
- **Mute/Unmute**: Toggle audio
- **Accessibility**: ARIA labels and keyboard navigation
- **Mobile Support**: Touch controls for mobile devices

### Game States
- Start screen with retro styling
- Gameplay with HUD
- Pause menu
- Game over screen

## Controls

### Keyboard Controls
- **Move Left**: `←` (Left Arrow) or `A`
- **Move Right**: `→` (Right Arrow) or `D`
- **Shoot**: `SPACE`
- **Pause**: `ESC`

### Touch Controls (Mobile)
- **Move Ship**: Touch and drag horizontally
- **Fire**: Tap anywhere on screen

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
space-shooter-game/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   └── SpaceShooterGame.tsx  # Main game component
│   ├── lib/
│   │   ├── gameConstants.ts  # Game configuration constants
│   │   ├── types.ts          # TypeScript type definitions
│   │   └── powerUpUtils.ts   # Power-up utility functions
│   ├── utils/
│   │   └── audioManager.ts   # Audio management singleton
│   └── styles/
│       └── globals.css       # Global styles and animations
├── public/
│   └── sounds/              # Game audio files
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
- Bullet-to-alien collision detection with hitbox calculations
- Player-to-alien collision detection
- Bullet-to-bullet collision
- Power-up collection

### Difficulty Scaling
- Alien spawn rate increases with each wave
- Alien movement speed increases progressively
- Boss enemies spawn every 5 waves
- Different enemy types with unique behaviors:
  - **Basic**: Standard movement
  - **Fast**: High-speed descent
  - **Tank**: Slow but durable
  - **Zigzag**: Horizontal sine wave pattern
  - **Shooter**: Fires bullets at player
  - **Boss**: Large health pool with slower movement

### Scoring System
- Base points per enemy type
- Combo multiplier for consecutive kills
- Score multiplier power-up
- High score persistence via localStorage

### Performance
- Optimized game loop
- Efficient state management with React hooks
- Particle system with object limit
- Smooth animations using CSS transforms

## License

MIT License - Feel free to use and modify for your own projects!

## Credits

Created with Next.js 16, React 19, and Tailwind CSS
