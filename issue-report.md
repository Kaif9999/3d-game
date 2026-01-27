# Bug Report: Space Shooter Game

## Power-Up Timer Expiration
- **Issue**: Power-up timers stay active far longer than intended. The code captures `Date.now()` multiple times within the same loop, leading to stale values and inconsistent calculations.
- **Fix**: Capture the current time once per loop iteration and reference it for all timer calculations.

## Inconsistent Audio Muting
- **Issue**: `toggleMute` does not stop sounds that are already playing because cloned audio elements continue running.
- **Fix**: Track playing sound instances and pause them when muting; ensure clones respect muted state.

## Game Loop Interval Cleanup
- **Issue**: Game loop `setInterval` continues running after the game stops.
- **Fix**: Ensure `clearInterval` is called when the game is paused or quit.

## Enemy Bullet Collision Accuracy
- **Issue**: Collision detection compares percentages with pixel-based distances, making hits inconsistent.
- **Fix**: Normalize units or adjust thresholds during collision checks.

## Shooter Enemy Behavior
- **Issue**: Shooter enemies may still fire after being marked for removal because removal logic is delayed.
- **Fix**: Skip firing logic for enemies added to the removal set.

## Shield Power-Up Handling
- **Issue**: Shield power-up uses `Date.now()` checks similar to timers, so collisions may not respect shield status.
- **Fix**: Capture time once per iteration and update shield timing accordingly.

## Rapid Fire Cooldown
- **Issue**: Rapid fire slowdown uses the same `lastFireTime` but does not properly reduce delay, causing inconsistent firing.
- **Fix**: Adjust cooldown logic to debounce per power-up status.

## Environment Setup
- **Linting**: Project’s `npm run lint` command fails because Next.js expects a `lint` directory when no config is provided.
- **Fix**: Provide an `eslint.config.js` or similar to satisfy Next.js lint configuration.

## Summary
These bugs impact gameplay consistency, audio behavior, and developer ergonomics. Addressing the timing, collision, and lifecycle issues will stabilize the game and improve the user experience.
