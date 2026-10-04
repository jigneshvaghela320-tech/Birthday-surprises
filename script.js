/* ==========================================================================
   ROMANTIC BIRTHDAY & PROPOSAL INTERACTIVE ENGINE
   ========================================================================== */

// Default Configuration & State
const state = {
  brideName: localStorage.getItem('brideName') || 'Meri Pasandida Aurat',
  groomName: localStorage.getItem('groomName') || 'Jignesh',
  proposalQuestion: localStorage.getItem('proposalQuestion') || 'Will You Marry Me?',
  customAudioSrc: localStorage.getItem('customAudioSrc') || null,
  isMusicPlaying: false,
  currentStep: 'step-envelope',
  candlesBlown: false,
  ringBoxOpened: false,
  noClickAttempts: 0,
  yesTime: localStorage.getItem('yesTime') || null
};

/* ==========================================================================
   WEB AUDIO API PROCEDURAL ROMANTIC MELODY & SOUND EFFECTS
   (100% Reliable, Zero External Dependencies, Dreamy Fairytale Piano/Harp)
   ========================================================================== */
class RomanticAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.customAudio = null;
    this.interval = null;
    this.scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25]; // C major romantic frequencies
    // Romantic arpeggio sequence: C - G - Am - F
    this.chords = [
      [261.63, 329.63, 392.00, 523.25], // C
      [196.00, 246.94, 293.66, 392.00], // G
      [220.00, 261.63, 329.63, 440.00], // Am
      [174.61, 220.00, 261.63, 349.23]  // F
    ];
    this.chordIndex = 0;
    this.noteStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(freq, time, duration = 1.2, type = 'triangle', vol = 0.12) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(vol, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {
      console.warn('Audio playNote error:', e);
    }
  }

  startMelody() {
    this.init();
    if (state.customAudioSrc) {
      if (!this.customAudio) {
        this.customAudio = new Audio(state.customAudioSrc);
        this.customAudio.loop = true;
      }
      this.customAudio.play().catch(e => console.log(e));
      this.isPlaying = true;
      return;
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Arpeggiator loop
    const stepTime = 380; // ms
    this.interval = setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const currentChord = this.chords[this.chordIndex];
      const noteFreq = currentChord[this.noteStep % currentChord.length];

      this.playNote(noteFreq, now, 1.4, 'triangle', 0.14);

      // Add gentle harmonic bell
      if (this.noteStep === 0) {
        this.playNote(noteFreq * 2, now + 0.05, 1.8, 'sine', 0.08);
      }

      this.noteStep++;
      if (this.noteStep >= currentChord.length) {
        this.noteStep = 0;
        this.chordIndex = (this.chordIndex + 1) % this.chords.length;
      }
    }, stepTime);
  }

  stopMelody() {
    this.isPlaying = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stopMelody();
      return false;
    } else {
      this.startMelody();
      return true;
    }
  }

  playChime() {
    this.init();
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      this.playNote(freq, now + i * 0.1, 1.2, 'sine', 0.15);
    });
  }

  playWhoosh() {
    this.init();
    const now = this.ctx.currentTime;
    this.playNote(300, now, 0.4, 'sine', 0.2);
    this.playNote(150, now + 0.1, 0.6, 'triangle', 0.15);
  }

  playBoing() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playCelebrationFanfare() {
    this.init();
    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.18, offset: 0 },
      { f: 659.25, d: 0.18, offset: 0.2 },
      { f: 783.99, d: 0.25, offset: 0.4 },
      { f: 1046.50, d: 0.8, offset: 0.7 },
      { f: 1318.51, d: 1.5, offset: 1.0 }
    ];
    notes.forEach(n => {
      this.playNote(n.f, now + n.offset, n.d, 'triangle', 0.25);
      this.playNote(n.f * 0.5, now + n.offset, n.d, 'sine', 0.2);
    });
  }
}

const audioEngine = new RomanticAudio();

/* ==========================================================================
   CANVAS 1: FLOATING ROSE PETALS, STARS & FIREFLIES
   ========================================================================== */
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');

let stars = [];
let petals = [];
let fireflies = [];

