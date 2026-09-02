import React, { useEffect, useMemo, useState } from 'react';
import Star from './Star.jsx';
import Cloud from './Cloud.jsx';
import Moon from './Moon.jsx';
import ChatUI from './ChatUI.jsx';

const RISE_DURATION_MS = 1800000;
const DESCEND_DURATION_MS = 300000;

const ease = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const generateStars = (count, minSize, maxSize, minDrift, maxDrift) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      left: randomBetween(0, 95),
      top: randomBetween(0, 55),
      size: randomBetween(minSize, maxSize),
      twinkleDuration: randomBetween(2, 5),
      twinkleDelay: randomBetween(0, 3),
      driftDuration: randomBetween(minDrift, maxDrift),
    });
  }
  return stars;
};

const CLOUD_SPECS = [
  { id: 'a', top: '20%', left: '6%', scale: 1.1, driftDuration: 34 },
  { id: 'b', top: '30%', left: '55%', scale: 0.85, driftDuration: 28 },
  { id: 'c', top: '14%', left: '72%', scale: 0.95, driftDuration: 30 },
];

const KEYFRAMES = `
@keyframes twinkle {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 1; }
}
@keyframes drift {
  0% { transform: translateX(0); }
  100% { transform: translateX(14px); }
}
@keyframes shoot {
  0% { transform: translate(0, 0); opacity: 0; }
  5% { opacity: 1; }
  20% { transform: translate(-160px, 90px); opacity: 0; }
  100% { opacity: 0; }
}
@keyframes cloudDrift {
  0% { transform: translateX(0); }
  100% { transform: translateX(60px); }
}
.chat-input::placeholder {
  color: #5C6270;
}
`;

const REDUCED_MOTION_STAGE = {
  moonBottom: 220,
  glowBottom: 196,
  dawnOpacity: 0,
  dayOpacity: 0,
  starOpacity: 1,
  hazeOpacity: 1,
};

const STAR_LAYER_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 2,
  pointerEvents: 'none',
};

export default function NightModeChatBackground({
  riseDurationMs = RISE_DURATION_MS,
  descendMs = DESCEND_DURATION_MS,
  speedMultiplier = 1,
  reducedMotion = null,
}) {
  const [isReducedMotion] = useState(() => {
    if (reducedMotion === true) return true;
    if (reducedMotion === false) return false;
    return (
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  });

  const backStars = useMemo(
    () => generateStars(35, 0.5, 1.2, 20, 30),
    []
  );
  const frontStars = useMemo(
    () => generateStars(20, 1.2, 2.2, 12, 22),
    []
  );

  const [stage, setStage] = useState(
    isReducedMotion
      ? REDUCED_MOTION_STAGE
      : {
          moonBottom: -56,
          glowBottom: -80,
          dawnOpacity: 0,
          dayOpacity: 0,
          starOpacity: 1,
          hazeOpacity: 1,
        }
  );

  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    if (isReducedMotion) {
      setStage(REDUCED_MOTION_STAGE);
      return;
    }

    const effectiveRise = riseDurationMs / speedMultiplier;
    const effectiveDescend = descendMs / speedMultiplier;
    const totalMs = effectiveRise + effectiveDescend;

    let rafId = null;
    let startTime = performance.now();
    let hiddenElapsed = 0;

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const cycle = elapsed % totalMs;

      let h;
      if (cycle <= effectiveRise) {
        h = ease(cycle / effectiveRise);
      } else {
        h = 1 - ease((cycle - effectiveRise) / effectiveDescend);
      }

      const moonBottom = -56 + h * 300;
      const glowBottom = -80 + h * 300;

      let dawnOpacity = 0;
      let dayOpacity = 0;
      let starOpacity = 1;
      let hazeOpacity = 1;

      if (h >= 0.7 && h <= 0.9) {
        const dt = (h - 0.7) / 0.2;
        dawnOpacity = dt;
        starOpacity = Math.max(0, 1 - dt * 1.5);
        hazeOpacity = Math.max(0, 1 - dt * 1.5);
      } else if (h > 0.9) {
        const dt = (h - 0.9) / 0.1;
        dawnOpacity = Math.max(0, 1 - dt);
        dayOpacity = dt;
        starOpacity = 0;
        hazeOpacity = 0;
      }

      setStage({
        moonBottom,
        glowBottom,
        dawnOpacity,
        dayOpacity,
        starOpacity,
        hazeOpacity,
      });

      rafId = requestAnimationFrame(tick);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(rafId);
        hiddenElapsed = performance.now() - startTime;
      } else {
        startTime = performance.now() - hiddenElapsed;
        rafId = requestAnimationFrame(tick);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(rafId);
    };
  }, [isReducedMotion, riseDurationMs, descendMs, speedMultiplier]);

  useEffect(() => {
    if (isReducedMotion) return;

    let timer = null;
    const schedule = () => {
      timer = setTimeout(() => {
        const id = `${Date.now()}-${Math.random()}`;
        const top = randomBetween(5, 35);
        const left = randomBetween(40, 80);
        setShootingStars((prev) => [...prev, { id, top, left }]);
        setTimeout(() => {
          setShootingStars((prev) => prev.filter((s) => s.id !== id));
        }, 1800);
        schedule();
      }, randomBetween(15000, 35000));
    };

    schedule();
    return () => clearTimeout(timer);
  }, [isReducedMotion]);

  const animate = !isReducedMotion;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 520,
        minHeight: 400,
        borderRadius: 16,
        overflow: 'hidden',
        background: 'linear-gradient(#15171C 45%, #16202C 85%, #1B2838 100%)',
      }}
    >
      <style>{KEYFRAMES}</style>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 120,
          zIndex: 1,
          background:
            'linear-gradient(rgba(30,45,65,0) 0%, rgba(45,65,90,0.35) 100%)',
          opacity: stage.hazeOpacity,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          background: '#F4B183',
          opacity: stage.dawnOpacity,
          transition: 'opacity 8s ease',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          background: '#FFFFFF',
          opacity: stage.dayOpacity,
          transition: 'opacity 8s ease',
          pointerEvents: 'none',
        }}
      />

      <div style={{ ...STAR_LAYER_STYLE, opacity: stage.starOpacity }}>
        {backStars.map((star) => (
          <Star key={`back-${star.id}`} {...star} animate={animate} />
        ))}
      </div>

      <div style={{ ...STAR_LAYER_STYLE, opacity: stage.starOpacity }}>
        {frontStars.map((star) => (
          <Star key={`front-${star.id}`} {...star} animate={animate} />
        ))}
      </div>

      <div style={STAR_LAYER_STYLE}>
        {shootingStars.map((s) => (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: 60,
              height: 2,
              borderRadius: 2,
              background:
                'linear-gradient(to left, rgba(255,255,255,0.9), rgba(255,255,255,0))',
              animation: 'shoot 1.8s ease-out forwards',
            }}
          />
        ))}
      </div>

      <Moon bottom={stage.moonBottom} glowBottom={stage.glowBottom} />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        {CLOUD_SPECS.map((cloud) => (
          <Cloud key={cloud.id} {...cloud} animate={animate} />
        ))}
      </div>

      <ChatUI />
    </div>
  );
}
