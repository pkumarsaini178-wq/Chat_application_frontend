import React, { useState, useEffect, useRef, useMemo } from 'react';
import './NightModeChatBackground.css';

// Helper Easing: easeInOutQuad (t < 0.5 ? 2*t*t : 1 - (-2*t + 2)^2 / 2)
const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function NightModeChatBackground({
  riseDurationMs = 1800000, // 30 minutes default
  dayHoldMs = 300000,        // 5 minutes default
  reducedMotion = false,     // testing override flag
  speedMultiplier = 1,       // QA speed multiplier (e.g. 60x speed for testing)
  initialMessages = [
    { id: 1, sender: 'them', text: 'Hey there! How is the night sky looking over your city?', time: '11:42 PM' },
    { id: 2, sender: 'me', text: 'It looks absolutely stunning! The moon and stars are twinkling brightly. ✨', time: '11:43 PM' },
    { id: 3, sender: 'them', text: 'That sounds magical! Enjoy the peaceful night view. 🌙', time: '11:44 PM' }
  ]
}) {
  const [cycleTimeMs, setCycleTimeMs] = useState(0);
  const [shootingStars, setShootingStars] = useState([]);
  const [messages, setMessages] = useState(initialMessages);
  const [inputMsg, setInputMsg] = useState('');

  const animFrameRef = useRef(null);
  const lastTimestampRef = useRef(null);

  // Check system prefers-reduced-motion media query
  const isReducedMotion = useMemo(() => {
    if (reducedMotion) return true;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, [reducedMotion]);

  // Generate 35 Back Stars and 20 Front Stars once
  const starsData = useMemo(() => {
    const generateStars = (count, minSize, maxSize) => {
      const list = [];
      for (let i = 0; i < count; i++) {
        list.push({
          id: i,
          top: `${(Math.random() * 75).toFixed(2)}%`,
          left: `${(Math.random() * 96 + 2).toFixed(2)}%`,
          size: `${(Math.random() * (maxSize - minSize) + minSize).toFixed(2)}px`,
          twinkleDuration: `${(Math.random() * 3 + 2).toFixed(2)}s`,
          twinkleDelay: `${(Math.random() * 5).toFixed(2)}s`,
          driftDuration: `${(Math.random() * 4 + 4).toFixed(2)}s`,
          driftDelay: `${(Math.random() * 5).toFixed(2)}s`,
          driftOffset: `${(Math.random() * 6 - 3).toFixed(2)}px`
        });
      }
      return list;
    };
    return {
      back: generateStars(35, 0.5, 1.2),
      front: generateStars(20, 1.2, 2.2)
    };
  }, []);

  // Total cycle duration
  const totalCycleMs = useMemo(() => riseDurationMs + dayHoldMs, [riseDurationMs, dayHoldMs]);

  // Main animation loop driven by requestAnimationFrame & Page Visibility API
  useEffect(() => {
    if (isReducedMotion) return;

    const animate = (timestamp) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const delta = (timestamp - lastTimestampRef.current) * speedMultiplier;
      lastTimestampRef.current = timestamp;

      setCycleTimeMs((prev) => (prev + delta) % totalCycleMs);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        lastTimestampRef.current = null;
      } else {
        lastTimestampRef.current = null;
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [totalCycleMs, speedMultiplier, isReducedMotion]);

  // Shooting stars random generator loop
  useEffect(() => {
    if (isReducedMotion) return;

    let timer;
    const scheduleShootingStar = () => {
      const nextDelay = Math.random() * 20000 + 15000; // 15s to 35s
      timer = setTimeout(() => {
        const id = Date.now() + Math.random();
        const top = Math.random() * 35 + 5; // upper sky 5%-40%
        const left = Math.random() * 60 + 10;
        setShootingStars((prev) => [...prev, { id, top, left }]);

        // Remove from DOM after 1.8s
        setTimeout(() => {
          setShootingStars((prev) => prev.filter((s) => s.id !== id));
        }, 1800);

        scheduleShootingStar();
      }, nextDelay);
    };

    scheduleShootingStar();
    return () => clearTimeout(timer);
  }, [isReducedMotion]);

  // Compute Current Animation Stage & Opacities
  const { moonTopPercent, haloOpacity, hazeOpacity, starOpacity, dawnOpacity, dayOpacity, isDay } = useMemo(() => {
    if (isReducedMotion) {
      return {
        moonTopPercent: 22,
        haloOpacity: 1,
        hazeOpacity: 1,
        starOpacity: 1,
        dawnOpacity: 0,
        dayOpacity: 0,
        isDay: false
      };
    }

    let rawProgress = 0;
    if (cycleTimeMs <= riseDurationMs) {
      rawProgress = cycleTimeMs / riseDurationMs; // 0 to 1
    } else {
      // Day hold phase (5 mins)
      rawProgress = 1;
    }

    // Eased vertical progress for Moonrise (120% below frame up to 20% near top)
    const easedProgress = easeInOutQuad(rawProgress);
    const moonTopPercent = 120 - easedProgress * 100; // 120% -> 20%

    // Sunrise stages:
    // 1. Last 30% to 10% of rise (rawProgress: 0.70 to 0.90) -> Dawn Fades In, Stars/Haze Fade Out
    // 2. Final 10% (rawProgress: 0.90 to 1.0) -> Dawn Fades Out, Day Fades In Fully
    let hazeOpacity = 1;
    let starOpacity = 1;
    let dawnOpacity = 0;
    let dayOpacity = 0;

    if (rawProgress >= 0.70 && rawProgress < 0.90) {
      const p = (rawProgress - 0.70) / 0.20; // 0 to 1
      dawnOpacity = p;
      starOpacity = 1 - p;
      hazeOpacity = 1 - p;
    } else if (rawProgress >= 0.90) {
      const p = (rawProgress - 0.90) / 0.10; // 0 to 1
      dawnOpacity = 1 - p;
      dayOpacity = p;
      starOpacity = 0;
      hazeOpacity = 0;
    }

    const isDay = dayOpacity > 0.5;
    const haloOpacity = 1 - Math.min(1, dayOpacity + dawnOpacity);

    return {
      moonTopPercent,
      haloOpacity,
      hazeOpacity,
      starOpacity,
      dawnOpacity,
      dayOpacity,
      isDay
    };
  }, [cycleTimeMs, riseDurationMs, isReducedMotion]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  return (
    <div className={`night-mode-chat-container ${isDay ? 'is-day-mode' : ''}`}>
      {/* Sky Background Layer */}
      <div className="sky-background">
        {/* Horizon Haze */}
        <div className="horizon-haze" style={{ opacity: hazeOpacity }} />

        {/* Back Star Layer (~35 Stars) */}
        <div className="star-layer back" style={{ opacity: starOpacity }}>
          {starsData.back.map((star) => (
            <div
              key={`back-${star.id}`}
              className="star"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                '--twinkle-duration': star.twinkleDuration,
                '--twinkle-delay': star.twinkleDelay,
                '--drift-duration': star.driftDuration,
                '--drift-delay': star.driftDelay,
                '--drift-offset': star.driftOffset
              }}
            />
          ))}
        </div>

        {/* Front Star Layer (~20 Stars) */}
        <div className="star-layer front" style={{ opacity: starOpacity }}>
          {starsData.front.map((star) => (
            <div
              key={`front-${star.id}`}
              className="star"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                boxShadow: '0 0 4px #ffffff',
                '--twinkle-duration': star.twinkleDuration,
                '--twinkle-delay': star.twinkleDelay,
                '--drift-duration': star.driftDuration,
                '--drift-delay': star.driftDelay,
                '--drift-offset': star.driftOffset
              }}
            />
          ))}
        </div>

        {/* Shooting Stars */}
        {shootingStars.map((s) => (
          <div key={s.id} className="shooting-star" style={{ top: `${s.top}%`, left: `${s.left}%` }} />
        ))}

        {/* 3D Moon & Halo Glow */}
        <div className="moon-wrapper" style={{ top: `${moonTopPercent}%` }}>
          <div className="moon-halo" style={{ opacity: haloOpacity }} />
          <div className="moon">
            <div className="crater crater-1" />
            <div className="crater crater-2" />
            <div className="crater crater-3" />
            <div className="crater crater-4" />
          </div>
        </div>

        {/* 3D Puffy Clouds (3 Permanent Overlapping Circles Puffs) */}
        <div className="cloud-layer">
          <div className="cloud cloud-1">
            <div className="cloud-puff" style={{ width: '48px', height: '48px' }} />
            <div className="cloud-puff" style={{ width: '64px', height: '64px', marginLeft: '-18px' }} />
            <div className="cloud-puff" style={{ width: '42px', height: '42px', marginLeft: '-16px' }} />
          </div>
          <div className="cloud cloud-2">
            <div className="cloud-puff" style={{ width: '56px', height: '56px' }} />
            <div className="cloud-puff" style={{ width: '78px', height: '78px', marginLeft: '-22px' }} />
            <div className="cloud-puff" style={{ width: '52px', height: '52px', marginLeft: '-20px' }} />
          </div>
          <div className="cloud cloud-3">
            <div className="cloud-puff" style={{ width: '42px', height: '42px' }} />
            <div className="cloud-puff" style={{ width: '58px', height: '58px', marginLeft: '-16px' }} />
            <div className="cloud-puff" style={{ width: '38px', height: '38px', marginLeft: '-14px' }} />
          </div>
        </div>

        {/* Dawn & Day Overlays */}
        <div className="dawn-overlay" style={{ opacity: dawnOpacity }} />
        <div className="day-overlay" style={{ opacity: dayOpacity }} />
      </div>

      {/* Chat UI Layer */}
      <div className="chat-ui-layer">
        {/* Frosted Glass Header */}
        <div className="chat-header">
          <div className="chat-header-avatar">L</div>
          <div className="chat-header-info">
            <h4>Luna Sky</h4>
            <p>
              <span className="status-dot-indicator" /> Online - Night Sky
            </p>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="chat-messages-area">
          {messages.map((m) => (
            <div key={m.id} className={`message-row ${m.sender}`}>
              <div className={`message-bubble ${m.sender}`}>
                <div className="message-text">{m.text}</div>
                <div className="message-time">{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Frosted Glass Input Bar */}
        <form className="chat-input-bar" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-input-field"
            placeholder="Type a message into the night sky..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
          />
          <button type="submit" className="chat-send-btn" title="Send Message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