function resizeCanvases() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  const fwCanvas = document.getElementById('fireworksCanvas');
  if (fwCanvas) {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
  }
}
window.addEventListener('resize', resizeCanvases);
resizeCanvases();

// Create Initial Elements
for (let i = 0; i < 90; i++) {
  stars.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.5,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.005
  });
}

for (let i = 0; i < 25; i++) {
  petals.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 10 + 12,
    speedY: Math.random() * 1.2 + 0.8,
    speedX: Math.random() * 1.0 - 0.5,
    angle: Math.random() * 360,
    angleSpeed: Math.random() * 1.5 - 0.75,
    color: ['#ff4d6d', '#ff758f', '#c9184a', '#ffccd5'][Math.floor(Math.random() * 4)]
  });
}

for (let i = 0; i < 20; i++) {
  fireflies.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + 1.5,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    alpha: Math.random() * 0.8 + 0.2
  });
}

function renderBackground() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  // 1. Stars
  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed;
    bgCtx.beginPath();
    bgCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, s.alpha)})`;
    bgCtx.fill();
  });

  // 2. Fireflies
  fireflies.forEach(f => {
    f.x += f.vx;
    f.y += f.vy;
    if (f.x < 0) f.x = bgCanvas.width;
    if (f.x > bgCanvas.width) f.x = 0;
    if (f.y < 0) f.y = bgCanvas.height;
    if (f.y > bgCanvas.height) f.y = 0;

    bgCtx.beginPath();
    bgCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(249, 217, 118, ${f.alpha})`;
    bgCtx.shadowBlur = 12;
    bgCtx.shadowColor = '#f9d976';
    bgCtx.fill();
    bgCtx.shadowBlur = 0;
  });

  // 3. Falling Rose Petals
  petals.forEach(p => {
    p.y += p.speedY;
    p.x += Math.sin(p.angle * Math.PI / 180) * 0.8 + p.speedX;
    p.angle += p.angleSpeed;

    if (p.y > bgCanvas.height + 20) {
      p.y = -20;
      p.x = Math.random() * bgCanvas.width;
    }

    bgCtx.save();
    bgCtx.translate(p.x, p.y);
    bgCtx.rotate((p.angle * Math.PI) / 180);
    bgCtx.beginPath();
    bgCtx.ellipse(0, 0, p.size * 0.6, p.size, Math.PI / 4, 0, 2 * Math.PI);
    bgCtx.fillStyle = p.color;
    bgCtx.globalAlpha = 0.75;
    bgCtx.fill();
    bgCtx.restore();
  });

  requestAnimationFrame(renderBackground);
}
renderBackground();

/* ==========================================================================
   CANVAS 2: CELEBRATION FIREWORKS & CONFETTI ENGINE
   ========================================================================== */
const fwCanvas = document.getElementById('fireworksCanvas');
const fwCtx = fwCanvas.getContext('2d');
let fireworksParticles = [];
let isFireworksActive = false;

class FireworkParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.015;
    this.isHeart = Math.random() > 0.6;
    this.size = Math.random() * 4 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.06; // gravity
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    if (this.isHeart) {
      ctx.font = `${Math.floor(this.size * 3.5)}px Arial`;
      ctx.fillText('💖', this.x, this.y);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
    ctx.restore();
  }
}

function triggerFireworksBurst(x, y) {
  const colors = ['#ff4d6d', '#ffccd5', '#ffd700', '#f9d976', '#ff0055', '#ffffff'];
  for (let i = 0; i < 45; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    fireworksParticles.push(new FireworkParticle(x, y, color));
  }
}

function renderFireworks() {
  if (!isFireworksActive && fireworksParticles.length === 0) return;
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

  for (let i = fireworksParticles.length - 1; i >= 0; i--) {
    const p = fireworksParticles[i];
    p.update();
    p.draw(fwCtx);
    if (p.alpha <= 0) {
      fireworksParticles.splice(i, 1);
    }
  }

  if (isFireworksActive && Math.random() < 0.12) {
    const randomX = Math.random() * (fwCanvas.width - 200) + 100;
    const randomY = Math.random() * (fwCanvas.height * 0.5) + 80;
    triggerFireworksBurst(randomX, randomY);
  }

  requestAnimationFrame(renderFireworks);
}

