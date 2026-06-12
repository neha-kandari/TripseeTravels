'use client';

import React, { useEffect, useRef, useState } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  /** Animation direction. Default: 'up' */
  direction?: Direction;
  /** Delay in ms before animation starts after entering viewport */
  delay?: number;
  /** Duration of the transition in ms */
  duration?: number;
  /** Distance to translate from in px */
  distance?: number;
  /** Element rendered. Default: 'div' */
  as?: keyof React.JSX.IntrinsicElements;
  /** Forwarded class names */
  className?: string;
  /** IntersectionObserver threshold (0–1) */
  threshold?: number;
  /** IntersectionObserver rootMargin */
  rootMargin?: string;
  style?: React.CSSProperties;
}

const transformFor = (direction: Direction, distance: number): string => {
  switch (direction) {
    case 'up':    return `translate3d(0, ${distance}px, 0)`;
    case 'down':  return `translate3d(0, -${distance}px, 0)`;
    case 'left':  return `translate3d(${distance}px, 0, 0)`;
    case 'right': return `translate3d(-${distance}px, 0, 0)`;
    default:      return 'none';
  }
};

/**
 * Scroll-triggered reveal that NEVER causes a blank screen.
 *
 * Strategy:
 *  - SSR + initial client render → content rendered fully visible (no styles
 *    applied at all). Hydration matches SSR exactly.
 *  - On mount, JS measures the element. If it's already in / above the
 *    viewport, leave it alone — it stays visible forever.
 *  - Only elements BELOW the viewport at mount are hidden, then observed.
 *    Because they're off-screen, the user never sees the "hidden" frame.
 *    When the user scrolls them into view, they fade up.
 *  - Respects `prefers-reduced-motion`: skips animation entirely.
 *  - Falls back to "always visible" when IntersectionObserver isn't available.
 *
 * Result: content is always visible to the user; the animation is pure polish
 * for what's still below the fold when the page loads.
 */
const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  distance = 16,
  as = 'div',
  className = '',
  threshold = 0,
  // Positive bottom margin: the observer fires while the section is still
  // 300 px BELOW the viewport, so its fade-in is already in flight by the
  // time the user scrolls it into view — no "blank then fade" flicker.
  rootMargin = '0px 0px 300px 0px',
  style,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  // `phase` drives rendered styles:
  //   'idle'   → no animation styles, content visible (the safe default)
  //   'hidden' → opacity 0 + translated, waiting to come into view
  //   'shown'  → animating to opacity 1 + no translate
  const [phase, setPhase] = useState<'idle' | 'hidden' | 'shown'>('idle');

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion → never animate.
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // No IntersectionObserver (very old browser) → leave visible.
    if (typeof IntersectionObserver === 'undefined') return;

    // Already in or above the viewport at mount → never animate, never blank.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) return;

    // Element is below the viewport. Safe to hide now (user can't see it
    // anyway) and animate in when it scrolls into view.
    setPhase('hidden');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase('shown');
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  // Build inline style only when we're actively animating. In the 'idle'
  // phase (SSR render and initial hydration) we attach NO style overrides
  // so nothing can collapse, hide, or clip the children.
  const inlineStyle: React.CSSProperties | undefined =
    phase === 'idle'
      ? style
      : {
          opacity: phase === 'shown' ? 1 : 0,
          transform: phase === 'shown' ? 'none' : transformFor(direction, distance),
          transition:
            `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, ` +
            `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          willChange: phase === 'shown' ? 'auto' : 'opacity, transform',
          ...style,
        };

  const Tag = as as keyof React.JSX.IntrinsicElements;
  return React.createElement(
    Tag,
    {
      ref: ref as React.Ref<HTMLElement>,
      className,
      style: inlineStyle,
    },
    children
  );
};

export default Reveal;
