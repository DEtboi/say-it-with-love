'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROPOSAL_CONFIGS, ProposalType, Proposal } from '@/types/proposal';
import { getProposal, isProposalExpired, recordResponse } from '@/lib/proposals';

// Stunning confetti explosion
const Confetti = () => {
  const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#fda4af', '#a855f7', '#c084fc', '#fbbf24', '#f59e0b'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(120)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: '50vh',
            x: '50vw',
            scale: 0,
            rotate: 0,
            opacity: 1,
          }}
          animate={{ 
            y: Math.random() > 0.5 ? '-100vh' : '100vh',
            x: `${Math.random() * 100}vw`,
            scale: [0, 1, 1, 0.5],
            rotate: Math.random() * 1080,
            opacity: [1, 1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            position: 'fixed',
            width: `${8 + Math.random() * 12}px`,
            height: `${8 + Math.random() * 12}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '3px',
          }}
        />
      ))}
    </div>
  );
};

// Animated romantic background
const RomanticBackground = ({ type }: { type: ProposalType }) => {
  const gradients: Record<ProposalType, string[]> = {
    valentine: ['rgba(251,113,133,0.4)', 'rgba(244,63,94,0.3)', 'rgba(236,72,153,0.3)'],
    marriage: ['rgba(251,191,36,0.4)', 'rgba(245,158,11,0.3)', 'rgba(217,119,6,0.2)'],
    girlfriend: ['rgba(217,70,239,0.4)', 'rgba(168,85,247,0.3)', 'rgba(236,72,153,0.3)'],
    boyfriend: ['rgba(45,212,191,0.4)', 'rgba(20,184,166,0.3)', 'rgba(6,182,212,0.3)'],
  };

  const bgBase: Record<ProposalType, string> = {
    valentine: '#fdf2f8',
    marriage: '#fffbeb',
    girlfriend: '#fdf4ff',
    boyfriend: '#f0fdfa',
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: bgBase[type] }} />
      
      {/* Animated orbs */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${gradients[type][i]} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          initial={{
            x: i === 0 ? '-20%' : i === 1 ? '60%' : '30%',
            y: i === 0 ? '-20%' : i === 1 ? '10%' : '60%',
          }}
          animate={{
            x: i === 0 ? ['-20%', '-10%', '-20%'] : i === 1 ? ['60%', '70%', '60%'] : ['30%', '20%', '30%'],
            y: i === 0 ? ['-20%', '-10%', '-20%'] : i === 1 ? ['10%', '20%', '10%'] : ['60%', '50%', '60%'],
          }}
          transition={{ duration: 15 + i * 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: gradients[type][0].replace('0.4', '0.6'),
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

// Success celebration screen
const SuccessScreen = ({ config, proposerName, type }: { 
  config: typeof PROPOSAL_CONFIGS[ProposalType]; 
  proposerName: string;
  type: ProposalType;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="text-center px-4"
    >
      <Confetti />
      
      {/* Animated heart/ring */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-8xl mb-8"
      >
        {type === 'marriage' ? '💍' : '❤️'}
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-display text-5xl md:text-6xl font-bold text-gray-900 mb-4"
      >
        {config.successTitle}
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-gray-600 mb-10 max-w-md mx-auto"
      >
        {config.successMessage}
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-gray-500 mb-2">
          <span className="font-display text-3xl gradient-text font-bold">{proposerName}</span>
        </p>
        <p className="text-gray-400">is overjoyed right now</p>
      </motion.div>
    </motion.div>
  );
};

// Playful escaping No button
const PlayfulNoButton = ({ onClick, text, playful }: { onClick: () => void; text: string; playful: boolean }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);

  const handleMouseEnter = useCallback(() => {
    if (!playful || escapeCount >= 3) return;
    const newX = (Math.random() - 0.5) * 120;
    const newY = (Math.random() - 0.5) * 60;
    setPosition({ x: newX, y: newY });
    setEscapeCount(prev => prev + 1);
  }, [playful, escapeCount]);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleMouseEnter}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      whileTap={{ scale: 0.95 }}
      className="px-8 py-4 bg-gray-100 text-gray-500 rounded-full font-semibold hover:bg-gray-200 transition-colors"
    >
      {escapeCount >= 3 ? 'Okay fine...' : text}
    </motion.button>
  );
};

// Loading screen
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full"
    />
  </div>
);

// Error screens
const NotFoundScreen = () => (
  <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">🔍</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-4">Proposal not found</h1>
      <p className="text-gray-500 mb-8">This proposal doesn&apos;t exist or has been deleted.</p>
      <a href="/" className="inline-block px-8 py-4 bg-rose-500 text-white rounded-full font-semibold hover:bg-rose-600 transition">
        Create a new one
      </a>
    </motion.div>
  </main>
);

const ExpiredScreen = () => (
  <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">⏰</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-4">This proposal has expired</h1>
      <p className="text-gray-500 mb-8">Proposals are available for 5 days to keep the platform free.</p>
      <a href="/" className="inline-block px-8 py-4 bg-rose-500 text-white rounded-full font-semibold hover:bg-rose-600 transition">
        Create a new one
      </a>
    </motion.div>
  </main>
);

export default function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [response, setResponse] = useState<'yes' | 'no' | null>(null);
  const [showConfirmNo, setShowConfirmNo] = useState(false);

  useEffect(() => {
    async function fetchProposal() {
      try {
        const data = await getProposal(id);
        if (data) {
          setProposal(data);
          if (data.response) {
            setResponse(data.response);
            setRevealed(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching proposal:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProposal();
  }, [id]);

  const handleResponse = async (resp: 'yes' | 'no') => {
    try {
      await recordResponse(id, resp);
      setResponse(resp);
    } catch (err) {
      console.error('Error recording response:', err);
      setResponse(resp);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error || !proposal) return <NotFoundScreen />;
  if (isProposalExpired(proposal)) return <ExpiredScreen />;

  const config = PROPOSAL_CONFIGS[proposal.type];
  
  const gradients: Record<ProposalType, string> = {
    valentine: 'from-rose-500 via-pink-500 to-rose-400',
    marriage: 'from-amber-500 via-yellow-500 to-orange-400',
    girlfriend: 'from-fuchsia-500 via-purple-500 to-pink-500',
    boyfriend: 'from-teal-500 via-cyan-500 to-blue-500',
  };

  // Response given
  if (response) {
    if (response === 'yes') {
      return (
        <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
          <RomanticBackground type={proposal.type} />
          <div className="relative z-10">
            <SuccessScreen config={config} proposerName={proposal.proposerName} type={proposal.type} />
          </div>
        </main>
      );
    }
    
    // No response
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">💙</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-800 mb-4">Thank you for being honest</h1>
          <p className="text-gray-500">
            {proposal.proposerName} will understand. Whatever happens, we hope you both find happiness.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <RomanticBackground type={proposal.type} />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {!revealed ? (
            // ENVELOPE REVEAL SCREEN
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Floating envelope */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-10"
              >
                <motion.div 
                  className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto relative overflow-hidden"
                  whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                >
                  {/* Envelope shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  />
                  <span className="text-6xl relative z-10">💌</span>
                </motion.div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              >
                Hey {proposal.recipientName}!
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-600 mb-10"
              >
                You have a special message from{' '}
                <span className="font-bold gradient-text">{proposal.proposerName}</span>
              </motion.p>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRevealed(true)}
                className={`
                  relative px-12 py-5 rounded-full font-bold text-lg text-white shadow-2xl overflow-hidden
                  bg-gradient-to-r ${gradients[proposal.type]}
                `}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Open Message
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
              </motion.button>
            </motion.div>
          ) : (
            // MESSAGE REVEAL SCREEN
            <motion.div
              key="proposal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 80 }}
              className="max-w-lg w-full"
            >
              {/* Message Card */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="bg-white/95 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-2xl mb-10 relative overflow-hidden"
              >
                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradients[proposal.type]} opacity-10 rounded-bl-full`} />
                
                <div className="relative z-10">
                  <p className="font-handwriting text-2xl text-gray-400 text-center mb-6">
                    Dear {proposal.recipientName},
                  </p>
                  
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line mb-8">
                    {proposal.message}
                  </p>
                  
                  <div className="text-right">
                    <p className="font-handwriting text-lg text-gray-400 mb-1">With love,</p>
                    <p className="font-handwriting text-3xl gradient-text font-bold">{proposal.proposerName}</p>
                  </div>
                </div>
              </motion.div>

              {/* The Question */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-6xl mb-6"
                >
                  {config.emoji}
                </motion.div>
                
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-10">
                  {config.headline}
                </h2>

                {!showConfirmNo ? (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleResponse('yes')}
                      className={`
                        relative px-12 py-5 rounded-full font-bold text-lg text-white shadow-2xl overflow-hidden
                        bg-gradient-to-r ${gradients[proposal.type]} animate-pulse-glow
                      `}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="relative z-10">{config.buttonYes}</span>
                    </motion.button>
                    
                    <PlayfulNoButton
                      onClick={() => setShowConfirmNo(true)}
                      text={config.buttonNo}
                      playful={config.animation === 'playful' || config.animation === 'cute'}
                    />
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-sm mx-auto shadow-xl"
                  >
                    <p className="text-gray-700 mb-6">Are you sure about this?</p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setShowConfirmNo(false)}
                        className={`px-6 py-3 bg-gradient-to-r ${gradients[proposal.type]} text-white rounded-full font-semibold`}
                      >
                        Wait, go back
                      </button>
                      <button
                        onClick={() => handleResponse('no')}
                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-full font-semibold hover:bg-gray-200 transition"
                      >
                        Yes, I&apos;m sure
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
