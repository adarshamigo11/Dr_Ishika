'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ResearchCard from '@/components/ResearchCard';

const researchItems = [
  {
    image: '/assets/clinical-thumb-1.jpg',
    badge: 'Clinical Study',
    title: 'The Role of Movement Therapy in Chronic Lower Back Pain',
    description:
      'A comprehensive analysis of movement-based interventions for patients suffering from chronic lower back conditions over a 24-month period.',
  },
  {
    image: '/assets/clinical-thumb-2.jpg',
    badge: 'Research Paper',
    title: 'Neuromuscular Re-education Following ACL Reconstruction',
    description:
      'Examining the efficacy of targeted neuromuscular exercises in restoring full function after anterior cruciate ligament surgical repair.',
  },
  {
    image: '/assets/clinical-thumb-1.jpg',
    badge: 'Case Study',
    title: 'Hydrotherapy Protocols for Geriatric Mobility Enhancement',
    description:
      'Documenting outcomes of structured aquatic therapy programs for adults over 65 experiencing mobility decline and joint stiffness.',
  },
  {
    image: '/assets/clinical-thumb-2.jpg',
    badge: 'Clinical Trial',
    title: 'Dry Needling Efficacy in Myofascial Pain Syndrome',
    description:
      'Randomized controlled trial assessing pain reduction and functional improvement in patients receiving trigger point dry needling treatment.',
  },
  {
    image: '/assets/clinical-thumb-1.jpg',
    badge: 'Meta-Analysis',
    title: 'Comparative Outcomes of Manual vs. Instrument-Assisted Therapy',
    description:
      'Systematic review comparing clinical outcomes between traditional manual therapy techniques and modern instrument-assisted soft tissue mobilization.',
  },
];

export default function ClinicalResearchSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollBy = (amount: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section id="stories" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mb-12 flex items-end justify-between">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-[48px] leading-[1.1] tracking-[-0.02em] text-vivavive-dark md:text-[72px]"
          >
            Clinical Research
          </motion.h2>

          <div className="hidden gap-2 md:flex">
            <button
              onClick={() => scrollBy(-400)}
              disabled={!canScrollLeft}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-vivavive-light transition-all duration-300 hover:bg-vivavive-offwhite disabled:opacity-30"
              aria-label="Scroll left"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M13 4L7 10L13 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => scrollBy(400)}
              disabled={!canScrollRight}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-vivavive-light transition-all duration-300 hover:bg-vivavive-offwhite disabled:opacity-30"
              aria-label="Scroll right"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7 4L13 10L7 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-6 pb-4 scrollbar-hide md:px-12"
        style={{ scrollbarWidth: 'none' }}
      >
        {researchItems.map((item, i) => (
          <ResearchCard
            key={i}
            image={item.image}
            badge={item.badge}
            title={item.title}
            description={item.description}
            index={i}
          />
        ))}
        {/* Right spacer */}
        <div className="min-w-[60px] shrink-0" />
      </div>
    </section>
  );
}
