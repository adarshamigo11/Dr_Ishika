'use client';

import { motion } from 'framer-motion';

interface ResearchCardProps {
  image: string;
  badge: string;
  title: string;
  description: string;
  index: number;
}

export default function ResearchCard({
  image,
  badge,
  title,
  description,
  index,
}: ResearchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group min-w-[340px] max-w-[380px] cursor-pointer md:min-w-[380px]"
    >
      <div className="relative mb-5 overflow-hidden rounded-[10px] bg-vivavive-offwhite">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-vivavive-gray px-3 py-1.5 font-sans text-xs font-medium text-white">
            {badge}
          </span>
        </div>
      </div>
      <h3 className="mb-2 font-serif text-2xl tracking-tight text-vivavive-dark transition-colors duration-300 group-hover:text-vivavive-red">
        {title}
      </h3>
      <p className="font-sans text-base leading-relaxed text-vivavive-muted">
        {description}
      </p>
    </motion.div>
  );
}
