"use client";

import { useCallback, useEffect, useRef, forwardRef } from "react";
import dynamic from "next/dynamic";
import { animate, createTimeline, stagger } from "animejs";
import { Chip, Link } from "@heroui/react";
import {
  FaGithub, FaLinkedin, FaEnvelope, FaUniversity, FaAtom,
} from "react-icons/fa";
import { FaDiagramProject } from "react-icons/fa6";
import Image from "next/image";
import type { RefObject } from "react";
import { title } from "@/components/primitives";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { NeuralNetworkHandle } from "./NeuralNetworkCanvas";

const DynamicNeuralNetworkCanvas = dynamic(
  () => import("./NeuralNetworkCanvas").then((m) => ({ default: m.NeuralNetworkCanvas })),
  { ssr: false }
);

interface NeuralNetworkCanvasProps {
  avatarRef?: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
  onPulseNearAvatar?: () => void;
  onReady?: () => void;
}

const NeuralNetworkCanvas = forwardRef<NeuralNetworkHandle, NeuralNetworkCanvasProps>(
  function NeuralNetworkCanvasBridge(props, ref) {
    return <DynamicNeuralNetworkCanvas {...props} ref={ref} />;
  }
);

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const canvasHandleRef = useRef<NeuralNetworkHandle>(null);
  const hasPlayedCanvasIntroRef = useRef(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const chipsRowRef = useRef<HTMLDivElement>(null);
  const affiliationRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const physicsChipRef = useRef<HTMLDivElement>(null);
  const mlChipRef = useRef<HTMLDivElement>(null);

  const startCanvasIntro = useCallback(() => {
    const canvasHandle = canvasHandleRef.current;
    if (!canvasHandle) return;
    if (!hasPlayedCanvasIntroRef.current) {
      hasPlayedCanvasIntroRef.current = true;
      canvasHandle.playIntro();
    }
    canvasHandle.startAmbientPulses();
  }, []);

  useEffect(() => {
  const glowEl = glowRef.current;
  const imageWrapEl = imageWrapRef.current;
  const nameEl = nameRef.current;
  const chipsRowEl = chipsRowRef.current;
  const affiliationEl = affiliationRef.current;
  const actionsEl = actionsRef.current;
  const socialLinksEl = socialLinksRef.current;

  if (
    !glowEl || !imageWrapEl || !nameEl ||
    !chipsRowEl || !affiliationEl || !actionsEl || !socialLinksEl
  ) {
    return;
  }

  let cancelled = false;
  let tl: ReturnType<typeof createTimeline> | undefined;

  function runIntro() {
    if (cancelled) return;
    if (reducedMotion) {
      timeoutId
      animate(
        [glowEl, imageWrapEl, nameEl, chipsRowEl, affiliationEl, actionsEl, socialLinksEl],
        { opacity: [0, 1], duration: 1, delay: 0 }
      );
      return;
    }

    tl = createTimeline({ defaults: { ease: "outCubic" } });
    tl.add(glowEl!, { opacity: [0, 1], scale: [0.8, 1], duration: 450 }, 550)
      .add(imageWrapEl!, { opacity: [0, 1], scale: [0.95, 1], duration: 500 }, "-=250")
      .add(nameEl!, {
        opacity: [0, 1],
        translateY: [12, 0],
        filter: ["blur(6px)", "blur(0px)"],
        duration: 500,
      }, "-=280")
      .add(Array.from(chipsRowEl!.children) as HTMLElement[], {
        opacity: [0, 1],
        scale: [0.85, 1],
        translateY: [8, 0],
        duration: 380,
        ease: "outBack",
        delay: stagger(90),
      }, "-=200")
      .add(affiliationEl!, { opacity: [0, 1], translateY: [8, 0], duration: 350 }, "-=120")
      .add(actionsEl!, { opacity: [0, 1], translateY: [8, 0], duration: 350 }, "-=180")
      .add(Array.from(socialLinksEl!.children) as HTMLElement[], {
        opacity: [0, 1],
        translateY: [6, 0],
        duration: 300,
        delay: stagger(70),
      }, "-=150");
  }

  const timeoutId = setTimeout(runIntro, 100);

  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
    tl?.pause();
    canvasHandleRef.current?.stopAmbientPulses();
  };
}, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const hero = heroRef.current;
    if (!hero) return;

    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const heroHeight = hero!.offsetHeight;
        const progress = Math.min(1, Math.max(0, window.scrollY / (heroHeight * 0.6)));

        hero!.style.setProperty("--hero-bg-opacity", String(1 - progress * 0.6));
        if (imageWrapRef.current) {
          imageWrapRef.current.style.setProperty("--hero-scroll-scale", String(1 - progress * 0.15));
        }
        if (nameRef.current) {
          nameRef.current.style.setProperty("--hero-scroll-translate", `${-progress * 20}px`);
        }
        hero!.style.setProperty("--hero-content-opacity", String(1 - progress * 0.4));
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  function handlePhysicsEnter() {
    canvasHandleRef.current?.setRegionBoost(true);
  }
  function handlePhysicsLeave() {
    canvasHandleRef.current?.setRegionBoost(false);
  }
  function handleMlEnter() {
    canvasHandleRef.current?.setSignalBoost(true);
  }
  function handleMlLeave() {
    canvasHandleRef.current?.setSignalBoost(false);
  }

  function handlePulseNearAvatar() {
    if (reducedMotion || !glowRef.current) return;
    animate(glowRef.current, {
      opacity: [{ to: 1, duration: 350 }, { to: 0.75, duration: 650 }],
      scale: [{ to: 1.08, duration: 350 }, { to: 1, duration: 650 }],
      ease: "outQuad",
    });
  }

  return (
    <section ref={heroRef} className="home-hero">
      <div className="home-hero-bg" style={{ opacity: "var(--hero-bg-opacity, 1)" }}>
        <NeuralNetworkCanvas
          ref={canvasHandleRef}
          avatarRef={avatarRef}
          reducedMotion={reducedMotion}
          onPulseNearAvatar={handlePulseNearAvatar}
          onReady={startCanvasIntro}
        />
      </div>
      <div className="home-hero-content" style={{ opacity: "var(--hero-content-opacity, 1)" }}>
        <div className="home-profile" ref={avatarRef}>
          <div
            ref={imageWrapRef}
            className="relative w-28 h-28 md:w-36 md:h-36"
            style={{
              opacity: 0,
              transform: "scale(var(--hero-scroll-scale, 1))",
            }}
          >
            <div
              ref={glowRef}
              className="absolute -inset-2 rounded-full bg-linear-to-r from-blue-500/40 to-purple-500/40 blur-xl"
              style={{ opacity: 0 }}
            />
            <div className="relative w-full h-full rounded-full overflow-hidden border-3 border-primary shadow-2xl">
              <Image
                src="/profile.jpg"
                alt="Somesh Tiwari"
                fill
                loading="eager"
                sizes="(max-width: 768px) 112px, 144px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className="home-me">
          <h1
            ref={nameRef}
            className={title({ color: "blue", size: "lg", class: "tracking-tight" })}
            style={{ opacity: 0, transform: "translateY(var(--hero-scroll-translate, 0px))" }}
          >
            Somesh Tiwari
          </h1>

          <div className="home-chips" ref={chipsRowRef}>
            <Chip
              color="accent"
              variant="soft"
              size="md"
              ref={physicsChipRef}
              onMouseEnter={handlePhysicsEnter}
              onMouseLeave={handlePhysicsLeave}
              style={{ opacity: 0 }}
            >
              <FaAtom />
              High Energy Physics
            </Chip>
            <span className="text-default-300 hidden sm:inline">•</span>
            <Chip
              color="success"
              variant="soft"
              size="md"
              ref={mlChipRef}
              onMouseEnter={handleMlEnter}
              onMouseLeave={handleMlLeave}
              style={{ opacity: 0 }}
            >
              <FaDiagramProject />
              <Chip.Label>Machine Learning</Chip.Label>
            </Chip>
          </div>

          <div className="home-affiliation" ref={affiliationRef} style={{ opacity: 0 }}>
            <FaUniversity className="text-primary" />
            <span>IISER Mohali</span>
          </div>
          <div className="home-tagline">
            <span>Hi</span>
          </div>
        </div>

        <div className="home-actions" ref={actionsRef} style={{ opacity: 0 }}>
          <Link href="mailto:ms25003@iisermohali.ac.in" className="home-btn-primary home-btn-sweep">
            <FaEnvelope />
            Contact
          </Link>
          <div className="home-social-links" ref={socialLinksRef}>
            <Link href="https://github.com/tiwarisomesh" className="home-social-link" aria-label="GitHub" style={{ opacity: 0 }}>
              <FaGithub size={18} />
            </Link>
            <Link href="https://linkedin.com/in/tiwari-somesh" className="home-social-link" aria-label="LinkedIn" style={{ opacity: 0 }}>
              <FaLinkedin size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}