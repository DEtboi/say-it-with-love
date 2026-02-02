'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROPOSAL_CONFIGS, ProposalType, Proposal } from '@/types/proposal';
import { getProposal, isProposalExpired, recordResponse } from '@/lib/proposals';

// Confetti component - elegant falling pieces
const Confetti = () => {
  const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#fecdd3', '#c084fc', '#fb7185'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: -20,
            rotate: 0,
            opacity: 1,
          }}
          animate={{ 
            y: '100vh',
            rotate: Math.random() * 720,
            opacity: 0,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            ease: 'easeOut',
          }}
          style={{
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
};

// Floating elements background - subtle and romantic
const FloatingBackground = ({ type }: { type: ProposalType }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-64 h-64 rounded-full opacity-20"
          style={{
            background: type === 'marriage' 
              ? 'radial-gradient(circle, #d4a574 0%, transparent 70%)'
              : type === 'boyfriend'
              ? 'radial-gradient(circle, #14b8a6 0%, transparent 70%)'
              : type === 'girlfriend'
              ? 'radial-gradient(circle, #d946ef 0%, transparent 70%)'
              : 'radial-gradient(circle, #f43f5e 0%, transparent 70%)',
          }}
          initial={{ 
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: 0.5 + Math.random() * 0.5,
          }}
          animate={{ 
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Success Screen
const SuccessScreen = ({ config, proposerName, recipientName }: { 
  config: typeof PROPOSAL_CONFIGS[ProposalType]; 
  proposerName: string;
  recipientName: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center px-4"
    >
      <Confetti />
      
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-7xl mb-8"
      >
        {config.type === 'marriage' ? '💍' : '♥'}
      </motion.div>
      
      <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        {config.successTitle}
      </h1>
      
      <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
        {config.successMessage}
      </p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-gray-500"
      >
        <p className="text-lg mb-2">
          <span className="font-handwriting text-3xl gradient-text">{proposerName}</span>
        </p>
        <p>is overjoyed right now</p>
      </motion.div>
    </motion.div>
  );
};

// Playful No Button
const PlayfulNoButton = ({ 
  onClick, 
  text, 
  playful 
}: { 
  onClick: () => void; 
  text: string; 
  playful: boolean;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);

  const handleMouseEnter = useCallback(() => {
    if (!playful || escapeCount >= 3) return;
    
    const maxX = 80;
    const maxY = 40;
    const newX = (Math.random() - 0.5) * maxX;
    const newY = (Math.random() - 0.5) * maxY;
    
    setPosition({ x: newX, y: newY });
    setEscapeCount(prev => prev + 1);
  }, [playful, escapeCount]);

  const buttonText = escapeCount >= 3 ? 'Okay fine...' : text;

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="px-8 py-4 bg-gray-100 text-gray-500 rounded-full font-medium hover:bg-gray-200 transition"
    >
      {buttonText}
    </motion.button>
  );
};

// Loading Screen
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50">
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-16 h-16 rounded-full bg-valentine-200"
    />
  </div>
);

// Expired Screen
const ExpiredScreen = () => (
  <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">♡</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-4">
        This proposal has expired
      </h1>
      <p className="text-gray-600 mb-8">
        Proposals are available for 5 days to keep the platform free for everyone.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-valentine-500 text-white rounded-full font-medium hover:bg-valentine-600 transition"
      >
        Create a new one
      </a>
    </div>
  </main>
);

// Not Found Screen
const NotFoundScreen = () => (
  <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl">?</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-4">
        Proposal not found
      </h1>
      <p className="text-gray-600 mb-8">
        This proposal doesn&apos;t exist or may have been deleted.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-valentine-500 text-white rounded-full font-medium hover:bg-valentine-600 transition"
      >
        Create a new one
      </a>
    </div>
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
  
  const bgClasses: Record<ProposalType, string> = {
    valentine: 'from-rose-50 via-pink-50 to-rose-100',
    marriage: 'from-amber-50 via-yellow-50 to-orange-50',
    girlfriend: 'from-fuchsia-50 via-pink-50 to-purple-50',
    boyfriend: 'from-teal-50 via-cyan-50 to-blue-50',
  };

  // Response given
  if (response) {
    if (response === 'yes') {
      return (
        <main className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${bgClasses[proposal.type]} p-4`}>
          <FloatingBackground type={proposal.type} />
          <SuccessScreen config={config} proposerName={proposal.proposerName} recipientName={proposal.recipientName} />
        </main>
      );
    }
    
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">♡</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-800 mb-4">
            Thank you for being honest
          </h1>
          <p className="text-gray-600">
            {proposal.proposerName} will understand. Whatever happens, we hope you both find happiness.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-gradient-to-br ${bgClasses[proposal.type]} relative overflow-hidden`}>
      <FloatingBackground type={proposal.type} />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {!revealed ? (
            // Envelope Screen
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-8"
              >
                <span className="text-4xl">💌</span>
              </motion.div>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Hey {proposal.recipientName}
              </h1>
              
              <p className="text-lg text-gray-600 mb-10">
                You have a special message from <span className="font-semibold">{proposal.proposerName}</span>
              </p>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRevealed(true)}
                className={`
                  px-10 py-4 rounded-full font-semibold text-lg text-white shadow-lg
                  bg-gradient-to-r ${config.theme.gradient} hover:shadow-xl transition-shadow
                `}
              >
                Open Message
              </motion.button>
            </motion.div>
          ) : (
            // Proposal Content
            <motion.div
              key="proposal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg w-full"
            >
              {/* Message Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-10"
              >
                <div className="text-center mb-6">
                  <span className="font-handwriting text-2xl text-gray-400">
                    Dear {proposal.recipientName},
                  </span>
                </div>
                
                <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-8 text-center md:text-left">
                  {proposal.message}
                </p>
                
                <div className="text-right">
                  <span className="font-handwriting text-lg text-gray-400">
                    With love,
                  </span>
                  <br />
                  <span className="font-handwriting text-2xl gradient-text font-semibold">
                    {proposal.proposerName}
                  </span>
                </div>
              </motion.div>

              {/* The Question */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-6"
                >
                  {config.emoji}
                </motion.div>
                
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-10">
                  {config.headline}
                </h2>

                {!showConfirmNo ? (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleResponse('yes')}
                      className={`
                        px-10 py-4 rounded-full font-semibold text-lg text-white shadow-lg
                        bg-gradient-to-r ${config.theme.gradient}
                        hover:shadow-xl transition-shadow
                      `}
                    >
                      {config.buttonYes}
                    </motion.button>
                    
                    <PlayfulNoButton
                      onClick={() => setShowConfirmNo(true)}
                      text={config.buttonNo}
                      playful={config.animation === 'playful' || config.animation === 'cute'}
                    />
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/90 rounded-2xl p-6 max-w-sm mx-auto"
                  >
                    <p className="text-gray-700 mb-5">
                      Are you sure?
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setShowConfirmNo(false)}
                        className="px-5 py-2 bg-valentine-500 text-white rounded-full font-medium hover:bg-valentine-600 transition"
                      >
                        Go back
                      </button>
                      <button
                        onClick={() => handleResponse('no')}
                        className="px-5 py-2 bg-gray-100 text-gray-600 rounded-full font-medium hover:bg-gray-200 transition"
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
