'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PROPOSAL_CONFIGS, ProposalType } from '@/types/proposal';

// Animated mesh gradient background with particles
const PremiumBackground = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#fdf2f8]" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251,113,133,0.4) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '-20%',
          left: '-10%',
        }}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '30%',
          right: '-10%',
        }}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, 80, 40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(244,63,94,0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
          bottom: '-20%',
          left: '20%',
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Floating particles */}
      {mounted && [...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: `rgba(244, 63, 94, ${Math.random() * 0.5 + 0.2})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Grid overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(244,63,94,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(244,63,94,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
};

// Premium proposal type card
const ProposalCard = ({ 
  config, 
  isSelected, 
  onClick,
  index
}: { 
  config: typeof PROPOSAL_CONFIGS[ProposalType];
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) => {
  const gradients: Record<ProposalType, string> = {
    valentine: 'from-rose-500 via-pink-500 to-red-400',
    marriage: 'from-amber-500 via-yellow-400 to-orange-400',
    girlfriend: 'from-fuchsia-500 via-purple-500 to-pink-400',
    boyfriend: 'from-teal-500 via-cyan-400 to-blue-400',
  };

  const glows: Record<ProposalType, string> = {
    valentine: 'shadow-rose-500/30',
    marriage: 'shadow-amber-500/30',
    girlfriend: 'shadow-fuchsia-500/30',
    boyfriend: 'shadow-teal-500/30',
  };

  const descriptions: Record<ProposalType, string> = {
    valentine: 'Express your love with a romantic Valentine\'s proposal',
    marriage: 'Pop the most important question of your life',
    girlfriend: 'Ask her to be yours with sweetness and charm',
    boyfriend: 'Tell him how you feel with confidence',
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: 0.1 * index, 
        duration: 0.6,
        type: 'spring',
        stiffness: 100
      }}
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative p-1 rounded-[28px] text-left transition-all duration-500
        ${isSelected 
          ? `bg-gradient-to-br ${gradients[config.type]} shadow-2xl ${glows[config.type]}` 
          : 'bg-gradient-to-br from-white/80 to-white/60 hover:from-white hover:to-white/90 shadow-xl hover:shadow-2xl'
        }
      `}
    >
      <div className={`
        relative h-full p-6 rounded-[24px] transition-all duration-300
        ${isSelected 
          ? 'bg-white/95' 
          : 'bg-transparent'
        }
      `}>
        {/* Icon container with gradient */}
        <div className="flex items-start justify-between mb-5">
          <motion.div 
            className={`
              w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
              ${isSelected 
                ? `bg-gradient-to-br ${gradients[config.type]} shadow-lg` 
                : 'bg-gradient-to-br from-rose-100 to-pink-50'
              }
            `}
            animate={isSelected ? { 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className={isSelected ? 'grayscale-0' : 'grayscale-[30%]'}>
              {config.emoji}
            </span>
          </motion.div>
          
          {/* Selection checkmark */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradients[config.type]} flex items-center justify-center shadow-lg`}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Text content */}
        <h3 className={`
          font-display text-xl font-bold mb-2 transition-colors
          ${isSelected ? 'text-gray-900' : 'text-gray-800'}
        `}>
          {config.headline}
        </h3>
        
        <p className={`
          text-sm leading-relaxed transition-colors
          ${isSelected ? 'text-gray-600' : 'text-gray-500'}
        `}>
          {descriptions[config.type]}
        </p>
        
        {/* Animated underline */}
        <motion.div 
          className={`h-1 rounded-full mt-5 bg-gradient-to-r ${gradients[config.type]}`}
          initial={{ width: '0%', opacity: 0 }}
          animate={{ 
            width: isSelected ? '100%' : '0%',
            opacity: isSelected ? 1 : 0
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        
        {/* Hover shimmer effect */}
        <div className="absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
            animate={{ x: isSelected ? ['0%', '200%'] : '0%' }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>
    </motion.button>
  );
};

// Animated stat counter
const StatCounter = ({ value, label, delay }: { value: string; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <motion.div 
      className="font-display text-5xl md:text-6xl font-bold gradient-text mb-2"
      whileInView={{ scale: [0.5, 1.1, 1] }}
      transition={{ delay: delay + 0.2, duration: 0.5 }}
      viewport={{ once: true }}
    >
      {value}
    </motion.div>
    <div className="text-gray-500 text-sm font-medium tracking-wider uppercase">{label}</div>
  </motion.div>
);

// Feature card
const FeatureCard = ({ icon, title, description, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay: number 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="group relative"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 h-full">
      <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<ProposalType | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen relative">
      <PremiumBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-8 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-10"
          >
            <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-full shadow-xl border border-white/50">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-gray-700">Free Forever</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-sm text-gray-500">No Sign-up Required</span>
            </div>
          </motion.div>
          
          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6">
              <span className="gradient-text text-shadow-romantic">Say It</span>
              <br />
              <span className="text-gray-900">With Love</span>
            </h1>
          </motion.div>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center text-xl md:text-2xl text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed"
          >
            Create stunning, personalized proposals that make hearts flutter. 
            Share your feelings in the most beautiful way.
          </motion.p>

          {/* Floating decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-6 mb-16"
          >
            {['✦', '♥', '✦'].map((char, i) => (
              <motion.span
                key={i}
                className={`text-2xl ${i === 1 ? 'text-rose-400' : 'text-rose-300'}`}
                animate={{ 
                  y: [0, -12, 0],
                  rotate: i === 1 ? [0, 0, 0] : [0, 180, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Proposal Types Grid */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl text-center text-gray-900 mb-4"
          >
            Choose Your Moment
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 mb-12"
          >
            Select the perfect proposal type for your special occasion
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
            {(Object.values(PROPOSAL_CONFIGS) as typeof PROPOSAL_CONFIGS[ProposalType][]).map((config, index) => (
              <ProposalCard
                key={config.type}
                config={config}
                isSelected={selectedType === config.type}
                onClick={() => setSelectedType(config.type)}
                index={index}
              />
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <Link
              href={selectedType ? `/create?type=${selectedType}` : '#'}
              onClick={(e) => !selectedType && e.preventDefault()}
            >
              <motion.button
                whileHover={selectedType ? { scale: 1.03, y: -2 } : {}}
                whileTap={selectedType ? { scale: 0.97 } : {}}
                className={`
                  relative px-12 py-5 rounded-full font-bold text-lg
                  transition-all duration-500 overflow-hidden
                  ${selectedType 
                    ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white shadow-2xl shadow-rose-500/30 animate-pulse-glow cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {/* Shine effect */}
                {selectedType && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                )}
                <span className="relative flex items-center gap-3">
                  {selectedType ? (
                    <>
                      Create Your Proposal
                      <motion.svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </motion.svg>
                    </>
                  ) : (
                    'Select a proposal type above'
                  )}
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glow behind */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-rose-500/20 rounded-[40px] blur-3xl" />
            
            <div className="relative bg-white/70 backdrop-blur-2xl rounded-[40px] p-12 md:p-16 shadow-2xl border border-white/50">
              <div className="grid grid-cols-3 gap-8 md:gap-12">
                <StatCounter value="10K+" label="Proposals Sent" delay={0} />
                <StatCounter value="89%" label="Said Yes" delay={0.15} />
                <StatCounter value="100%" label="Free Forever" delay={0.3} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Three Simple Steps
            </h2>
            <p className="text-gray-500 text-lg">to make someone&apos;s heart skip a beat</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
              title="Create"
              description="Write your heartfelt message and customize your proposal with beautiful templates"
              delay={0}
            />
            <FeatureCard
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              }
              title="Share"
              description="Send your unique link via WhatsApp, Instagram, text, or any way you prefer"
              delay={0.15}
            />
            <FeatureCard
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
              title="Celebrate"
              description="Watch the magic unfold when they open your proposal and say yes"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span className="font-display text-3xl font-bold gradient-text">Say It With Love</span>
          </motion.div>
          <p className="text-gray-500 mb-2">
            Made with ♥ for lovers everywhere
          </p>
          <p className="text-gray-400 text-sm">
            Proposals auto-delete after 5 days · Free forever
          </p>
        </div>
      </footer>
    </main>
  );
}
