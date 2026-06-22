'use client';

import { motion } from 'framer-motion';
import MorphingWave from '@/components/MorphingWave';

export default function TreatmentSpectrumSection() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 pt-16 text-center font-serif text-[48px] leading-[1.1] tracking-[-0.02em] text-vivavive-dark md:text-[72px]"
        >
          The VivaVive spectrum
        </motion.h2>
      </div>

      <MorphingWave />

      <div className="pointer-events-none absolute bottom-16 left-0 right-0 flex justify-between px-8 md:px-16">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-sans text-2xl font-bold tracking-tight text-vivavive-dark md:text-[48px]"
        >
          Proactive Movement
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-sans text-2xl font-bold tracking-tight text-vivavive-red md:text-[48px]"
        >
          Acute Recovery
        </motion.span>
      </div>
    </section>
  );
}
