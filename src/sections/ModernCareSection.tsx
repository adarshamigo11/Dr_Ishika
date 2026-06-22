'use client';

import { motion } from 'framer-motion';

export default function ModernCareSection() {
  return (
    <section className="relative min-h-[80vh] bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          {/* Left Column - Sticky heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:sticky md:top-[30vh] md:self-start"
          >
            <h2 className="font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-vivavive-dark md:text-[56px] lg:text-[64px]">
              Calm, continuous relief with{' '}
              <span className="text-vivavive-red">VivaVive</span>.
            </h2>
          </motion.div>

          {/* Right Column - Flowing text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="flex flex-col gap-8 pt-4 md:pt-12"
          >
            <p className="font-sans text-lg leading-[1.7] tracking-[-0.01em] text-vivavive-gray md:text-xl">
              We offer expert physiotherapy designed to work seamlessly with your
              daily life. No waiting rooms, no rigid schedules. Just
              personalized care, delivered with precision and empathy.
            </p>
            <p className="font-sans text-lg leading-[1.7] tracking-[-0.01em] text-vivavive-muted md:text-xl">
              Our team of 55+ certified physiotherapists brings together decades
              of clinical experience in sports medicine, orthopedic
              rehabilitation, and chronic pain management. Every treatment plan
              is uniquely crafted around your goals, your schedule, and your
              body's specific needs.
            </p>
            <p className="font-sans text-lg leading-[1.7] tracking-[-0.01em] text-vivavive-muted md:text-xl">
              From your first assessment through every follow-up session, we
              track your progress with evidence-based metrics. You'll always know
              exactly where you are on your recovery journey and what the next
              milestone looks like.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
