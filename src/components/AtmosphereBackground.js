"use client";

import { useEffect, useState } from "react";

export default function AtmosphereBackground() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" suppressHydrationWarning>
      {/* Dynamic Cursor Spotlight Aura */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-40 mix-blend-screen transition-transform duration-300 ease-out hidden lg:block"
        style={{
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
          background:
            "radial-gradient(circle, rgba(203, 168, 100, 0.08) 0%, rgba(13, 27, 42, 0) 70%)",
        }}
      />

      {/* Floating Gold Light Embers on River Water */}
      <div className="absolute inset-0 opacity-40">
        <div className="ember-particle particle-1" />
        <div className="ember-particle particle-2" />
        <div className="ember-particle particle-3" />
        <div className="ember-particle particle-4" />
        <div className="ember-particle particle-5" />
      </div>

      {/* Subtle River Wave Mesh Gradient */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 mix-blend-soft-light"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.04" />
      </svg>
    </div>
  );
}
