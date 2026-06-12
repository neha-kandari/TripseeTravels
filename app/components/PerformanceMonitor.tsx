'use client';

import { useEffect } from 'react';

// Define interfaces for specific PerformanceEntry types
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: DOMHighResTimeStamp;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
}

// Type guards to narrow down PerformanceEntry types
function isPerformanceEventTiming(entry: PerformanceEntry): entry is PerformanceEventTiming {
  return entry.entryType === 'first-input';
}

function isLayoutShift(entry: PerformanceEntry): entry is LayoutShift {
  return entry.entryType === 'layout-shift';
}

const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (isPerformanceEventTiming(entry)) {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
        if (isLayoutShift(entry)) {
          console.log('CLS:', entry.value);
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 10000) { // Only log truly massive bottlenecks (> 10s)
          // console.warn('Slow resource:', entry.name, entry.duration);
        }
      }
    });

    resourceObserver.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
      resourceObserver.disconnect();
    };
  }, []);

  return null;
};

export default PerformanceMonitor;
