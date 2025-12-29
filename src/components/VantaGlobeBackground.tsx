"use client";

import { useEffect, useRef } from "react";
import GLOBE from "vanta/dist/vanta.globe.min";
import * as THREE from "three";

export default function VantaGlobeBackground() {
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current) {
      vantaEffect.current = GLOBE({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 0.8,
        color: 0x00ffff, // globe dots
        backgroundColor: 0x000000, // black bg
      });
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return <div ref={vantaRef} className="fixed inset-0 -z-10" />;
}
