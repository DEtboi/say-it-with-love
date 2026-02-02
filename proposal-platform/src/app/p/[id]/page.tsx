'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROPOSAL_CONFIGS, ProposalType, Proposal } from '@/types/proposal';
import { getProposal, isProposalExpired, recordResponse } from '@/lib/proposals';
import { sendResponseNotification } from '@/lib/email';

// Confetti component
const Confetti = () => {
  const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#fecdd3', '#ffd700', '#ff69b4'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="confetti"
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
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  );
};

// Floating Hearts Background
const FloatingHeartsBackground = ({ type }: { type: ProposalType }) => {
  const emojis: Record<ProposalType, string[]> = {
    valentine: ['💕', '💘', '❤️', '🩷', '💝'],
    marriage: ['💍', '💒', '💑', '✨', '🤍'],
    girlfriend: ['💖', '💕', '🌸', '✨', '💗'],
    boyfriend: ['💙', '🩵', '✨', '💫', '🌟'],
  };
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl opacity-30"
          initial={{ 
            x: `${Math.random() * 100}%`,
            y: '110vh',
          }}
          animate={{ 
            y: '-10vh',
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: 'linear',
          }}
        >
          {emojis[type][i % emojis[type].length]}
        </motion.div>
      ))}
    </div>
  );
};

// Success Screen
const SuccessScreen = ({ config, proposerName }: { config: typeof PROPOSAL_CONFIGS[ProposalType]; proposerName: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <Confetti />
      
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
        className="text-8xl mb-8"
      >
        🎉
      </motion.div>
      
      <h1 className="font-display text-4xl md:text-6xl font-bold text-gray-800 mb-4">
        {config.successTitle}
      </h1>
      
      <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
        {config.successMessage}
      </p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-lg text-gray-500"
      >
        <span className="font-handwriting text-3xl gradient-text">{proposerName}</span>
        <br />
        <span>is over the moon right now! 🌙</span>
      </motion.div>
    </motion.div>
  );
};

// The "No" button that tries to escape (playful mode only)
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
    
    const maxX = 100;
    const maxY = 50;
    const newX = (Math.random() - 0.5) * maxX;
    const newY = (Math.random() - 0.5) * maxY;
    
    setPosition({ x: newX, y: newY });
    setEscapeCount(prev => prev + 1);
  }, [playful, escapeCount]);

  const buttonText = escapeCount >= 3 ? 'Okay, fine... 😢' : text;

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="px-8 py-4 bg-gray-100 text-gray-600 rounded-full font-semibold hover:bg-gray-200 transition"
    >
      {buttonText}
    </motion.button>
  );
};

// Loading Screen
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50">
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="text-6xl"
    >
      💕
    </motion.div>
  </div>
);

// Error/Expired Screen
const ExpiredScreen = () => (
  <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="text-center">
      <div className="text-6xl mb-6">💔</div>
      <h1 className="font-display text-3xl font-bold text-gray-800 mb-4">
        This proposal has expired
      </h1>
      <p className="text-gray-600 mb-8">
        Proposals are available for 5 days to keep the platform free.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-valentine-500 text-white rounded-full font-semibold hover:bg-valentine-600 transition"
      >
        Create a new proposal 💕
      </a>
    </div>
  </main>
);

