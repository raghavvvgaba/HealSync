'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const temp = Array.from({ length: 90 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
    }));
    setParticles(temp);
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-start text-center px-6 pt-28 md:pt-32 text-text overflow-hidden">
      {/* Dot background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none" />

      {/* Glowing particles */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute w-[3px] h-[3px] rounded-full bg-accent shadow-[0_0_6px_var(--tw-shadow-color)] shadow-accent z-0 opacity-70"
          style={{ top: p.top, left: p.left }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ y: -20, opacity: [0, 0.8, 0] }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Text Content */}
      <div className="z-10 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
        >
          HealSync
        </motion.h1>

        <motion.p
          variants={textVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-lg md:text-xl text-text/90 leading-relaxed mb-8"
        >
          HealSync brings your entire health story together. A modern medical records platform that lets you and your doctor stay in sync—securely, effortlessly, and always up to date.
        </motion.p>

        <motion.a
          variants={textVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          href="#signup"
          className="inline-block px-6 py-3 rounded-full bg-primary text-background font-semibold hover:bg-secondary transition"
        >
          Get Started
        </motion.a>
      </div>

      {/* Scroll Arrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: [10, 20, 10] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'easeInOut',
        }}
        className="absolute bottom-10 z-10 text-accent"
      >
        <a href="features">
          <svg
            className="w-6 h-6 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
