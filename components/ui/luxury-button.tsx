// components/ui/luxury-button.tsx
'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LuxuryButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'coastal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  shimmer?: boolean;
  ripple?: boolean;
  href?: string;
  asChild?: boolean;
}

const buttonVariants = {
  primary: 'bg-gradient-to-r from-brand-magenta to-brand-turquoise text-white hover:shadow-lg',
  secondary: 'bg-brand-turquoise text-white hover:bg-brand-turquoise-dark',
  outline: 'border-2 border-brand-magenta text-brand-magenta hover:bg-brand-magenta hover:text-white',
  ghost: 'text-brand-magenta hover:bg-brand-magenta/10',
  coastal: 'bg-gradient-to-r from-brand-turquoise to-brand-gold text-white hover:shadow-xl',
};

const sizeVariants = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
};

export function LuxuryButton({
  children,
  variant = 'primary',
  size = 'md',
  glow = false,
  shimmer = false,
  ripple = true,
  className,
  href,
  asChild,
  ...props
}: LuxuryButtonProps) {
  // Moved here so it's NOT inside JSX
  const MotionComponent: any = href ? motion.a : motion.button;

  const baseClasses = cn(
    'relative overflow-hidden rounded-lg font-semibold transition-all duration-300 transform',
    'focus:outline-none focus:ring-2 focus:ring-brand-magenta focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95',
    buttonVariants[variant],
    sizeVariants[size],
    {
      'glow-magenta': glow && variant === 'primary',
      'glow-turquoise': glow && variant === 'secondary',
      'shimmer': shimmer,
    },
    className
  );

  const buttonVariantsMotion = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      y: -2,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    tap: {
      scale: 0.95,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const rippleElement = document.createElement('span');
      rippleElement.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      button.appendChild(rippleElement);

      setTimeout(() => {
        rippleElement.remove();
      }, 600);
    }

    if (props.onClick) props.onClick(e as any);
  };

  const content = (
    <>
      {shimmer && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {variant === 'coastal' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-wave" />
      )}
    </>
  );

  if (href && !asChild) {
    return (
      <MotionComponent
        href={href}
        className={baseClasses}
        variants={buttonVariantsMotion}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        {...(props as any)}
      >
        {content}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      className={baseClasses}
      variants={buttonVariantsMotion}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
      {...props}
    >
      {content}
    </MotionComponent>
  );
}

// ripple keyframes (global injection safeguard)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { transform: scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
