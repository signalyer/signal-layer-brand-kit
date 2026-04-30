'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Desktop-only mouse-follow glow. Mirrors signallayer.ai's CursorGlow.
 *
 * 400px radial gradient blob in primary teal at 8% alpha, spring-damped.
 * Disabled on mobile (matchMedia max-width: 768px). Mount once at the
 * top of your app/page tree.
 */
export function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    setMobile(isMobile);
    if (isMobile) return;

    const update = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);

    window.addEventListener('mousemove', update);
    document.body.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', update);
      document.body.removeEventListener('mouseleave', leave);
    };
  }, []);

  if (mobile) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-30 w-[400px] h-[400px] rounded-full"
      style={{
        background:
          'radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)',
      }}
      animate={{
        x: pos.x - 200,
        y: pos.y - 200,
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
    />
  );
}
