'use client';

import { motion } from 'framer-motion';
import DataOrbit from '@/components/DataOrbit';

const orbitData = [
  {
    metric: '7,000+',
    label: 'Treatment hours per year',
    items: [
      { text: 'Manual Therapy' },
      { text: 'Electrotherapy' },
      { text: 'Exercise Prescription' },
      { text: 'Dry Needling' },
      { text: 'Hydrotherapy' },
      { text: 'Sports Rehab' },
    ],
    color: '#005f6b',
    lightColor: '#ff4d4d',
    speed: 0.3,
  },
  {
    metric: '55',
    label: 'Number of physiotherapists',
    items: [
      { text: 'DPT Certified' },
      { text: 'Sports Specialists' },
      { text: 'Pain Experts' },
      { text: 'Orthopedic' },
      { text: 'Neurological' },
      { text: 'Pediatric' },
    ],
    color: '#005f6b',
    lightColor: '#ff4d4d',
    speed: 0.5,
  },
  {
    metric: '8,700+',
    label: 'Patients served since 2020',
    items: [
      { text: 'Chronic Pain' },
      { text: 'Post-Surgical' },
      { text: 'Sports Injury' },
      { text: 'Neurological' },
      { text: 'Geriatric Care' },
      { text: 'Pre/Post Natal' },
    ],
    color: '#005f6b',
    lightColor: '#ff4d4d',
    speed: 0.4,
  },
];

export default function ImpactDataSection() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-20"
        >
          <h2 className="font-serif text-[48px] leading-[1.1] tracking-[-0.02em] text-vivavive-dark md:text-[72px]">
            Impact{' '}
            <span className="inline-block rounded-full bg-vivavive-red px-4 py-1 text-white">
              data
            </span>
          </h2>
        </motion.div>

        <div className="grid gap-16 md:grid-cols-3 md:gap-8">
          {orbitData.map((data, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="flex flex-col items-center"
            >
              <DataOrbit
                items={data.items}
                color={data.color}
                lightColor={data.lightColor}
                speed={data.speed}
                radius={1.8}
                period={12 + i * 2}
              />
              <div className="mt-6 text-center">
                <p className="font-serif text-5xl tracking-tight text-vivavive-dark md:text-6xl">
                  {data.metric}
                </p>
                <p className="mt-2 font-sans text-sm tracking-tight text-vivavive-muted">
                  {data.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
