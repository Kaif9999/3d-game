# Known Bugs in Space Shooter Game

1. **Power-up timers never expire.**
   - When a power-up is collected, the timer state may stay active because `setActivePowerUps` is called multiple times within the same render cycle using stale `Date.now()` values.
   - `Date.now()` should be captured once per loop iteration to ensure consistent timing calculations.

2. **Audio system fails to mute existing sounds.**
   - The `toggleMute` function does not stop currently playing sounds; once playSound clones `HTMLAudioElement` instances, muting the manager does not affect them.
   - Need to track playing sounds and pause/stop them when muting.

3. **No cleanup for `setInterval` game loop.**
   - When pausing or quitting the game, the interval set via `setInterval` continues running.
   - Should use `requestAnimationFrame` or ensure `clearInterval` is called when the game is stopped.

4. **Enemy bullet collision detection is inconsistent.**
   - `Math.sqrt` distance calculations compare values in different scales (positions use percentages while distances use pixel values).
   - Need to normalize units or adjust thresholds.

5. **Shooter enemies can fire after being destroyed.**
   - Bullet firing logic runs before alien removal updates, so aliens marked for removal may still shoot in the same loop iteration.

6. **Shield power-up breaks collision logic.**
   - Shield state is checked based on `Date.now()` but timers are not decremented properly due to multiple state updates triggered during collisions.

7. **Rapid fire not throttled correctly.**
   - The fire delay logic bases timing on `lastFireTime` but does not account for rapid fire multiplier.