/* ==========================================================================
   NAVIGATION & STEP TRANSITIONS
   ========================================================================== */
function navigateToStep(stepId) {
  const currentElem = document.getElementById(state.currentStep);
  const nextElem = document.getElementById(stepId);

  if (currentElem) {
    currentElem.classList.remove('active');
    setTimeout(() => {
      currentElem.classList.add('hidden');
      if (nextElem) {
        nextElem.classList.remove('hidden');
        setTimeout(() => {
          nextElem.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      }
    }, 350);
  }
  state.currentStep = stepId;
}

/* ==========================================================================
   STEP 1: THE ENVELOPE INTERACTION
   ========================================================================== */
const envelopeWrapper = document.getElementById('envelopeWrapper');
const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');

function triggerOpenEnvelope() {
  envelopeWrapper.classList.add('open');
  audioEngine.playChime();
  if (!audioEngine.isPlaying) {
    audioEngine.startMelody();
    updateMusicUI(true);
  }

  setTimeout(() => {
    navigateToStep('step-cake');
  }, 1200);
}

envelopeWrapper.addEventListener('click', triggerOpenEnvelope);
openEnvelopeBtn.addEventListener('click', triggerOpenEnvelope);

/* ==========================================================================
   STEP 2: BIRTHDAY CAKE & CANDLE BLOWING
   ========================================================================== */
const blowCandleBtn = document.getElementById('blowCandleBtn');
const wishGrantedText = document.getElementById('wishGrantedText');
const toMemoriesBtn = document.getElementById('toMemoriesBtn');
const candles = document.querySelectorAll('.candle');

function blowOutCandles() {
  if (state.candlesBlown) return;
  state.candlesBlown = true;

  audioEngine.playWhoosh();
  audioEngine.playChime();

  candles.forEach((c, idx) => {
    setTimeout(() => {
      c.classList.add('blown');
    }, idx * 150);
  });

  // Confetti burst above cake
  const cakeRect = document.getElementById('cakeContainer').getBoundingClientRect();
  triggerFireworksBurst(cakeRect.left + cakeRect.width / 2, cakeRect.top);

  blowCandleBtn.classList.add('hidden');
  wishGrantedText.classList.remove('hidden');
  toMemoriesBtn.classList.remove('hidden');
}

blowCandleBtn.addEventListener('click', blowOutCandles);
candles.forEach(c => c.addEventListener('click', blowOutCandles));

toMemoriesBtn.addEventListener('click', () => {
  audioEngine.playChime();
  navigateToStep('step-memories');
});

/* ==========================================================================
   STEP 3: MEMORIES & PHOTO UPLOADS
   ========================================================================== */
document.querySelectorAll('.custom-file-input').forEach(input => {
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const targetId = input.getAttribute('data-target');
    const reader = new FileReader();
    reader.onload = function(evt) {
      const imgElem = document.getElementById(targetId);
      if (imgElem) {
        imgElem.src = evt.target.result;
        // Save to localStorage for persistence
        try {
          localStorage.setItem(`custom_${targetId}`, evt.target.result);
        } catch (err) {
          console.warn('LocalStorage image quota reached', err);
        }
      }
    };
    reader.readAsDataURL(file);
  });
});

// Load any previously saved photos
['photo1', 'photo2', 'photo3', 'photo4'].forEach(id => {
  const saved = localStorage.getItem(`custom_${id}`);
  if (saved) {
    const el = document.getElementById(id);
    if (el) el.src = saved;
  }
});

const toLetterBtn = document.getElementById('toLetterBtn');
toLetterBtn.addEventListener('click', () => {
  audioEngine.playChime();
  navigateToStep('step-letter');
});

/* ==========================================================================
   STEP 4: THE LOVE LETTER
   ========================================================================== */
const toProposalBtn = document.getElementById('toProposalBtn');
toProposalBtn.addEventListener('click', () => {
  audioEngine.playChime();
  navigateToStep('step-proposal');
});

/* ==========================================================================
   STEP 5: THE PROPOSAL & RUNAWAY NO BUTTON
   ========================================================================== */
