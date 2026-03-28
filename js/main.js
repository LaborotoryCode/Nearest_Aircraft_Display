import { Board } from './Board.js';
import { SoundEngine } from './SoundEngine.js';
import { MessageRotator } from './MessageRotator.js';
import { KeyboardController } from './KeyboardController.js';

document.addEventListener('DOMContentLoaded', async () => {
  const boardContainer = document.getElementById('board-container');
  const soundEngine = new SoundEngine();
  const board = new Board(boardContainer, soundEngine);
  const rotator = new MessageRotator(board);
  const keyboard = new KeyboardController(rotator, soundEngine);

  let audioInitialized = false;
  const initAudio = async () => {
    if (audioInitialized) return;
    audioInitialized = true;
    await soundEngine.init();
    soundEngine.resume();
    document.removeEventListener('click', initAudio);
    document.removeEventListener('keydown', initAudio);
  };
  document.addEventListener('click', initAudio);
  document.addEventListener('keydown', initAudio);

  // Await start so flight data loads before first message
  await rotator.start();

  const volumeBtn = document.getElementById('volume-btn');
  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      initAudio();
      const muted = soundEngine.toggleMute();
      volumeBtn.classList.toggle('muted', muted);
    });
  }

  const ctaBtn = document.getElementById('cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      boardContainer.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        document.documentElement.requestFullscreen().catch(() => {});
      }, 400);
    });
  }
});

