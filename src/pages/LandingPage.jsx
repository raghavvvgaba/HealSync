import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import {
  FaShieldAlt,
  FaShareAlt,
  FaUserMd,
  FaLock,
  FaRocket,
  FaHeart,
  FaHistory,
  FaChevronDown,
  FaQuoteLeft,
  FaCheckCircle,
} from "react-icons/fa";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/authContext";

// --- DATA ---
const features = [
  {
    id: "profiles",
    title: "Comprehensive Profiles",
    desc: "Centralize your medical history, lifestyle data, and emergency contacts in one secure place.",
    icon: <FaUserMd className="text-2xl text-blue-500" />,
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    id: "sharing",
    title: "Instant Sharing",
    desc: "Share your profile securely with doctors using a unique ID.",
    icon: <FaShareAlt className="text-2xl text-purple-500" />,
    colSpan: "col-span-1",
  },
  {
    id: "ai",
    title: "AI Health Assistant",
    desc: "Get instant answers to general health questions powered by Gemini AI.",
    icon: <FaRocket className="text-2xl text-amber-500" />,
    colSpan: "col-span-1",
  },
  {
    id: "timeline",
    title: "Structured Medical Timeline",
    desc: "Track diagnoses, symptoms, medicines, tests, and follow-up notes in one chronological history.",
    icon: <FaHistory className="text-2xl text-emerald-500" />,
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    id: "record-edit-window",
    title: "Doctor-Created Record Controls",
    desc: "Doctors can add records, and updates are restricted to the record creator within a 30-minute edit window. This ensures data integrity and professional accountability.",
    icon: <FaLock className="text-2xl text-cyan-500" />,
    colSpan: "col-span-1 md:col-span-3",
  },
];

const journeySteps = [
  { title: "Create Account", desc: "Sign up in seconds.", icon: <FaRocket /> },
  { title: "Build Profile", desc: "Add your history.", icon: <FaUserMd /> },
  { title: "Share Access", desc: "Use your Doctor ID.", icon: <FaShareAlt /> },
  { title: "Get Care", desc: "Doctors view & update.", icon: <FaHeart /> },
];

const faqList = [
  { question: "Is my data secure?", answer: "Yes. We enforce role-based access and Firebase security rules so only authorized doctors can view your shared data." },
  { question: "Is it free?", answer: "Yes, HealSync is currently free for all patients and individual practitioners." },
  { question: "How does sharing work?", answer: "You generate a unique Doctor ID or use your doctor's ID to grant temporary or permanent access to your profile." },
  { question: "Can I revoke access?", answer: "Absolutely. You have full control and can revoke doctor access at any time from your dashboard." },
];

// --- COMPONENTS ---

const BackgroundGrid = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />
      {/* Animated Gradient Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.2, 0.3], 
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.1, 0.2],
          x: [0, -30, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen" 
      />
    </div>
  );
};

const TextShimmer = ({ children }) => {
  return (
    <span className="relative inline-block overflow-hidden text-primary group">
      <span className="relative z-10">{children}</span>
      <motion.span
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
        className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
      />
    </span>
  );
};

const HeroMockup = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -50]);
  const rotateX = useTransform(scrollY, [0, 500], [10, 0]);
  
  return (
    <motion.div 
      style={{ y, rotateX, perspective: 1000 }}
      className="relative w-full max-w-4xl mx-auto mt-12 sm:mt-16 px-4"
    >
      <div className="relative rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/10] group">
        {/* Scanning Line Effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
        />

        {/* Mockup Header */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-white/10 border-b border-white/10 flex items-center px-4 gap-2 z-10">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <div className="mx-auto w-1/3 h-2 rounded-full bg-white/10" />
        </div>
        
        {/* Mockup Body */}
        <div className="absolute top-12 bottom-0 left-0 w-48 border-r border-white/10 bg-white/5 hidden sm:block p-4 space-y-3">
          <div className="w-full h-8 rounded-lg bg-white/10 animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="w-3/4 h-4 rounded-md bg-white/10" />
          <div className="w-3/4 h-4 rounded-md bg-white/10" />
          <div className="w-3/4 h-4 rounded-md bg-white/10" />
        </div>
        
        <div className="absolute top-12 bottom-0 left-0 sm:left-48 right-0 p-6 sm:p-8 bg-black/20">
          <div className="w-1/3 h-8 rounded-lg bg-blue-500/20 mb-6" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors duration-500">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 mb-3" />
              <div className="w-1/2 h-4 rounded bg-white/10 mb-2" />
              <div className="w-full h-2 rounded bg-white/10" />
            </div>
            <div className="h-32 rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors duration-500">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 mb-3" />
              <div className="w-1/2 h-4 rounded bg-white/10 mb-2" />
              <div className="w-full h-2 rounded bg-white/10" />
            </div>
            <div className="col-span-2 h-24 rounded-xl bg-white/5 border border-white/10 p-4 flex items-center gap-4 hover:bg-white/10 transition-colors duration-500">
               <div className="w-12 h-12 rounded-full bg-white/10 shrink-0" />
               <div className="flex-1 space-y-2">
                 <div className="w-3/4 h-4 rounded bg-white/10" />
                 <div className="w-1/2 h-3 rounded bg-white/10" />
               </div>
            </div>
          </div>
        </div>
        
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
      </div>
    </motion.div>
  );
};

