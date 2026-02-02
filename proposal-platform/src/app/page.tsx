'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PROPOSAL_CONFIGS, ProposalType } from '@/types/proposal';

const FloatingHearts = () => {
  const hearts = ['♥', '♡'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-valentine-200 text-2xl"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: '100vh',
            rotate: 0,
            opacity: 0.4
          }}
          animate={{ 
            y: '-10vh',
            rotate: 360,
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        >
          {hearts[i % hearts.length]}
        </motion.div>
      ))}
    </div>
  );
};

const ProposalTypeCard = ({ 
  config, 
  isSelected, 
  onClick 
}: { 
  config: typeof PROPOSAL_CONFIGS[ProposalType];
  isSelected: boolean;
  onClick: () => void;
}) => {
  const colorClasses: Record<ProposalType, string> = {
    valentine: 'border-valentine-300 bg-valentine-50 hover:border-valentine-400 hover:bg-valentine-100',
    marriage: 'border-marriage-300 bg-marriage-50 hover:border-marriage-400 hover:bg-marriage-100',
    girlfriend: 'border-girlfriend-300 bg-girlfriend-50 hover:border-girlfriend-400 hover:bg-girlfriend-100',
    boyfriend: 'border-boyfriend-300 bg-boyfriend-50 hover:border-boyfriend-400 hover:bg-boyfriend-100',
  };

  const selectedClasses: Record<ProposalType, string> = {
    valentine: 'border-valentine-500 bg-valentine-100 ring-2 ring-valentine-500 ring-offset-2',
    marriage: 'border-marriage-500 bg-marriage-100 ring-2 ring-marriage-500 ring-offset-2',
    girlfriend: 'border-girlfriend-500 bg-girlfriend-100 ring-2 ring-girlfriend-500 ring-offset-2',
    boyfriend: 'border-boyfriend-500 bg-boyfriend-100 ring-2 ring-boyfriend-500 ring-offset-2',
  };

  const descriptions: Record<ProposalType, string> = {
    valentine: 'Romantic and playful',
    marriage: 'Elegant and timeless',
    girlfriend: 'Sweet and heartfelt',
    boyfriend: 'Casual and genuine',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative p-6 rounded-2xl border-2 text-left transition-all duration-300
        ${isSelected ? selectedClasses[config.type] : colorClasses[config.type]}
      `}
    >
      <div className="text-3xl mb-3">{config.emoji}</div>
      <h3 className="font-display text-lg font-semibold text-gray-800 mb-1">
        {config.headline}
      </h3>
      <p className="text-sm text-gray-500">
        {descriptions[config.type]}
      </p>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
        >
          <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<ProposalType | null>(null);

  return (
    <main className="min-h-screen relative">
      <FloatingHearts />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Say It</span>
              <br />
              <span className="text-gray-800">With Love</span>
            </h1>
            
            <p className="font-body text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
              Create a beautiful, personalized proposal page and share it with your special someone.
            </p>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-12"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-600">Free forever · No login required</span>
          </motion.div>
        </div>
      </section>

      {/* Proposal Type Selection */}
      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-display text-2xl text-center text-gray-800 mb-8">
              What would you like to ask?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {(Object.values(PROPOSAL_CONFIGS) as typeof PROPOSAL_CONFIGS[ProposalType][]).map((config) => (
                <ProposalTypeCard
                  key={config.type}
                  config={config}
                  isSelected={selectedType === config.type}
                  onClick={() => setSelectedType(config.type)}
                />
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: selectedType ? 1 : 0.5 }}
              className="text-center"
            >
              <Link
                href={selectedType ? `/create?type=${selectedType}` : '#'}
                onClick={(e) => !selectedType && e.preventDefault()}
              >
                <motion.button
                  whileHover={selectedType ? { scale: 1.03 } : {}}
                  whileTap={selectedType ? { scale: 0.97 } : {}}
                  className={`
                    btn-shine px-10 py-4 rounded-full font-semibold text-lg shadow-lg
                    transition-all duration-300
                    ${selectedType 
                      ? 'bg-gradient-to-r from-valentine-500 to-pink-500 text-white cursor-pointer hover:shadow-xl' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {selectedType ? 'Create Your Proposal' : 'Select a type above'}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 bg-white/60 backdrop-blur-sm py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl text-center text-gray-800 mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '1', title: 'Create', desc: 'Choose your proposal type, add names, and write your heartfelt message' },
              { step: '2', title: 'Share', desc: 'Get a unique link to send via WhatsApp, Instagram, or any messaging app' },
              { step: '3', title: 'Celebrate', desc: 'Watch the magic happen when they open your proposal and respond' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-valentine-100 text-valentine-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-4 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Made with love · Proposals auto-delete after 5 days
        </p>
        <p className="text-xs text-gray-400">
          © 2024 Say It With Love. Free for everyone.
        </p>
      </footer>
    </main>
  );
}
