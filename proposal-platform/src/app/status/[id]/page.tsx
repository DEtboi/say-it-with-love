'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PROPOSAL_CONFIGS, ProposalType, Proposal } from '@/types/proposal';
import { getProposal, isProposalExpired, getTimeRemaining, checkGuess } from '@/lib/proposals';

// Premium background
const StatusBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" />
    <motion.div
      className="absolute w-[500px] h-[500px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        top: '-10%',
        right: '-10%',
      }}
      animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
        bottom: '-10%',
        left: '-10%',
      }}
      animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <StatusBackground />
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full relative z-10"
    />
  </div>
);

const NotFoundScreen = () => (
  <main className="min-h-screen flex items-center justify-center p-4 relative">
    <StatusBackground />
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md relative z-10"
    >
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
        <span className="text-3xl">🔍</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-4">Proposal not found</h1>
      <p className="text-gray-500 mb-8">This proposal doesn&apos;t exist or has been deleted.</p>
      <Link href="/" className="inline-block px-8 py-4 bg-indigo-500 text-white rounded-full font-semibold hover:bg-indigo-600 transition shadow-lg">
        Create a new one
      </Link>
    </motion.div>
  </main>
);

const ExpiredScreen = () => (
  <main className="min-h-screen flex items-center justify-center p-4 relative">
    <StatusBackground />
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md relative z-10"
    >
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
        <span className="text-3xl">⏰</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-4">This proposal has expired</h1>
      <p className="text-gray-500 mb-8">Proposals are available for 5 days to keep the platform free.</p>
      <Link href="/" className="inline-block px-8 py-4 bg-indigo-500 text-white rounded-full font-semibold hover:bg-indigo-600 transition shadow-lg">
        Create a new one
      </Link>
    </motion.div>
  </main>
);

export default function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchProposal() {
      try {
        const data = await getProposal(id);
        if (data) setProposal(data);
        else setError(true);
      } catch (err) {
        console.error('Error fetching proposal:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProposal();
  }, [id]);

  // Auto-refresh every 30 seconds if waiting
  useEffect(() => {
    if (!proposal || proposal.response) return;
    const interval = setInterval(async () => {
      try {
        const data = await getProposal(id);
        if (data) setProposal(data);
      } catch (err) {
        console.error('Error refreshing:', err);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [id, proposal]);

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingScreen />;
  if (error || !proposal) return <NotFoundScreen />;
  if (isProposalExpired(proposal)) return <ExpiredScreen />;

  const config = PROPOSAL_CONFIGS[proposal.type];
  const timeRemaining = getTimeRemaining(proposal.expiresAt);

  const gradients: Record<ProposalType, string> = {
    valentine: 'from-rose-500 to-pink-500',
    marriage: 'from-amber-500 to-orange-500',
    girlfriend: 'from-fuchsia-500 to-purple-500',
    boyfriend: 'from-teal-500 to-cyan-500',
  };

  return (
    <main className="min-h-screen relative py-12 px-4">
      <StatusBackground />
      
      <div className="max-w-lg mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Proposal Status
          </h1>
          <p className="text-gray-500">
            Tracking your proposal to {proposal.recipientName}
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl border border-white/50 mb-6"
        >
          {/* Proposal info header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className={`w-14 h-14 bg-gradient-to-br ${gradients[proposal.type]} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
              {proposal.isAnonymous ? '🎭' : config.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-gray-900">{config.headline}</h2>
                {proposal.isAnonymous && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full">
                    Anonymous
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">From {proposal.proposerName} to {proposal.recipientName}</p>
            </div>
          </div>

          {/* Anonymous guess status - ALWAYS show for anonymous proposals */}
          {proposal.isAnonymous && (
            <div className="mb-6 p-5 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl border border-purple-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎭</span>
                </div>
                <div>
                  <p className="font-bold text-purple-900">Anonymous Mode</p>
                  {proposal.guessedCorrectly ? (
                    <p className="text-sm text-green-600 font-medium">
                      {proposal.recipientName} guessed correctly!
                    </p>
                  ) : (proposal.guessesUsed ?? 0) >= 3 ? (
                    <p className="text-sm text-purple-600">
                      {proposal.recipientName} used all 3 guesses - your identity was revealed
                    </p>
                  ) : (proposal.guessesUsed ?? 0) > 0 ? (
                    <p className="text-sm text-purple-600">
                      {proposal.recipientName} has used {proposal.guessesUsed} of 3 guesses
                    </p>
                  ) : (
                    <p className="text-sm text-purple-600">
                      {proposal.recipientName} hasn&apos;t tried guessing yet
                    </p>
                  )}
                </div>
              </div>
              
              {/* Display all guesses - show section even if empty for clarity */}
              <div className="pt-4 border-t border-purple-200">
                <p className="text-xs font-bold text-purple-800 uppercase tracking-wide mb-3">
                  Names they guessed:
                </p>
                {proposal.guesses && proposal.guesses.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {proposal.guesses.map((g, i) => {
                      const isCorrect = checkGuess(g, proposal.proposerName);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className={`
                            px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm
                            ${isCorrect 
                              ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                              : 'bg-white text-purple-800 border-2 border-purple-200'
                            }
                          `}
                        >
                          <span className="text-base">{g}</span>
                          {isCorrect ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-purple-400 italic">No guesses yet</p>
                )}
              </div>
            </div>
          )}

          {/* Status display */}
          <div className="text-center py-8">
            {proposal.response === 'yes' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="font-display text-3xl font-bold text-green-600 mb-3">They said yes!</h3>
                <p className="text-gray-600">Congratulations! {proposal.recipientName} accepted your proposal.</p>
                {proposal.respondedAt && (
                  <p className="text-sm text-gray-400 mt-4">
                    {proposal.respondedAt.toLocaleDateString()} at {proposal.respondedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </motion.div>
            ) : proposal.response === 'no' ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-4xl">💙</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-700 mb-3">They responded</h3>
                <p className="text-gray-500">{proposal.recipientName} has seen your proposal.</p>
                <p className="text-gray-400 text-sm mt-2">Whatever happens, you were brave enough to ask.</p>
              </motion.div>
            ) : (
              <div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full"
                  />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-indigo-600 mb-3">Waiting for response</h3>
                <p className="text-gray-500 mb-2">{proposal.recipientName} hasn&apos;t responded yet.</p>
                <p className="text-sm text-gray-400">This page updates automatically</p>
              </div>
            )}
          </div>

          {/* Time remaining */}
          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400">{timeRemaining}</p>
          </div>
        </motion.div>

        {/* Share link card */}
        {!proposal.response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${gradients[proposal.type]} rounded-xl flex items-center justify-center`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Share link</p>
                <p className="text-sm text-gray-500">Send to {proposal.recipientName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${id}`}
                readOnly
                className="flex-1 p-4 bg-gray-50/80 rounded-2xl text-sm font-mono text-gray-600"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyLink}
                className={`px-6 py-4 rounded-2xl font-semibold transition-all ${
                  copied ? 'bg-green-500 text-white' : `bg-gradient-to-r ${gradients[proposal.type]} text-white shadow-lg`
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Create another */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Link href="/" className="text-gray-400 hover:text-gray-600 font-medium transition-colors">
            Create another proposal
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