const ringBoxWrapper = document.getElementById('ringBoxWrapper');
const boxHint = document.getElementById('boxHint');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const noEscapeMsg = document.getElementById('noEscapeMsg');

function openRingBox() {
  if (state.ringBoxOpened) return;
  state.ringBoxOpened = true;
  ringBoxWrapper.classList.add('opened');
  boxHint.innerText = '✨ Forever Begins With You ✨';
  audioEngine.playChime();

  // Burst golden particles
  const boxRect = ringBoxWrapper.getBoundingClientRect();
  triggerFireworksBurst(boxRect.left + boxRect.width / 2, boxRect.top + 30);
}

ringBoxWrapper.addEventListener('click', openRingBox);

// Playful runaway "No" button mechanics
const playfulQuotes = [
  "😉 \"Nahi ka to option hi nahi hai, meri jaan!\"",
  "🥺 \"Aise mat karo, dil toot jayega!\"",
  "❤️ \"You are my pasandida aurat, no escape allowed!\"",
  "✨ \"Wrong button! Look at that shiny YES button!\"",
  "💍 \"Hath pakad lo, na mat bolo!\"",
  "🥰 \"You know you want to say YES!\""
];

function evadeNoButton(e) {
  state.noClickAttempts++;
  audioEngine.playBoing();

  // Random translation
  const offsetX = (Math.random() - 0.5) * 320;
  const offsetY = (Math.random() - 0.5) * 220;

  noBtn.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.9)`;

  // Update witty message
  const randomQuote = playfulQuotes[state.noClickAttempts % playfulQuotes.length];
  noEscapeMsg.innerText = randomQuote;
  noEscapeMsg.classList.remove('hidden');

  // Make the YES button grow larger & more magnetic
  const currentScale = 1 + Math.min(state.noClickAttempts * 0.08, 0.45);
  yesBtn.style.transform = `scale(${currentScale})`;
}

noBtn.addEventListener('mouseenter', evadeNoButton);
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  evadeNoButton(e);
});
noBtn.addEventListener('click', evadeNoButton);

// YES Button: Celebration Climax!
yesBtn.addEventListener('click', () => {
  if (!state.ringBoxOpened) {
    openRingBox();
  }
  audioEngine.playCelebrationFanfare();
  isFireworksActive = true;
  renderFireworks();

  // Save the moment timestamp
  if (!state.yesTime) {
    state.yesTime = new Date().toISOString();
    localStorage.setItem('yesTime', state.yesTime);
  }

  // Trigger continuous fireworks
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      triggerFireworksBurst(
        Math.random() * window.innerWidth,
        Math.random() * (window.innerHeight * 0.6) + 50
      );
    }, i * 300);
  }

  setTimeout(() => {
    navigateToStep('step-celebration');
    startForeverCounter();
  }, 900);
});

/* ==========================================================================
   STEP 6: CELEBRATION & FOREVER TIMER
   ========================================================================== */
function startForeverCounter() {
  const startDate = state.yesTime ? new Date(state.yesTime) : new Date();

  function updateCounter() {
    const now = new Date();
    const diff = Math.max(0, now - startDate);

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1; // 1st day of happiness

    document.getElementById('daysCount').innerText = days;
    document.getElementById('hoursCount').innerText = hours;
    document.getElementById('minsCount').innerText = minutes;
    document.getElementById('secsCount').innerText = seconds;
  }

  updateCounter();
  setInterval(updateCounter, 1000);
}

// Replay button
const replayBtn = document.getElementById('replayBtn');
if (replayBtn) {
  replayBtn.addEventListener('click', () => {
    state.candlesBlown = false;
    state.ringBoxOpened = false;
    candles.forEach(c => c.classList.remove('blown'));
    blowCandleBtn.classList.remove('hidden');
    wishGrantedText.classList.add('hidden');
    toMemoriesBtn.classList.add('hidden');
    ringBoxWrapper.classList.remove('opened');
    boxHint.innerText = 'Tap the velvet box to reveal the ring ✨';
    noBtn.style.transform = 'none';
    yesBtn.style.transform = 'none';
    noEscapeMsg.classList.add('hidden');
    envelopeWrapper.classList.remove('open');
    navigateToStep('step-envelope');
  });
}

// Print / Save Certificate button
const downloadCertBtn = document.getElementById('downloadCertBtn');
if (downloadCertBtn) {
  downloadCertBtn.addEventListener('click', () => {
    window.print();
  });
}

/* ==========================================================================
   CUSTOMIZATION MODAL LOGIC
   ========================================================================== */
const customizeBtn = document.getElementById('customizeBtn');
const customizeModal = document.getElementById('customizeModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const saveCustomizeBtn = document.getElementById('saveCustomizeBtn');
const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

const brideNameInput = document.getElementById('brideNameInput');
const groomNameInput = document.getElementById('groomNameInput');
const proposalQuestionInput = document.getElementById('proposalQuestionInput');
const bgAudioUpload = document.getElementById('bgAudioUpload');

function openModal() {
  brideNameInput.value = state.brideName;
  groomNameInput.value = state.groomName;
  proposalQuestionInput.value = state.proposalQuestion;
  customizeModal.classList.remove('hidden');
}

function closeModal() {
  customizeModal.classList.add('hidden');
}

customizeBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
customizeModal.addEventListener('click', (e) => {
  if (e.target === customizeModal) closeModal();
});

saveCustomizeBtn.addEventListener('click', () => {
  if (brideNameInput.value.trim()) {
    state.brideName = brideNameInput.value.trim();
    localStorage.setItem('brideName', state.brideName);
  }
  if (groomNameInput.value.trim()) {
    state.groomName = groomNameInput.value.trim();
    localStorage.setItem('groomName', state.groomName);
  }
  if (proposalQuestionInput.value.trim()) {
    state.proposalQuestion = proposalQuestionInput.value.trim();
    localStorage.setItem('proposalQuestion', state.proposalQuestion);
  }

  // Audio file upload
  if (bgAudioUpload.files && bgAudioUpload.files[0]) {
    const file = bgAudioUpload.files[0];
    const reader = new FileReader();
    reader.onload = function(evt) {
      state.customAudioSrc = evt.target.result;
      try {
        localStorage.setItem('customAudioSrc', state.customAudioSrc);
      } catch (err) {
        console.warn('Audio storage quota reached', err);
      }
      audioEngine.stopMelody();
      audioEngine.customAudio = null;
      audioEngine.startMelody();
      updateMusicUI(true);
    };
    reader.readAsDataURL(file);
  }

  applyPersonalization();
  closeModal();
});

resetDefaultsBtn.addEventListener('click', () => {
  localStorage.clear();
  state.brideName = 'Meri Pasandida Aurat';
  state.groomName = 'Jignesh';
  state.proposalQuestion = 'Will You Marry Me?';
  state.customAudioSrc = null;
  state.yesTime = null;
  applyPersonalization();
  closeModal();
  location.reload();
});

function applyPersonalization() {
  document.querySelectorAll('.bride-name-text').forEach(el => {
    el.innerText = state.brideName;
  });
  document.querySelectorAll('.groom-name-text').forEach(el => {
    el.innerText = state.groomName;
  });
  const qEl = document.querySelector('.proposal-question');
  if (qEl) qEl.innerText = state.proposalQuestion;

  const certDate = document.getElementById('certDateDisplay');
  if (certDate) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    certDate.innerText = new Date().toLocaleDateString(undefined, options);
  }
}
applyPersonalization();

/* ==========================================================================
   AUDIO TOGGLE UI
   ========================================================================== */
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicStatus = document.getElementById('musicStatus');

function updateMusicUI(isPlaying) {
  musicStatus.innerText = isPlaying ? 'ON 🎶' : 'OFF';
  musicStatus.style.color = isPlaying ? '#4cd137' : '#f9d976';
}

musicToggleBtn.addEventListener('click', () => {
  const isNowPlaying = audioEngine.toggle();
  updateMusicUI(isNowPlaying);
});

// Auto-unlock audio on first touch/click
document.body.addEventListener('click', () => {
  if (!audioEngine.ctx) {
    audioEngine.init();
  }
}, { once: true });
