'use client';

import { cn } from '@/lib/utils';

interface PillButtonProps {
  children: React.ReactNode;
  variant?: 'solid' | 'ghost' | 'outline';
  color?: 'black' | 'white' | 'red';
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function PillButton({
  children,
  variant = 'solid',
  color = 'black',
  className,
  onClick,
  href,
}: PillButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium tracking-tight transition-all duration-300 ease-out hover:scale-[1.02]';

  const variantStyles = {
    solid: {
      black: 'bg-black text-white hover:bg-[#222222]',
      white: 'bg-white text-black hover:bg-[#f5f5f5]',
      red: 'bg-vivavive-red text-white hover:bg-[#e04040]',
    },
    ghost: {
      black: 'bg-transparent text-black hover:bg-black/5',
      white: 'bg-transparent text-white hover:bg-white/10',
      red: 'bg-transparent text-vivavive-red hover:bg-vivavive-red/5',
    },
    outline: {
      black: 'bg-transparent text-black border border-black hover:bg-black/5',
      white: 'bg-transparent text-white border border-white hover:bg-white/10',
      red: 'bg-transparent text-vivavive-red border border-vivavive-red hover:bg-vivavive-red/5',
    },
  };

  const styles = cn(baseStyles, variantStyles[variant][color], className);

  if (href) {
    return (
      <a href={href} className={styles} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button className={styles} onClick={onClick}>
      {children}
    </button>
  );
}
