export type SoundName =
  | "key_press"
  | "key_enter"
  | "tile_correct"
  | "tile_present"
  | "tile_absent"
  | "win_jingle"
  | "bankruptcy"
  | "double_down"
  | "fold"
  | "chip_clink"
  | "hint_use";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (ctx) return ctx;
  try {
    ctx = new AudioContext();
    return ctx;
  } catch {
    return null;
  }
}

function playOsc(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
  startTime?: number,
) {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime ?? c.currentTime);
  gain.gain.setValueAtTime(volume, startTime ?? c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, (startTime ?? c.currentTime) + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(startTime ?? c.currentTime);
  osc.stop((startTime ?? c.currentTime) + duration);
}

function playFreqSweep(
  startFreq: number,
  endFreq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
) {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, t);
  osc.frequency.linearRampToValueAtTime(endFreq, t + duration);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + duration);
}

function playWhiteNoise(duration: number, volume = 0.1) {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  const t = c.currentTime;
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1000, t);
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  source.start(t);
}

function playArpeggio(notes: number[], noteDuration: number, type: OscillatorType = "sine", volume = 0.15) {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  notes.forEach((freq, i) => {
    const t = c.currentTime + i * noteDuration;
    playOsc(freq, noteDuration * 0.9, type, volume, t);
  });
}

function playHeartbeat(volume = 0.2) {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  const t = c.currentTime;
  const playPulse = (time: number) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(60, time);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(time);
    osc.stop(time + 0.15);
  };
  playPulse(t);
  playPulse(t + 0.3);
}

export function playSound(name: SoundName) {
  try {
    switch (name) {
      case "key_press":
        playOsc(800, 0.05, "sine", 0.08);
        break;
      case "key_enter":
        playOsc(400, 0.1, "sine", 0.1);
        break;
      case "tile_correct":
        playFreqSweep(523, 659, 0.2, "sine", 0.12);
        break;
      case "tile_present":
        playOsc(440, 0.15, "sine", 0.1);
        break;
      case "tile_absent":
        playOsc(200, 0.1, "sine", 0.05);
        break;
      case "win_jingle":
        playArpeggio([523, 659, 784, 1047], 0.05, "sine", 0.12);
        break;
      case "bankruptcy":
        playFreqSweep(400, 200, 0.5, "sawtooth", 0.12);
        break;
      case "double_down":
        playHeartbeat(0.2);
        break;
      case "fold":
        playWhiteNoise(0.2, 0.08);
        break;
      case "chip_clink":
        playOsc(1200, 0.08, "sine", 0.08);
        break;
      case "hint_use":
        playArpeggio([800, 1200, 1600], 0.06, "triangle", 0.1);
        break;
    }
  } catch {
    // Silently ignore audio errors
  }
}
