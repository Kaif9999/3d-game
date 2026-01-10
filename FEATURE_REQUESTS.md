# Feature Requests / Improvements

This file tracks ideas discovered while reviewing the current codebase.

## High impact (gameplay)

- **Levels vs waves (unify systems)**: The code has both `level` and `wave`, but only `wave` is active. Either remove unused `level` state or implement level progression with distinct objectives and UI.
- **Boss patterns**: Boss currently behaves like a slow tank. Add phases (spread shot, zigzag, charge) and a visible boss health bar.
- **Invulnerability frames**: After a player hit, add a short invulnerable window (and blink effect) to avoid immediate multi-hit deaths.
- **Mobile controls**: Add on-screen buttons or touch drag controls for mobile.
- **Difficulty curve tuning**: Wave spawn delay and speed are currently linear; consider capping speeds and using non-linear spawn curves.

## UI / UX

- **Settings panel**: Add separate volume sliders for music/SFX, not just mute.
- **Power-up legend**: Display icon + name legend on pause screen (or a help modal).
- **Accessibility**: Add reduced-motion mode (disable screen shake/pulse animations) and improve contrast for small text.
- **Responsive HUD**: Ensure the HUD doesn’t overflow on small screens.

## Code quality / architecture

- **Refactor `SpaceShooterGame.tsx`**: Split into modules (input, physics/update loop, rendering, audio). It’s currently a single large component.
- **Game loop**: Consider switching to `requestAnimationFrame` for smoother animation and consistent deltas.
- **Entity management**: Introduce a simple entity system (or object pooling) for bullets/particles to reduce allocations.
- **Type correctness**: Use a strongly typed mapping for power-up timers rather than dynamic keys.

