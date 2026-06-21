'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react';

const buys = [
  {
    name: "Phone",
    date: "2026-06-01",
    price: 1000.00,
    category: "Electronics"
  },
  {
    name: "Laptop",
    date: "2026-05-15",
    price: 2500.00,
    category: "Electronics"
  },
  {
    name: "Headphones",
    date: "2026-04-20",
    price: 350.00,
    category: "Audio"
  }
]

// Calculate days since purchase and per-day cost
function calculateDailyCost(purchaseDate: string, price: number) {
  const today = new Date();
  const purchase = new Date(purchaseDate);
  const diffTime = Math.abs(today.getTime() - purchase.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))); // Minimum 1 day
  const dailyCost = price / diffDays;

  return {
    days: diffDays,
    dailyCost: dailyCost,
  };
}

// Magnetic card component with micro-interactions
function MagneticBuyCard({ buy, index }: { buy: typeof buys[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  // Calculate daily metrics
  const { days, dailyCost } = calculateDailyCost(buy.date, buy.price);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;

    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="group relative will-change-transform"
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-border bg-surface/60 backdrop-blur-xl p-8 hover:border-accent/50 transition-colors duration-500"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Atmospheric noise overlay */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
        />

        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"
          style={{
            background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--color-accent), transparent 70%)',
          }}
          animate={{
            opacity: isHovered ? 0.15 : 0,
          }}
        />

        {/* Content */}
        <div className="relative" style={{ transform: 'translateZ(20px)' }}>
          {/* Category badge */}
          <motion.span
            className="inline-block px-3 py-1 mb-4 text-xs font-mono tracking-wider uppercase rounded-full border border-accent/30 text-accent bg-accent/5"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.3 }}
          >
            {buy.category}
          </motion.span>

          {/* Item name - extreme scale */}
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight"
            style={{
              textShadow: isHovered ? '0 0 40px rgba(var(--color-accent-rgb), 0.3)' : 'none',
              transition: 'text-shadow 0.5s ease',
            }}
          >
            {buy.name}
          </motion.h2>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-1">
              <p className="text-xs font-mono uppercase tracking-wider text-muted">
                Purchase Date
              </p>
              <p className="text-lg font-semibold text-foreground">
                {new Date(buy.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <p className="text-xs text-muted/70 mt-1">
                {days} {days === 1 ? 'day' : 'days'} ago
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-mono uppercase tracking-wider text-muted">
                Amount
              </p>
              <p className="text-lg font-semibold text-accent">
                ₱ {buy.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Per-day cost display - Premium glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.5, duration: 0.6 }}
            className="relative mt-6 p-4 rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.05), rgba(var(--color-accent-rgb), 0.02))',
            }}
          >
            {/* Frosted glass effect */}
            <div className="absolute inset-0 backdrop-blur-xl bg-surface/40 border border-accent/20"
              style={{ borderRadius: 'inherit' }}
            />

            {/* Content */}
            <div className="relative flex items-baseline justify-between gap-4">
              <div className="space-y-1 flex-1">
                <p className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    ⚡
                  </motion.span>
                  Daily Cost
                </p>
                <div className="flex items-baseline gap-2">
                  <motion.p
                    className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-accent to-accent/60 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    ₱ {dailyCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </motion.p>
                  <span className="text-sm text-muted/70 font-mono">/day</span>
                </div>
                <motion.p
                  className="text-xs text-muted/60 font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0.6 }}
                  transition={{ duration: 0.3 }}
                >
                  Based on {days} {days === 1 ? 'day' : 'days'} of ownership
                </motion.p>
              </div>

              {/* Visual indicator - animated ring */}
              <motion.div
                className="relative w-16 h-16 shrink-0"
                animate={{
                  rotate: isHovered ? 360 : 0,
                }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              >
                {/* Outer ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-border opacity-20"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-accent"
                    initial={{ strokeDasharray: '0 283' }}
                    whileInView={{
                      strokeDasharray: `${Math.min((dailyCost / buy.price) * 283 * 100, 283)} 283`
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: index * 0.15 + 0.7, ease: 'easeOut' }}
                  />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-accent">
                    {((dailyCost / buy.price) * 100).toFixed(1)}%
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(var(--color-accent-rgb), 0.1), transparent)',
              }}
              animate={{
                x: isHovered ? ['0%', '200%'] : '0%',
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Hover state indicator */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-accent to-transparent"
            initial={{ width: 0 }}
            animate={{ width: isHovered ? '100%' : 0 }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BuysPage() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  // Calculate total
  const total = buys.reduce((sum, buy) => sum + buy.price, 0);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Ambient background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-200 h-200 bg-accent opacity-5 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-accent opacity-5 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
      </div>

      {/* Hero Section - Full viewport command */}
      <section ref={heroRef} className="relative min-h-[75vh] flex items-center justify-center px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto w-full">
          {/* Headline with staggered entrance */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <h1 className="text-[clamp(3rem,12vw,10rem)] font-bold leading-[0.9] tracking-tight text-foreground"
                style={{
                  textShadow: '0 0 80px rgba(var(--color-accent-rgb), 0.1)',
                }}
              >
                Purchase
                <br />
                <span className="text-accent">Archive</span>
              </h1>
            </motion.div>

            <motion.p
              className="text-xl sm:text-2xl text-muted max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              A curated collection of acquisitions, meticulously tracked and beautifully presented.
            </motion.p>

            {/* Stats bar */}
            <motion.div
              className="flex flex-wrap gap-8 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="space-y-2">
                <p className="text-sm font-mono uppercase tracking-wider text-muted">
                  Total Items
                </p>
                <p className="text-4xl font-bold text-foreground">
                  {buys.length}
                </p>
              </div>

              <div className="h-16 w-px bg-border" />

              <div className="space-y-2">
                <p className="text-sm font-mono uppercase tracking-wider text-muted">
                  Total Value
                </p>
                <p className="text-4xl font-bold text-accent">
                  ₱ {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Purchases Grid - Scroll-driven reveals */}
      <section className="relative px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            {buys.map((buy, index) => (
              <MagneticBuyCard key={index} buy={buy} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-32" />
    </main>
  );
}