// Not Found Screen
const NotFoundScreen = () => (
  <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="text-center">
      <div className="text-6xl mb-6">🔍</div>
      <h1 className="font-display text-3xl font-bold text-gray-800 mb-4">
        Proposal not found
      </h1>
      <p className="text-gray-600 mb-8">
        This proposal doesn&apos;t exist or may have been deleted.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-valentine-500 text-white rounded-full font-semibold hover:bg-valentine-600 transition"
      >
        Create a new proposal 💕
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

  // Fetch proposal data
  useEffect(() => {
    async function fetchProposal() {
      try {
        const data = await getProposal(id);
        if (data) {
          setProposal(data);
          // If already responded, set the response
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

  // Handle response
  const handleResponse = async (resp: 'yes' | 'no') => {
    try {
      await recordResponse(id, resp);
      setResponse(resp);
      
      // Send email notification to proposer
      if (proposal && proposal.proposerEmail) {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        await sendResponseNotification({
          to_email: proposal.proposerEmail,
          proposer_name: proposal.proposerName,
          recipient_name: proposal.recipientName,
          proposal_type: PROPOSAL_CONFIGS[proposal.type].headline,
          response: resp,
          status_link: `${origin}/status/${id}`,
        });
      }
    } catch (err) {
      console.error('Error recording response:', err);
      // Still show the response locally even if save fails
      setResponse(resp);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Error state
  if (error || !proposal) {
    return <NotFoundScreen />;
  }

  // Check if expired
  if (isProposalExpired(proposal)) {
    return <ExpiredScreen />;
  }

  const config = PROPOSAL_CONFIGS[proposal.type];
  
  // Background color classes based on type
  const bgClasses: Record<ProposalType, string> = {
    valentine: 'from-valentine-50 via-pink-50 to-rose-50',
    marriage: 'from-marriage-50 via-amber-50 to-yellow-50',
    girlfriend: 'from-girlfriend-50 via-fuchsia-50 to-purple-50',
    boyfriend: 'from-boyfriend-50 via-teal-50 to-cyan-50',
  };

  // Response given - show success or gentle decline
  if (response) {
    if (response === 'yes') {
      return (
        <main className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${bgClasses[proposal.type]} p-4`}>
          <FloatingHeartsBackground type={proposal.type} />
          <SuccessScreen config={config} proposerName={proposal.proposerName} />
        </main>
      );
    }
    
    // No response - gentle message
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-6">🤗</div>
          <h1 className="font-display text-2xl font-bold text-gray-800 mb-4">
            That&apos;s okay!
          </h1>
          <p className="text-gray-600">
            Thank you for being honest. {proposal.proposerName} will understand.
            <br /><br />
            Whatever happens, we hope you both find happiness. 💙
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-gradient-to-br ${bgClasses[proposal.type]} relative overflow-hidden`}>
      <FloatingHeartsBackground type={proposal.type} />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {!revealed ? (
            // Envelope / Reveal Screen
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-8"
              >
                💌
              </motion.div>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Hey {proposal.recipientName}!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                You have a special message from <span className="font-semibold">{proposal.proposerName}</span>
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRevealed(true)}
                className={`
                  btn-shine px-8 py-4 rounded-full font-semibold text-lg text-white shadow-lg
                  bg-gradient-to-r ${config.theme.gradient}
                `}
              >
                Open Message ✨
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
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8"
              >
                <div className="text-center mb-6">
                  <span className="font-handwriting text-2xl text-gray-500">
                    Dear {proposal.recipientName},
                  </span>
                </div>
                
                <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
                  {proposal.message}
                </p>
                
                <div className="text-right">
                  <span className="font-handwriting text-xl text-gray-600">
                    With love,
                  </span>
                  <br />
                  <span className="font-handwriting text-2xl gradient-text font-semibold">
                    {proposal.proposerName}
                  </span>
                </div>
              </motion.div>

              {/* The Big Question */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  {config.emoji}
                </motion.div>
                
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                  {config.headline}
                </h2>

                {/* Response Buttons */}
                {!showConfirmNo ? (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleResponse('yes')}
                      className={`
                        btn-shine px-8 py-4 rounded-full font-semibold text-lg text-white shadow-lg
                        bg-gradient-to-r ${config.theme.gradient}
                        glow-pulse
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
                  // Confirm No
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/80 rounded-2xl p-6"
                  >
                    <p className="text-gray-700 mb-4">
                      Are you sure? {proposal.proposerName} will be notified. 💔
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setShowConfirmNo(false)}
                        className="px-6 py-2 bg-valentine-500 text-white rounded-full font-medium"
                      >
                        Wait, go back!
                      </button>
                      <button
                        onClick={() => handleResponse('no')}
                        className="px-6 py-2 bg-gray-200 text-gray-600 rounded-full font-medium"
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
