'use client';

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  scale?: number;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'section' | 'span';
}

/**
 * Lightweight scroll-reveal component.
 * Replaces Framer Motion whileInView — zero dependencies, ~1KB.
 * Safety: content auto-reveals after 3s even if IntersectionObserver fails.
 */
export default function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  y = 20,
  scale,
  className = '',
  style,
  as: Tag = 'div',
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // IntersectionObserver with generous rootMargin
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.02, rootMargin: '80px' }
    );
    obs.observe(el);

    // Safety: reveal after 3s regardless (prevents invisible content)
    const safety = setTimeout(() => setVisible(true), 3000);

    return () => {
      obs.disconnect();
      clearTimeout(safety);
    };
  }, []);

  const hiddenTransform = [
    y ? `translateY(${y}px)` : '',
    scale ? `scale(${scale})` : '',
  ].filter(Boolean).join(' ') || 'none';

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : hiddenTransform,
        transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
