# 2D Space Shooter Game

A classic 2D space shooter game built with Next.js 16 and Tailwind CSS, inspired by retro arcade games.

## Features

- **Player Ship**: Blue spaceship controlled by keyboard
- **Alien Enemies**: Red aliens that descend from the top
- **Shooting Mechanics**: Fire blue bullets to destroy aliens
- **Score System**: Earn 100 points per alien destroyed
- **Lives System**: Start with 3 lives (displayed as blue diamonds)
- **Progressive Difficulty**: Game gets harder as score increases
- **Visual Effects**: 
  - Animated starfield background
  - Explosion effects when aliens are destroyed
  - Glowing effects on UI elements
- **Game States**: Start screen, gameplay, and game over screen

## Controls

- **Move Left**: `←` (Left Arrow) or `A`
- **Move Right**: `→` (Right Arrow) or `D`
- **Shoot**: `SPACE`

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

## License

MIT License - Feel free to use and modify for your own projects!

## Credits

Created with Next.js 16, React 19, and Tailwind CSS