const BentoCard = ({ feature }) => {
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className={`${feature.colSpan} relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 min-h-[200px]`}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 40%)`
          ),
        }}
      />
      
      <div className="relative p-8 h-full flex flex-col justify-between">
        <div>
          <div className="mb-4 p-3 w-fit rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
          <p className="text-secondary text-sm leading-relaxed max-w-[280px] md:max-w-none">{feature.desc}</p>
        </div>
        
        {/* Subtle Bottom Indicator */}
        <div className="mt-6 w-12 h-1 rounded-full bg-white/5 group-hover:bg-primary/30 transition-colors" />
      </div>
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate(userRole === "doctor" ? "/doctor" : "/user");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text selection:bg-primary/20 relative">
      <BackgroundGrid />
      <div className="relative z-10">
        <Navbar />
        
        {/* --- HERO SECTION --- */}
        <section className="relative pt-4 pb-20 overflow-hidden">
          
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6 backdrop-blur-sm">
              Reimagining Healthcare Data
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Your Health, <br />
              <TextShimmer>Synchronized.</TextShimmer>
            </h1>
            <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              The secure, AI-powered bridge between patients and doctors. Manage your medical history with controlled access and share it instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="glass-cta px-8 py-4 text-base font-semibold rounded-xl w-full sm:w-auto hover:scale-105 transition-transform"
              >
                {user ? "Go to Dashboard" : "Start for Free"}
              </button>
              <button 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 text-base font-medium rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                Learn more
              </button>
            </div>
          </motion.div>
          
          <HeroMockup />
        </div>
      </section>

      {/* --- FEATURES (BENTO GRID) --- */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need.</h2>
            <p className="text-secondary max-w-xl">Powerful tools to manage your health journey, designed for simplicity and security.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-flow-row-dense">
            {features.map((feature) => (
              <BentoCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* --- JOURNEY --- */}
      <section className="py-24 px-6 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-secondary">Four simple steps to take control of your health data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            
            {journeySteps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl text-text mb-6 z-10 backdrop-blur-md shadow-xl">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-secondary">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto relative rounded-[2.5rem] overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-50" />
          <div className="relative glass-elevated border soft-divider p-12 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to synchronize?</h2>
            <p className="text-lg text-secondary mb-10 max-w-xl mx-auto">
              Join thousands of patients and doctors who trust HealSync for secure medical record management.
            </p>
            <button
              onClick={handleGetStarted}
              className="glass-cta px-10 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:scale-105 transition-transform"
            >
              Get Started Now
            </button>
            <p className="mt-6 text-xs text-secondary/60">No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Questions?</h2>
          <div className="space-y-4">
            {faqList.map((faq, i) => (
              <div key={i} className="group rounded-2xl border soft-divider bg-white/5 overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-medium text-lg">{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <FaChevronDown className="text-secondary" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-secondary leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
