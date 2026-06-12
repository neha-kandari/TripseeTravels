'use client';

import React, { useState, memo, useCallback } from 'react';

// ─── Testimonial data ─────────────────────────────────────────────────────────
// video   → Cloudinary with q_auto,f_auto (auto-compressed, best format per browser)
// poster  → Cloudinary thumbnail of first frame (so_0 = seek to 0s → JPEG)
//           This image shows INSTANTLY while the video loads — no gray blank card.
// fallback → local file (only works in local dev; VPS always uses Cloudinary)
const testimonials = [
  {
    destination: 'Bali',
    video:    'https://res.cloudinary.com/dpknmji5i/video/upload/q_auto,f_auto/v1762082014/Feedback/Feedback/WhatsApp%20Video%202024-02-21%20at%2016.23.19_fd0537da.mp4',
    poster:   'https://res.cloudinary.com/dpknmji5i/video/upload/so_0,q_auto,f_auto/v1762082014/Feedback/Feedback/WhatsApp%20Video%202024-02-21%20at%2016.23.19_fd0537da.jpg',
    fallback: '/Feedback/WhatsApp%20Video%202024-02-21%20at%2016.23.19_fd0537da.mp4',
  },
  {
    destination: 'Thailand',
    video:    'https://res.cloudinary.com/dpknmji5i/video/upload/q_auto,f_auto/v1762082060/Feedback/Feedback/WhatsApp%20Video%202024-12-23%20at%206.27.27%20PM.mp4',
    poster:   'https://res.cloudinary.com/dpknmji5i/video/upload/so_0,q_auto,f_auto/v1762082060/Feedback/Feedback/WhatsApp%20Video%202024-12-23%20at%206.27.27%20PM.jpg',
    fallback: '/Feedback/WhatsApp%20Video%202024-12-23%20at%206.27.27%20PM.mp4',
  },
  {
    destination: 'Bali',
    video:    'https://res.cloudinary.com/dpknmji5i/video/upload/q_auto,f_auto/v1762081962/Feedback/Feedback/WhatsApp%20Video%202024-01-11%20at%2017.30.52.mp4',
    poster:   'https://res.cloudinary.com/dpknmji5i/video/upload/so_0,q_auto,f_auto/v1762081962/Feedback/Feedback/WhatsApp%20Video%202024-01-11%20at%2017.30.52.jpg',
    fallback: '/Feedback/WhatsApp%20Video%202024-01-11%20at%2017.30.52.mp4',
  },
  {
    destination: 'Vietnam',
    video:    'https://res.cloudinary.com/dpknmji5i/video/upload/q_auto,f_auto/v1762082108/Feedback/Feedback/WhatsApp%20Video%202025-07-21%20at%204.08.19%20PM.mp4',
    poster:   'https://res.cloudinary.com/dpknmji5i/video/upload/so_0,q_auto,f_auto/v1762082108/Feedback/Feedback/WhatsApp%20Video%202025-07-21%20at%204.08.19%20PM.jpg',
    fallback: '/Feedback/WhatsApp%20Video%202025-07-21%20at%204.08.19%20PM.mp4',
  },
];

// ─── Single video card ────────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV === 'development';

interface CardProps {
  testimonial: typeof testimonials[0];
  index:       number;
  isActive:    boolean;
  muted:       boolean;
  error:       boolean;
  useFallback: boolean;
  onToggleMute:  () => void;
  onError:       () => void;
  cardClass:   string;
  style?:      React.CSSProperties;
}

