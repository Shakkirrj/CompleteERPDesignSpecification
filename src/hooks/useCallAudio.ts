import { useEffect, useRef, useCallback } from "react";

type RingtoneType = "outgoing" | "incoming";

/**
 * Generates call ringtones using the Web Audio API.
 * outgoing — classic double-beep dial tone (400 Hz + 450 Hz, pairs, 0.4 s on / 0.2 s gap / repeat)
 * incoming — rising two-tone ring (480 Hz + 620 Hz, 2 s on / 4 s off / repeat, like a PSTN ring)
 */
export function useCallAudio(type: RingtoneType, active: boolean) {
  const ctxRef      = useRef<AudioContext | null>(null);
  const stopRef     = useRef<(() => void) | null>(null);
  const activeRef   = useRef(active);
  activeRef.current = active;

  const stop = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
  }, []);

  useEffect(() => {
    if (!active) { stop(); return; }

    // Lazily create AudioContext on first use (browser policy: needs user gesture)
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    let cancelled = false;

    function makeOscillator(freq: number, gain: number): [OscillatorNode, GainNode] {
      const osc = ctx.createOscillator();
      const vol = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      vol.gain.value = gain;
      osc.connect(vol);
      vol.connect(ctx.destination);
      return [osc, vol];
    }

    if (type === "outgoing") {
      /* ── Outgoing dial tone ──
         Two tones (425 Hz + 450 Hz) fused together, pulsed:
         ON 0.4 s → OFF 0.2 s → ON 0.4 s → OFF 0.2 s → OFF 2.0 s → repeat
      */
      const [o1, g1] = makeOscillator(425, 0);
      const [o2, g2] = makeOscillator(450, 0);
      o1.start(); o2.start();

      const pattern = [0.4, 0.2, 0.4, 2.0]; // on, off, on, longoff
      let tIdx = 0;
      let phaseOn = true;  // starts with ON

      function tick() {
        if (cancelled) return;
        const isOn = phaseOn;
        const targetGain = isOn ? 0.12 : 0;
        g1.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.02);
        g2.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.02);
        const duration = pattern[tIdx] * 1000;
        tIdx = (tIdx + 1) % pattern.length;
        phaseOn = tIdx === 0 || tIdx === 2;  // positions 0 and 2 are ON
        // recompute — pattern: [0]=0.4s ON, [1]=0.2s OFF, [2]=0.4s ON, [3]=2.0s OFF
        const phases = [true, false, true, false];
        phaseOn = phases[(tIdx) % phases.length];
        setTimeout(tick, duration);
      }
      // Pattern is: 0.4s on, 0.2s off, 0.4s on, 2.0s off
      // index 0 → on (0.4s), index 1 → off (0.2s), index 2 → on (0.4s), index 3 → off (2.0s)
      let idx = 0;
      const fullPattern: { on: boolean; ms: number }[] = [
        { on: true,  ms: 400 },
        { on: false, ms: 200 },
        { on: true,  ms: 400 },
        { on: false, ms: 2000 },
      ];

      function playPattern() {
        if (cancelled) return;
        const step = fullPattern[idx % fullPattern.length];
        const t = ctx.currentTime;
        const gain = step.on ? 0.10 : 0;
        g1.gain.setTargetAtTime(gain, t, 0.01);
        g2.gain.setTargetAtTime(gain, t, 0.01);
        idx++;
        setTimeout(playPattern, step.ms);
      }
      playPattern();

      stopRef.current = () => {
        cancelled = true;
        g1.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
        g2.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
        setTimeout(() => { try { o1.stop(); o2.stop(); } catch (_) {} }, 80);
      };
    } else {
      /* ── Incoming ring tone ──
         Classic phone ring: 480 Hz + 620 Hz blended
         Pattern: 2 s ring → 4 s silence → repeat
      */
      const [o1, g1] = makeOscillator(480, 0);
      const [o2, g2] = makeOscillator(620, 0);
      // Add a slight tremolo for realism
      const lfo     = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 20; // 20 Hz tremolo
      lfoGain.gain.value  = 0.03;
      lfo.connect(lfoGain);
      lfoGain.connect(g1.gain);
      lfoGain.connect(g2.gain);
      o1.start(); o2.start(); lfo.start();

      const ringPattern: { on: boolean; ms: number }[] = [
        { on: true,  ms: 2000 },
        { on: false, ms: 4000 },
      ];
      let ridx = 0;

      function ringCycle() {
        if (cancelled) return;
        const step = ringPattern[ridx % ringPattern.length];
        const t = ctx.currentTime;
        const gain = step.on ? 0.14 : 0;
        g1.gain.setTargetAtTime(gain, t, 0.03);
        g2.gain.setTargetAtTime(gain, t, 0.03);
        ridx++;
        setTimeout(ringCycle, step.ms);
      }
      ringCycle();

      stopRef.current = () => {
        cancelled = true;
        g1.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
        g2.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
        setTimeout(() => {
          try { o1.stop(); o2.stop(); lfo.stop(); } catch (_) {}
        }, 100);
      };
    }

    return () => { stop(); };
  }, [active, type, stop]);

  return { stop };
}
