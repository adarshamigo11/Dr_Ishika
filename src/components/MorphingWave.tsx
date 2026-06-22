'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const width = 1200;
const height = 400;

const startD = `M0 ${height / 2} C${width * 0.25} ${height / 2}, ${width * 0.375} ${height / 2}, ${width / 2} ${height / 2}, ${width * 0.625} ${height / 2}, ${width * 0.75} ${height / 2}, ${width} ${height / 2}`;

const endD = `M0 ${height / 2} C${width * 0.25} ${height / 2}, ${width * 0.375} 0, ${width / 2} 0, ${width * 0.625} 0, ${width * 0.75} ${height / 2}, ${width} ${height / 2}`;

const sineD = `M0 ${height / 2} C${width * 0.1} ${height / 2 + 75}, ${width * 0.2} ${height / 2 + 75}, ${width * 0.3} ${height / 2}, ${width * 0.4} ${height / 2 - 75}, ${width * 0.5} ${height / 2 - 75}, ${width * 0.6} ${height / 2}, ${width * 0.7} ${height / 2 + 75}, ${width * 0.8} ${height / 2 + 75}, ${width * 0.9} ${height / 2}, ${width} ${height / 2}`;

const sineD2 = `M0 ${height / 2} C${width * 0.1} ${height / 2 - 75}, ${width * 0.2} ${height / 2 - 75}, ${width * 0.3} ${height / 2}, ${width * 0.4} ${height / 2 + 75}, ${width * 0.5} ${height / 2 + 75}, ${width * 0.6} ${height / 2}, ${width * 0.7} ${height / 2 - 75}, ${width * 0.8} ${height / 2 - 75}, ${width * 0.9} ${height / 2}, ${width} ${height / 2}`;

export default function MorphingWave() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dashPathRef = useRef<SVGPathElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [currentD] = useState(startD);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.set('#morphLine', {
      attr: { 'stroke-width': 1.5 },
      stroke: '#ff4d4d',
    });
    gsap.set('#morphLineDash', {
      attr: { 'stroke-width': 1.5 },
      stroke: '#ff4d4d',
      strokeDasharray: '8 6',
    });

    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const dt = now - lastTime;
      if (dt < 16) return;

      const dy = window.scrollY - lastScrollY;
      const v = Math.abs((dy / dt) * 1000);

      lastScrollY = window.scrollY;
      lastTime = now;

      const targetWidth = gsap.utils.clamp(0.5, 5, v * 0.004);
      const targetScale = gsap.utils.clamp(1, 2.2, v * 0.002);

      gsap.to('#morphLine', {
        attr: { 'stroke-width': targetWidth },
        duration: 0.8,
        ease: 'power3.out',
      });
      gsap.to('#morphLineDash', {
        attr: { 'stroke-width': targetWidth * 0.8 },
        duration: 0.8,
        ease: 'power3.out',
      });
      gsap.to('.morph-wrapper', {
        scaleX: targetScale,
        duration: 0.8,
        ease: 'power3.out',
      });

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        gsap.to('#morphLine', {
          attr: { 'stroke-width': 1.5 },
          duration: 1.2,
          ease: 'elastic.out(1, 0.3)',
        });
        gsap.to('#morphLineDash', {
          attr: { 'stroke-width': 1.5 },
          duration: 1.2,
          ease: 'elastic.out(1, 0.3)',
        });
        gsap.to('.morph-wrapper', {
          scaleX: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.3)',
        });
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'center center',
        end: '+=1200',
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
      },
    });

    tl.fromTo(
      '#morphLine',
      { attr: { d: startD } },
      { attr: { d: endD }, ease: 'power2.inOut' },
      0
    )
      .fromTo(
        '#morphLineDash',
        { attr: { d: startD } },
        { attr: { d: endD }, ease: 'power2.inOut' },
        0
      )
      .fromTo(
        '#morphLine',
        { attr: { d: endD } },
        { attr: { d: sineD }, ease: 'power2.inOut' },
        '>'
      )
      .fromTo(
        '#morphLineDash',
        { attr: { d: endD } },
        { attr: { d: sineD }, ease: 'power2.inOut' },
        '<'
      )
      .to(
        '#morphLine',
        { attr: { d: sineD2 }, ease: 'power2.inOut' },
        '>'
      )
      .to(
        '#morphLineDash',
        { attr: { d: sineD2 }, ease: 'power2.inOut' },
        '<'
      );

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
    >
      <div className="morph-wrapper flex h-full w-full items-center justify-center" style={{ transformOrigin: 'center center' }}>
        <svg
          className="h-auto w-[120%]"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <path
            id="morphLine"
            ref={pathRef}
            d={currentD}
            fill="none"
          />
          <path
            id="morphLineDash"
            ref={dashPathRef}
            d={currentD}
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
