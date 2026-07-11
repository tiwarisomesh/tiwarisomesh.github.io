"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type RefObject,
} from "react";
import { useTheme } from "next-themes";

export interface NeuralNetworkHandle {
  playIntro: () => void;
  startAmbientPulses: () => void;
  stopAmbientPulses: () => void;
  setRegionBoost: (active: boolean) => void;
  setSignalBoost: (active: boolean) => void;
  setParallax: (x: number, y: number) => void;
}

interface NeuralNetworkCanvasProps {
  avatarRef?: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
  onPulseNearAvatar?: () => void;
  onReady?: () => void;
}

export const NeuralNetworkCanvas = forwardRef<NeuralNetworkHandle, NeuralNetworkCanvasProps>(
  function NeuralNetworkCanvas({ avatarRef, reducedMotion = false, onPulseNearAvatar, onReady }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: -999, y: -999 });
    const { resolvedTheme } = useTheme();
    const themeTargetRef = useRef(0); // 0 = dark, 1 = light

    const controls = useRef({
      introStart: null as number | null,
      parallax: { x: 0, y: 0, targetX: 0, targetY: 0 },
      regionBoostTarget: 0,
      regionBoost: 0,
      signalBoostTarget: 0,
      signalBoost: 0,
      pulse: { active: false, start: 0, duration: 1700, avatarFired: false },
      ambientTimeout: null as ReturnType<typeof setTimeout> | null,
      ambientEnabled: false,
      avatarPos: { x: 0, y: 0 },
    });

    useEffect(() => {
      themeTargetRef.current = resolvedTheme === "light" ? 1 : 0;
    }, [resolvedTheme]);

    useImperativeHandle(ref, () => ({
      playIntro() {
        controls.current.introStart = performance.now();
      },
      startAmbientPulses() {
        if (reducedMotion) return;
        controls.current.ambientEnabled = true;
        scheduleNextPulse(4000);
      },
      stopAmbientPulses() {
        controls.current.ambientEnabled = false;
        if (controls.current.ambientTimeout) clearTimeout(controls.current.ambientTimeout);
      },
      setRegionBoost(active: boolean) {
        controls.current.regionBoostTarget = active ? 1 : 0;
        if (active && avatarRef?.current && canvasRef.current) {
          const avatarRect = avatarRef.current.getBoundingClientRect();
          const canvasRect = canvasRef.current.getBoundingClientRect();
          controls.current.avatarPos = {
            x: avatarRect.left + avatarRect.width / 2 - canvasRect.left,
            y: avatarRect.top + avatarRect.height / 2 - canvasRect.top,
          };
        }
      },
      setSignalBoost(active: boolean) {
        controls.current.signalBoostTarget = active ? 1 : 0;
      },
      setParallax(x: number, y: number) {
        controls.current.parallax.targetX = x;
        controls.current.parallax.targetY = y;
      },
    }));

    function scheduleNextPulse(delay: number) {
      if (controls.current.ambientTimeout) clearTimeout(controls.current.ambientTimeout);
      controls.current.ambientTimeout = setTimeout(() => {
        if (!controls.current.ambientEnabled) return;
        controls.current.pulse = { active: true, start: performance.now(), duration: 1700, avatarFired: false };
      }, delay);
    }

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let w = 0, h = 0;
      let animFrame = 0;
      let themeTransition = themeTargetRef.current;

      const layerColorsDark: [number, number, number][] = [
        [99, 102, 241], [59, 130, 246], [139, 92, 246], [6, 182, 212], [99, 102, 241], [236, 72, 153],
      ];
      const layerColorsLight: [number, number, number][] = [
        [79, 70, 229], [37, 99, 235], [109, 40, 217], [8, 145, 178], [79, 70, 229], [190, 24, 93],
      ];
      const paletteParams = {
        dark: { line: [99, 102, 241] as [number, number, number], signal: [129, 140, 248] as [number, number, number], glow: [99, 102, 241] as [number, number, number], lineAlphaBase: 0.03, lineAlphaScale: 0.12, glowAlphaScale: 0.15, coreAlphaBase: 0.3, coreAlphaScale: 0.7, centerAlphaBase: 0.3, centerAlphaScale: 0.5 },
        light: { line: [79, 70, 229] as [number, number, number], signal: [67, 56, 202] as [number, number, number], glow: [79, 70, 229] as [number, number, number], lineAlphaBase: 0.07, lineAlphaScale: 0.24, glowAlphaScale: 0.09, coreAlphaBase: 0.5, coreAlphaScale: 0.5, centerAlphaBase: 0.55, centerAlphaScale: 0.35 },
      };

      const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      const lerpRgb = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
      const smooth = (t: number) => { const c = clamp01(t); return c * c * (3 - 2 * c); };

      const layerSizes = [4, 6, 8, 6, 4, 2];
      const nodeRadius = 4;
      const INTRO_DURATION = 1100;

      interface Node {
        x: number; y: number; layer: number; index: number;
        activation: number; targetActivation: number;
        revealDelay: number;
      }
      interface Connection {
        from: Node; to: Node; weight: number;
        signal: number; signalSpeed: number; active: boolean;
        revealDelay: number;
      }

      let nodes: Node[] = [];
      let connections: Connection[] = [];

      function buildNetwork() {
        w = canvas!.parentElement!.clientWidth;
        h = canvas!.parentElement!.clientHeight;
        canvas!.width = w * window.devicePixelRatio;
        canvas!.height = h * window.devicePixelRatio;
        canvas!.style.width = `${w}px`;
        canvas!.style.height = `${h}px`;
        ctx!.setTransform(1, 0, 0, 1, 0, 0);
        ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);

        nodes = [];
        connections = [];

        const startX = w * 0.1;
        const endX = w * 0.9;
        const layerSpacing = (endX - startX) / (layerSizes.length - 1);

        const totalH = h * 0.7;
        const maxLayerSize = Math.max(...layerSizes);
        const nodeSpacing = totalH / (maxLayerSize - 1);
        const centerY = h / 2;

        layerSizes.forEach((size, li) => {
          const x = startX + li * layerSpacing;
          const startY = centerY - ((size - 1) * nodeSpacing) / 2;
          const layerDelay = (li / (layerSizes.length - 1)) * 0.55;

          for (let ni = 0; ni < size; ni++) {
            const y = size > 1 ? startY + ni * nodeSpacing : centerY;
            nodes.push({
              x, y, layer: li, index: ni,
              activation: 0.2 + Math.random() * 0.3,
              targetActivation: 0.2 + Math.random() * 0.3,
              revealDelay: layerDelay + Math.random() * 0.08,
            });
          }
        });

        for (let li = 0; li < layerSizes.length - 1; li++) {
          const fromNodes = nodes.filter((n) => n.layer === li);
          const toNodes = nodes.filter((n) => n.layer === li + 1);
          fromNodes.forEach((fn) => {
            toNodes.forEach((tn) => {
              const weight = 0.3 + Math.random() * 0.7;
              connections.push({
                from: fn, to: tn, weight,
                signal: Math.random(),
                signalSpeed: 0.003 + Math.random() * 0.007,
                active: weight > 0.5,
                revealDelay: Math.max(fn.revealDelay, tn.revealDelay) + 0.05,
              });
            });
          });
        }
      }

      buildNetwork();
      const startX = w * 0.1;
      const endX = w * 0.9;

      function draw() {
        const cx = ctx!;
        cx.clearRect(0, 0, w, h);

        const now = performance.now();
        const c = controls.current;

        themeTransition += (themeTargetRef.current - themeTransition) * 0.04;
        c.regionBoost += (c.regionBoostTarget - c.regionBoost) * 0.08;
        c.signalBoost += (c.signalBoostTarget - c.signalBoost) * 0.08;
        c.parallax.x += (c.parallax.targetX - c.parallax.x) * 0.06;
        c.parallax.y += (c.parallax.targetY - c.parallax.y) * 0.06;

        const introElapsed = c.introStart !== null ? now - c.introStart : reducedMotion ? INTRO_DURATION : -1;
        const introDone = introElapsed >= INTRO_DURATION;

        const p = {
          line: lerpRgb(paletteParams.dark.line, paletteParams.light.line, themeTransition),
          signal: lerpRgb(paletteParams.dark.signal, paletteParams.light.signal, themeTransition),
          glow: lerpRgb(paletteParams.dark.glow, paletteParams.light.glow, themeTransition),
          lineAlphaBase: lerp(paletteParams.dark.lineAlphaBase, paletteParams.light.lineAlphaBase, themeTransition),
          lineAlphaScale: lerp(paletteParams.dark.lineAlphaScale, paletteParams.light.lineAlphaScale, themeTransition),
          glowAlphaScale: lerp(paletteParams.dark.glowAlphaScale, paletteParams.light.glowAlphaScale, themeTransition),
          coreAlphaBase: lerp(paletteParams.dark.coreAlphaBase, paletteParams.light.coreAlphaBase, themeTransition),
          coreAlphaScale: lerp(paletteParams.dark.coreAlphaScale, paletteParams.light.coreAlphaScale, themeTransition),
          centerAlphaBase: lerp(paletteParams.dark.centerAlphaBase, paletteParams.light.centerAlphaBase, themeTransition),
          centerAlphaScale: lerp(paletteParams.dark.centerAlphaScale, paletteParams.light.centerAlphaScale, themeTransition),
        };

        cx.save();
        cx.translate(c.parallax.x, c.parallax.y);

        const time = now * 0.001;
        const mx = mouse.current.x;
        const my = mouse.current.y;

        let wavefrontX = -9999;
        let pulseStrength = 0;
        if (c.pulse.active) {
          const progress = (now - c.pulse.start) / c.pulse.duration;
          if (progress >= 1) {
            c.pulse.active = false;
            if (c.ambientEnabled) scheduleNextPulse(8000 + Math.random() * 4000);
          } else {
            wavefrontX = startX + (endX - startX) * progress;
            pulseStrength = Math.sin(progress * Math.PI);
            if (progress > 0.75 && !c.pulse.avatarFired) {
              c.pulse.avatarFired = true;
              onPulseNearAvatar?.();
            }
          }
        }

        nodes.forEach((n) => {
          let reveal = 1;
          if (!reducedMotion && introElapsed >= 0) {
            reveal = smooth((introElapsed / INTRO_DURATION - n.revealDelay) / 0.45);
          } else if (!introDone && introElapsed < 0) {
            reveal = 0;
          }
          if (reveal <= 0) return;

          const dist = Math.hypot(n.x - mx, n.y - my);
          const mouseInfluence = introDone ? Math.max(0, 1 - dist / 200) : 0;

          const waveDist = Math.abs(n.x - wavefrontX);
          const waveInfluence = pulseStrength * Math.max(0, 1 - waveDist / 90) * 0.7;

          const avatarDist = Math.hypot(n.x - c.avatarPos.x, n.y - c.avatarPos.y);
          const regionInfluence = c.regionBoost * Math.max(0, 1 - avatarDist / 170) * 0.6;

          n.targetActivation =
            0.2 + mouseInfluence * 0.8 + waveInfluence + regionInfluence +
            Math.sin(time * 2 + n.index * 0.5) * 0.1;
          n.activation += (n.targetActivation - n.activation) * 0.05;
          (n as Node & { _reveal: number })._reveal = reveal;
        });

        connections.forEach((cn) => {
          let reveal = 1;
          if (!reducedMotion && introElapsed >= 0) {
            reveal = smooth((introElapsed / INTRO_DURATION - cn.revealDelay) / 0.4);
          } else if (!introDone && introElapsed < 0) {
            reveal = 0;
          }
          if (reveal <= 0) return;
          if (!cn.active && cn.weight < 0.3) return;

          const speedMultiplier = 1 + c.signalBoost * 1.8;
          cn.signal = (cn.signal + cn.signalSpeed * speedMultiplier) % 1;

          const avgActivation = (cn.from.activation + cn.to.activation) / 2;
          const midX = (cn.from.x + cn.to.x) / 2;
          const waveBoost = pulseStrength * Math.max(0, 1 - Math.abs(midX - wavefrontX) / 90);
          const alpha = (p.lineAlphaBase + avgActivation * p.lineAlphaScale + waveBoost * 0.25) * reveal;

          const endLerp = 0.4 + reveal * 0.6;
          const drawToX = cn.from.x + (cn.to.x - cn.from.x) * endLerp;
          const drawToY = cn.from.y + (cn.to.y - cn.from.y) * endLerp;

          cx.beginPath();
          cx.moveTo(cn.from.x, cn.from.y);
          cx.lineTo(reveal >= 1 ? cn.to.x : drawToX, reveal >= 1 ? cn.to.y : drawToY);
          cx.strokeStyle = `rgba(${p.line[0]}, ${p.line[1]}, ${p.line[2]}, ${alpha})`;
          cx.lineWidth = 0.5 + cn.weight * 0.5;
          cx.stroke();

          if (avgActivation > 0.3 && reveal >= 1) {
            const sx = cn.from.x + (cn.to.x - cn.from.x) * cn.signal;
            const sy = cn.from.y + (cn.to.y - cn.from.y) * cn.signal;
            const signalAlpha = Math.sin(cn.signal * Math.PI) * avgActivation * (0.6 + c.signalBoost * 0.5);
            cx.beginPath();
            cx.arc(sx, sy, 1.5 + c.signalBoost * 0.8, 0, Math.PI * 2);
            cx.fillStyle = `rgba(${p.signal[0]}, ${p.signal[1]}, ${p.signal[2]}, ${signalAlpha})`;
            cx.fill();
          }
        });

        nodes.forEach((n) => {
          const reveal = (n as Node & { _reveal?: number })._reveal ?? (reducedMotion ? 1 : 0);
          if (reveal <= 0) return;

          const r = (nodeRadius + n.activation * 3) * (0.6 + reveal * 0.4);
          const layerColor = lerpRgb(layerColorsDark[n.layer], layerColorsLight[n.layer], themeTransition);

          const grad = cx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
          grad.addColorStop(0, `rgba(${p.glow[0]}, ${p.glow[1]}, ${p.glow[2]}, ${n.activation * p.glowAlphaScale * reveal})`);
          grad.addColorStop(1, `rgba(${p.glow[0]}, ${p.glow[1]}, ${p.glow[2]}, 0)`);
          cx.beginPath();
          cx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
          cx.fillStyle = grad;
          cx.fill();

          cx.beginPath();
          cx.arc(n.x, n.y, r, 0, Math.PI * 2);
          cx.fillStyle = `rgb(${layerColor[0]}, ${layerColor[1]}, ${layerColor[2]})`;
          cx.globalAlpha = (p.coreAlphaBase + n.activation * p.coreAlphaScale) * reveal;
          cx.fill();
          cx.globalAlpha = 1;

          cx.beginPath();
          cx.arc(n.x, n.y, r * 0.4, 0, Math.PI * 2);
          cx.fillStyle = `rgba(255, 255, 255, ${(p.centerAlphaBase + n.activation * p.centerAlphaScale) * reveal})`;
          cx.fill();
        });

        cx.restore();
        animFrame = requestAnimationFrame(draw);
      }

      draw();
      onReady?.();
      function onMove(e: MouseEvent) {
        const rect = canvas!.getBoundingClientRect();
        mouse.current.x = e.clientX - rect.left;
        mouse.current.y = e.clientY - rect.top;
      }
      function onLeave() {
        mouse.current.x = -999;
        mouse.current.y = -999;
      }
      function onResize() {
        cancelAnimationFrame(animFrame);
        buildNetwork();
        draw();
      }

      canvas.addEventListener("mousemove", onMove);
      canvas.addEventListener("mouseleave", onLeave);
      window.addEventListener("resize", onResize);

      return () => {
        cancelAnimationFrame(animFrame);
        canvas.removeEventListener("mousemove", onMove);
        canvas.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("resize", onResize);
        if (controls.current.ambientTimeout) clearTimeout(controls.current.ambientTimeout);
      };
    }, [reducedMotion, onPulseNearAvatar, onReady]);

    return (
      <div className="nn-canvas-wrapper">
        <canvas ref={canvasRef} className="nn-canvas" />
      </div>
    );
  }
);