const VideoCard = ({
  testimonial, index, isActive, muted, error, useFallback,
  onToggleMute, onError, cardClass, style,
}: CardProps) => {
  const videoSrc = isDev
    ? (testimonial.fallback || testimonial.video)
    : (useFallback ? testimonial.fallback : testimonial.video);

  const videoPoster = isDev ? undefined : testimonial.poster;

  return (
    <div className={cardClass} style={style}>
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        {error ? (
          <div className="w-full h-full bg-gradient-to-br from-pink-200 to-red-200 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className="text-4xl mb-2">📹</div>
              <div className="text-sm">Video unavailable</div>
            </div>
          </div>
        ) : (
          <video
            src={videoSrc}
            poster={videoPoster}
            className="w-full h-full object-cover"
            muted={muted}
            loop
            playsInline
            autoPlay={true}
            preload="auto"
            onError={onError}
            onCanPlay={(e) => {
              e.currentTarget.play().catch((err) => {
                console.log('Autoplay play execution failed/blocked:', err);
              });
            }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600/80 to-transparent p-3 md:p-4">
          <div className="flex space-x-1 md:space-x-2 mb-2">
            <span className="text-pink-400 text-sm md:text-lg">❤️</span>
            <span className="text-orange-400 text-sm md:text-lg">👍</span>
            <span className="text-orange-400 text-sm md:text-lg">👍</span>
            <span className="text-orange-400 text-sm md:text-lg">👍</span>
            <span className="text-yellow-400 text-sm md:text-lg">😍</span>
          </div>
          <div className="text-white">
            <div className="flex items-center space-x-1">
              <span>📍</span>
              <span className="text-sm md:text-base">{testimonial.destination}</span>
            </div>
          </div>
        </div>

        {/* Tripsee logo */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white/80 rounded-full px-2 py-1 md:px-3 md:py-1.5">
          <span className="text-red-500 font-bold text-xs md:text-sm">Tripsee</span>
        </div>

        {/* Mute toggle */}
        <button
          onClick={onToggleMute}
          className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/80 rounded-full p-1.5 md:p-2 hover:bg-white transition-colors cursor-pointer"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          <span className="text-gray-600 text-sm md:text-base">
            {muted ? '🔇' : '🔊'}
          </span>
        </button>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const TravelPostcard = memo(() => {
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [mutedStates,  setMutedStates]    = useState<Record<number, boolean>>({});
  const [videoErrors,  setVideoErrors]    = useState<Record<number, boolean>>({});
  const [useFallback,  setUseFallback]    = useState<Record<number, boolean>>({});

  const nextSlide = useCallback(() =>
    setCurrentIndex(p => (p + 1) % testimonials.length), []);
  const prevSlide = useCallback(() =>
    setCurrentIndex(p => (p - 1 + testimonials.length) % testimonials.length), []);

  const toggleMute = useCallback((i: number) =>
    setMutedStates(p => ({ ...p, [i]: !p[i] })), []);

  const handleError = useCallback((i: number) => {
    if (!useFallback[i] && testimonials[i].fallback) {
      setUseFallback(p => ({ ...p, [i]: true }));
    } else {
      setVideoErrors(p => ({ ...p, [i]: true }));
    }
  }, [useFallback]);

  const isMuted  = (i: number) => mutedStates[i] !== false;
  const isActive = (i: number) => i === currentIndex;

  return (
    <div className="relative">
      <div className="h-50" />
      <section className="py-8 md:py-12 lg:py-16 bg-yellow-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* ── Left: text ── */}
            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                <span className="text-pink-500 text-2xl">❤️</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-pink-600 font-limelight">
                  Travel Postcard
                </h2>
              </div>
              <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                A message from the heart ❤️
              </p>
              <div className="space-y-3 md:space-y-4">
                <p className="text-lg md:text-xl font-semibold text-pink-600">
                  Dream honeymoons crafted perfectly
                </p>
                <p className="text-base md:text-lg text-gray-600">
                  Let your journeys inspire the world ✨
                </p>
              </div>
            </div>

            {/* ── Right: videos ── */}
            <div className="relative w-full">

              {/* ── Mobile: horizontal scroll ── */}
              <div className="flex space-x-2 md:space-x-4 overflow-x-auto pb-4 w-full justify-start lg:hidden scrollbar-hide">
                {testimonials.map((t, i) => {
                  const visible =
                    i === currentIndex ||
                    i === (currentIndex + 1) % testimonials.length ||
                    i === (currentIndex + 2) % testimonials.length;

                  const cardClass = [
                    'flex-shrink-0 w-40 sm:w-48 h-72 sm:h-85 bg-white rounded-xl shadow-lg border-2 relative transition-transform duration-300',
                    i === currentIndex
                      ? 'border-red-500 scale-105 z-10 order-first'
                      : visible
                        ? 'border-gray-300 scale-95 opacity-70'
                        : 'hidden',
                  ].join(' ');

                  return (
                    <VideoCard
                      key={i}
                      testimonial={t}
                      index={i}
                      isActive={isActive(i)}
                      muted={isMuted(i)}
                      error={!!videoErrors[i]}
                      useFallback={!!useFallback[i]}
                      onToggleMute={() => toggleMute(i)}
                      onError={() => handleError(i)}
                      cardClass={cardClass}
                    />
                  );
                })}
              </div>

              {/* ── Desktop: 3-card carousel ── */}
              <div className="hidden lg:block">
                <div className="flex space-x-8 justify-center items-center transition-all duration-500 ease-in-out">
                  {testimonials.map((t, i) => {
                    const isVisible =
                      i === currentIndex ||
                      i === (currentIndex + 1) % testimonials.length ||
                      i === (currentIndex + 2) % testimonials.length;

                    if (!isVisible) return null;

                    const cardClass = [
                      'flex-shrink-0 bg-white rounded-xl shadow-lg border-2 relative transition-all duration-500 ease-in-out',
                      i === currentIndex
                        ? 'border-red-500 scale-105 z-10 shadow-2xl'
                        : 'border-gray-300 scale-95 opacity-80 shadow-lg',
                    ].join(' ');

                    return (
                      <VideoCard
                        key={i}
                        testimonial={t}
                        index={i}
                        isActive={isActive(i)}
                        muted={isMuted(i)}
                        error={!!videoErrors[i]}
                        useFallback={!!useFallback[i]}
                        onToggleMute={() => toggleMute(i)}
                        onError={() => handleError(i)}
                        cardClass={cardClass}
                        style={{ width: '280px', height: '500px' }}
                      />
                    );
                  })}
                </div>

                {/* Desktop nav */}
                <div className="flex justify-center items-center space-x-4 mt-6">
                  <button
                    onClick={prevSlide}
                    className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-lg font-bold"
                  >
                    ←
                  </button>
                  <div className="flex space-x-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                          i === currentIndex ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextSlide}
                    className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-lg font-bold"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Mobile nav */}
              <div className="lg:hidden flex justify-center items-center space-x-3 md:space-x-4 mt-4 md:mt-6">
                <button
                  onClick={prevSlide}
                  className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  ←
                </button>
                <div className="flex space-x-1.5 md:space-x-2">
                  {testimonials.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                        i === currentIndex ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  →
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

TravelPostcard.displayName = 'TravelPostcard';
export default TravelPostcard;
