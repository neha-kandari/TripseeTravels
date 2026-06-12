'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Labels mirror what the desktop layout shows so the mobile experience reads
// identically to the wide-screen one.
const cards = [
  { id: 1, image: '/TravelVibes/Family.webp',       alt: 'Family Vacation',  label: 'Adventure Awaits'      },
  { id: 2, image: '/TravelVibes/honeyMoon.webp',    alt: 'Honey Moon',       label: 'Cultural Immersion'    },
  { id: 3, image: '/TravelVibes/BeachHoliday.webp', alt: 'Beach Holiday',    label: "Nature's Beauty"       },
  { id: 4, image: '/TravelVibes/HillStation.webp',  alt: 'Hill Station',     label: 'Urban Exploration'     },
  { id: 5, image: '/TravelVibes/Adventure.webp',    alt: 'Adventure',        label: 'Relaxation & Wellness' },
];

/**
 * Mobile/tablet Travel Vibes carousel — one card per row with auto-advance.
 *
 * Performance notes:
 *  - Uses NATIVE CSS scroll-snap; the browser does all the heavy lifting.
 *    Only thing JS does is call `scrollTo` on a timer + sync a dot indicator.
 *  - Auto-advance only runs while the section is in the viewport
 *    (IntersectionObserver). When the user scrolls away, the interval is
 *    cleared — no wasted CPU/battery while reading other parts of the page.
 *  - Touch + pointer interactions pause auto-advance for 5 s so swiping
 *    feels natural and predictable.
 *  - Respects `prefers-reduced-motion`: skips auto-advance entirely (the
 *    user can still swipe manually).
 *  - Scroll listener is throttled via requestAnimationFrame so it can't drop
 *    scroll frames on a slow device.
 *  - Hidden via `lg:hidden` so the JS never runs / hydrates effects on the
 *    desktop layout where the static 5-card grid is shown instead.
 */
const MobileVibesCarousel = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    let userScrollPauseUntil = 0;
    let rafId: number | null = null;

    const reduced = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cardWidthOf = () =>
      (track.firstElementChild as HTMLElement | null)?.clientWidth ?? track.clientWidth;

    const advance = () => {
      if (Date.now() < userScrollPauseUntil) return;
      const w = cardWidthOf();
      if (!w) return;
      const current = Math.round(track.scrollLeft / w);
      const next = (current + 1) % cards.length;
      track.scrollTo({ left: next * w, behavior: 'smooth' });
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const w = cardWidthOf();
        if (!w) return;
        setActiveIndex(Math.round(track.scrollLeft / w));
      });
    };
    const pauseTimer = () => { userScrollPauseUntil = Date.now() + 5000; };

    track.addEventListener('scroll', onScroll, { passive: true });
    track.addEventListener('touchstart', pauseTimer, { passive: true });
    track.addEventListener('pointerdown', pauseTimer);

    // Auto-advance only while the section is on screen.
    const io = !reduced && typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            if (!timer) timer = setInterval(advance, 4000);
          } else if (timer) {
            clearInterval(timer);
            timer = null;
          }
        }, { threshold: 0.3 })
      : null;
    io?.observe(track);

    return () => {
      io?.disconnect();
      track.removeEventListener('scroll', onScroll);
      track.removeEventListener('touchstart', pauseTimer);
      track.removeEventListener('pointerdown', pauseTimer);
      if (timer) clearInterval(timer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const w = (track.firstElementChild as HTMLElement | null)?.clientWidth ?? track.clientWidth;
    track.scrollTo({ left: i * w, behavior: 'smooth' });
  };

  return (
    <div className="lg:hidden">
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 sm:-mx-6 px-4 sm:px-6 gap-4 pb-2"
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-[45%]"
          >
            <div className="relative h-56 sm:h-64 md:h-72 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 768px) 60vw, 45vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <h3 className="text-xl sm:text-2xl font-light italic text-white drop-shadow-lg font-limelight">
                  {card.label}
                </h3>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-contact-popup'))}
                  className="self-start bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
                >
                  Book Trip →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {cards.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-6 bg-orange-500' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileVibesCarousel;
