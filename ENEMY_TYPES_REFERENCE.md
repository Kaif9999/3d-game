# Enemy Types Visual Reference

## Complete Enemy Roster

### Level 1-2: Basic Enemies

#### 1. BASIC (Red)
- **Color**: Red (#ef4444, #dc2626, #991b1b)
- **Size**: Standard (50px)
- **Health**: 1
- **Speed**: 0.4 (medium)
- **Points**: 100
- **Behavior**: Standard downward movement
- **Visual**: Red gradient triangle ship with standard wings

#### 2. FAST (Orange)
- **Color**: Orange (#f59e0b, #d97706, #b45309)
- **Size**: Standard (50px)
- **Health**: 1
- **Speed**: 0.8 (very fast)
- **Points**: 150
- **Behavior**: Rapid downward movement
- **Visual**: Orange gradient triangle ship

---

### Level 3-4: Introduction of Specialized Types

#### 3. TANK (Gray)
- **Color**: Gray (#6b7280, #4b5563, #374151)
- **Size**: Large (60px)
- **Health**: 1
- **Speed**: 0.2 (very slow)
- **Points**: 300
- **Behavior**: Slow but imposing
- **Visual**: Large gray triangle ship with thicker appearance

#### 4. ZIGZAG (Purple)
- **Color**: Purple (#8b5cf6, #7c3aed, #6d28d9)
- **Size**: Standard (50px)
- **Health**: 1
- **Speed**: 0.4 (medium)
- **Points**: 200
- **Behavior**: Sine wave zigzag movement pattern
- **Visual**: Purple gradient triangle ship

---

### Level 5-6: Advanced Threats

#### 5. SHOOTER (Pink)
- **Color**: Pink (#ec4899, #db2777, #be185d)
- **Size**: Standard (50px)
- **Health**: 1
- **Speed**: 0.3 (slow)
- **Points**: 250
- **Behavior**: Fires bullets at player every 2 seconds
- **Visual**: Pink gradient triangle ship

#### 6. STEALTH (Teal)
- **Color**: Teal (#14b8a6, #0d9488, #0f766e)
- **Size**: Standard (50px)
- **Health**: 1
- **Speed**: 0.6 (fast)
- **Points**: 400
- **Behavior**: Standard movement with dim engines
- **Visual**: Teal gradient with barely visible single engine (opacity 0.4)
- **Special**: Dim engine effect makes it harder to spot

---

### Level 7-8: Fortified Forces

#### 7. SHIELD (Blue)
- **Color**: Blue (#3b82f6, #2563eb, #1d4ed8)
- **Size**: Standard (50px)
- **Health**: 2 (takes 2 hits to destroy)
- **Speed**: 0.3 (slow)
- **Points**: 500
- **Behavior**: Protected by energy shield
- **Visual**: Blue gradient with pulsing shield circle (r: 20-22)
- **Special**: Animated shield barrier

#### 8. BOMBER (Yellow)
- **Color**: Yellow (#eab308, #ca8a04, #a16207)
- **Size**: Standard (50px)
- **Health**: 1
- **Speed**: 0.35 (medium-slow)
- **Points**: 350
- **Behavior**: Standard movement
- **Visual**: Yellow gradient with orange pulsing bomb indicator in center
- **Special**: Central bomb marker (r: 2-4 pulsing)

---

### Level 9-10: Elite Squadron

#### 9. SWARM (Green)
- **Color**: Green (#10b981, #059669, #047857)
- **Size**: Small (40px)
- **Health**: 1
- **Speed**: 0.7 (very fast)
- **Points**: 180
- **Behavior**: Fast small target
- **Visual**: Small green triangle ship with proportionally smaller components
- **Special**: Smaller hitbox, harder to hit

#### 10. ELITE (Magenta)
- **Color**: Magenta (#a855f7, #9333ea, #7e22ce)
- **Size**: Large (50px with extended wings)
- **Health**: 3 (mini-boss)
- **Speed**: 0.5 (medium)
- **Points**: 800
- **Behavior**: Multiple hits required
- **Visual**: Magenta gradient with extended wing design, health bar displayed
- **Special**: Shows health bar above enemy

---

### Level 11: Final Boss

#### 11. BOSS (Dark Red)
- **Color**: Dark Red (#dc2626, #991b1b, #7f1d1d)
- **Size**: Huge (80px)
- **Health**: 30 (boss battle)
- **Speed**: 0.15 (very slow)
- **Points**: 10,000
- **Behavior**: Tank with massive health pool
- **Visual**: Massive dark red ship with extended wings and prominent health bar
- **Special**:
  - Large health bar display showing "BOSS: HP/30"
  - Screen shake on death
  - Spawns centered at x=50%
  - Triggers victory screen on defeat

---

## Visual Differences Summary

### By Size:
- **Small (40px)**: Swarm
- **Standard (50px)**: Basic, Fast, Zigzag, Shooter, Stealth, Shield, Bomber, Elite
- **Large (60px)**: Tank
- **Huge (80px)**: Boss

### By Special Effects:
- **Shield Effect**: Shield (pulsing circle)
- **Dim Engines**: Stealth (low opacity engines)
- **Bomb Indicator**: Bomber (pulsing center)
- **Health Bar**: Elite, Boss

### By Shape Variation:
- **Standard Triangle**: Basic, Fast, Tank, Zigzag, Shooter, Shield, Bomber, Swarm
- **Extended Wings**: Elite, Boss (extended wing paths)
- **Small Triangle**: Swarm (compact design)

### By Color Families:
- **Warm Colors**: Fast (Orange), Bomber (Yellow)
- **Cool Colors**: Basic (Red), Shooter (Pink), Zigzag (Purple), Stealth (Teal), Shield (Blue), Elite (Magenta), Boss (Dark Red)
- **Neutral**: Tank (Gray)
- **Nature**: Swarm (Green)

---

## Level Composition

| Level | Enemy Types | Count | Description |
|-------|-------------|-------|-------------|
| 1 | Basic | 10 | Introduction |
| 2 | Basic, Fast | 15 | Speed introduced |
| 3 | Tank, Fast | 20 | Size variety |
| 4 | Zigzag, Basic | 25 | Movement patterns |
| 5 | Shooter, Zigzag | 30 | Enemy fire |
| 6 | Stealth, Fast | 35 | Visibility challenge |
| 7 | Shield, Shooter | 40 | Durability test |
| 8 | Bomber, Tank | 45 | Heavy assault |
| 9 | Swarm, Stealth | 50 | Numbers & stealth |
| 10 | Elite, Shield | 55 | Multiple hits |
| 11 | Boss | 1 | Final challenge |

---

## Implementation Details

### Color System:
Each enemy type has a three-color gradient:
- **Primary**: Main body color (lightest)
- **Secondary**: Wing/accent color (medium)
- **Tertiary**: Stroke/outline color (darkest)

### Hitbox Sizes:
```typescript
SWARM: 2 units
BASIC/FAST/ZIGZAG/SHOOTER/STEALTH/SHIELD/BOMBER: 2.5 units
TANK: 3 units
ELITE: 3.5 units
BOSS: 5 units
```

### Engine Effects:
- **Standard**: Dual yellow engines with 0.3s pulse (opacity 0.6-1.0)
- **Stealth**: Single teal engine with 0.5s pulse (opacity 0.2-0.6)

### Movement Patterns:
- **Linear**: Basic, Fast, Tank, Shooter, Stealth, Shield, Bomber, Swarm, Elite, Boss
- **Sine Wave**: Zigzag (Math.sin(phase) * 0.5 horizontal offset)

---

## Strategy Guide

### Early Levels (1-4):
- Focus on aim and dodging basics
- Learn enemy speeds
- Practice with zigzag patterns

### Mid Levels (5-7):
- Dodge enemy fire from Shooters
- Watch for Stealth enemies with dim engines
- Multiple hits needed for Shield enemies

### Late Levels (8-10):
- Face swarms of small, fast targets
- Deal with Elite enemies (3 hits)
- Manage multiple threat types simultaneously

### Boss Battle (11):
- 30 hits required
- Slow but deadly
- Collect all power-ups
- Maintain combo for maximum points
- Victory triggers game completion!

---

**Total Unique Enemy Types**: 11
**Visual Variations**: Color, Size, Shape, Effects, Animations
**Behavior Patterns**: 2 (Linear, Zigzag)
**Health Pools**: 1-30 HP
**Speed Range**: 0.15-0.8 units/frame
