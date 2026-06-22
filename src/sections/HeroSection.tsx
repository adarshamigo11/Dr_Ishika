'use client';

import { motion } from 'framer-motion';
import FluidBloom from '@/components/FluidBloom';

export default function HeroSection() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-vivavive-teal">
      <FluidBloom />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-serif text-[56px] leading-[1.05] tracking-[-0.02em] text-vivavive-red md:text-[96px] lg:text-[120px]"
        >
          Holistic
          <br />
          <span className="text-vivavive-red">Movement</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.0,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mt-8 max-w-lg font-sans text-lg leading-relaxed text-vivavive-red md:text-2xl"
        >
          Expert physiotherapy tailored to your body's natural rhythm.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.0,
            delay: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#book"
            className="rounded-full bg-white px-12 py-4 font-sans text-sm font-medium tracking-tight text-black transition-all duration-300 hover:scale-[1.02] hover:bg-[#f5f5f5]"
          >
            Book a Session
          </a>
          <a
            href="#team"
            className="rounded-full border border-white bg-transparent px-12 py-4 font-sans text-sm font-medium tracking-tight text-white transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
          >
            Meet the Team
          </a>
        </motion.div>
      </div>
    </section>
  );
}
