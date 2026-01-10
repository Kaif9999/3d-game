class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private backgroundMusic: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    // Initialize audio context on user interaction to comply with browser policies
    if (typeof window !== 'undefined') {
      this.initializeAudio();
    }
  }

  private async initializeAudio() {
    try {
      // Preload all sound effects
      const soundFiles = {
        laserHit: '/sounds/laser-hit.wav',
        gameStart: '/sounds/game-start.wav',
        gameOver: '/sounds/game-over.wav',
        pause: '/sounds/pause.wav',
      };

      // Load sound effects
      for (const [key, path] of Object.entries(soundFiles)) {
        const audio = new Audio(path);
        audio.preload = 'auto';
        this.sounds.set(key, audio);
      }

      // Load and setup background music
      this.backgroundMusic = new Audio('/sounds/background-music.wav');
      this.backgroundMusic.preload = 'auto';
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.3; // Lower volume for background music

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  // Play a sound effect
  playSound(soundName: string) {
    if (this.isMuted || !this.isInitialized) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      // Clone the audio to allow overlapping sounds
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.5;
      soundClone.play().catch(error => {
        console.warn(`Failed to play sound ${soundName}:`, error);
      });
    }
  }

  // Start background music
  startBackgroundMusic() {
    if (this.isMuted || !this.isInitialized || !this.backgroundMusic) return;

    this.backgroundMusic.play().catch(error => {
      console.warn('Failed to start background music:', error);
    });
  }

  // Stop background music
  stopBackgroundMusic() {
    if (!this.backgroundMusic) return;

    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  // Pause background music
  pauseBackgroundMusic() {
    if (!this.backgroundMusic) return;
    this.backgroundMusic.pause();
  }

  // Resume background music
  resumeBackgroundMusic() {
    if (this.isMuted || !this.backgroundMusic) return;
    this.backgroundMusic.play().catch(error => {
      console.warn('Failed to resume background music:', error);
    });
  }

  // Toggle mute
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.stopBackgroundMusic();
    } else if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.resumeBackgroundMusic();
    }

    return this.isMuted;
  }

  // Get mute status
  getIsMuted(): boolean {
    return this.isMuted;
  }

  // Initialize audio on first user interaction
  async initializeOnUserInteraction() {
    if (!this.isInitialized) {
      await this.initializeAudio();
    }
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;