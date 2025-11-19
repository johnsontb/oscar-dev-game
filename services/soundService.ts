
// A synthesizer for retro space sounds and music using the Web Audio API
// avoiding external assets.

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicInterval: number | null = null;
let isMuted = false;
let synthesis: SpeechSynthesis | null = null;
let robotVoice: SpeechSynthesisVoice | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const getMasterGain = () => {
  const ctx = getContext();
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.value = isMuted ? 0 : 0.3; // Default volume
    masterGain.connect(ctx.destination);
  }
  return masterGain;
};

const createOscillator = (type: OscillatorType, freq: number, duration: number, vol: number = 0.1) => {
  const ctx = getContext();
  const mainVol = getMasterGain();
  
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gainNode.gain.setValueAtTime(vol, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(mainVol);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

// Load available voices and pick a good "robot" one
const loadVoices = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    synthesis = window.speechSynthesis;
    const voices = synthesis.getVoices();
    // Prefer Google US English or a standard US voice for clarity
    robotVoice = voices.find(v => v.name.includes("Google US English")) 
              || voices.find(v => v.lang === "en-US") 
              || voices[0];
  }
};

if (typeof window !== 'undefined' && window.speechSynthesis) {
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
}

export const soundService = {
  // Call this on the first user interaction to unlock audio context
  init: () => {
    const ctx = getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    getMasterGain(); // Ensure master gain is initialized
    loadVoices(); // Retry voice load if it failed earlier
  },

  setMute: (mute: boolean) => {
    isMuted = mute;
    const ctx = getContext();
    const mainVol = getMasterGain();
    // Smooth fade to avoid popping
    mainVol.gain.cancelScheduledValues(ctx.currentTime);
    mainVol.gain.linearRampToValueAtTime(mute ? 0 : 0.3, ctx.currentTime + 0.1);

    if (mute && synthesis) {
        synthesis.cancel();
    }
  },

  startMusic: () => {
    if (musicInterval) return; // Already playing

    const ctx = getContext();
    const mainVol = getMasterGain();
    
    // A gentle, slow space arpeggio
    const notes = [261.63, 329.63, 392.00, 493.88]; // C Major 7 (C4, E4, G4, B4)
    let noteIndex = 0;

    const playNote = () => {
      // Randomize timing slightly for a natural feel
      const freq = notes[noteIndex % notes.length];
      
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      
      osc.type = 'sine'; // Pure sine wave for spacey feel
      osc.frequency.value = freq;
      
      // Long attack and release for "ambient" pad effect
      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2); // 2s Fade in
      noteGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 6); // 4s Fade out
      
      osc.connect(noteGain);
      noteGain.connect(mainVol);
      
      osc.start();
      osc.stop(ctx.currentTime + 6);
      
      noteIndex++;
    };

    // Start immediately
    playNote();
    // Play next note every 4 seconds
    musicInterval = window.setInterval(playNote, 4000);
  },

  playClick: () => {
    // High pitched computer blip
    createOscillator('sine', 800, 0.1, 0.1);
  },

  playSnap: () => {
    // Mechanical click for toolbox items
    createOscillator('square', 300, 0.05, 0.05);
    setTimeout(() => createOscillator('sine', 600, 0.05, 0.05), 50);
  },

  playSuccess: () => {
    // A happy major arpeggio (C - E - G - C)
    const ctx = getContext();
    const mainVol = getMasterGain();
    const now = ctx.currentTime;
    
    const playNote = (freq: number, time: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.linearRampToValueAtTime(0, time + 0.3);
      osc.connect(gain);
      gain.connect(mainVol);
      osc.start(time);
      osc.stop(time + 0.3);
    };

    playNote(523.25, now);       // C5
    playNote(659.25, now + 0.1); // E5
    playNote(783.99, now + 0.2); // G5
    playNote(1046.50, now + 0.3); // C6
  },

  playFailure: () => {
    // A gentle "oops" sound (descending)
    const ctx = getContext();
    const mainVol = getMasterGain();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(mainVol);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  },

  playWarp: () => {
    // Swoosh for level transitions
    const ctx = getContext();
    const mainVol = getMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(mainVol);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  },

  speak: (text: string) => {
    if (isMuted || !synthesis) return;
    
    // Stop any previous speech
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (robotVoice) {
      utterance.voice = robotVoice;
    }
    
    // Robot effect: Slightly higher pitch, slightly faster
    utterance.pitch = 1.2; 
    utterance.rate = 1.1;
    utterance.volume = 1.0;

    synthesis.speak(utterance);
  }
};
