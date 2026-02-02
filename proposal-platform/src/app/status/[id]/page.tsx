'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PROPOSAL_CONFIGS, ProposalType, Proposal } from '@/types/proposal';
import { getProposal, isProposalExpired, getTimeRemaining } from '@/lib/proposals';

// Loading Screen
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="text-6xl"
    >
      ⏳
    </motion.div>
  </div>
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
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-valentine-500 text-white rounded-full font-semibold hover:bg-valentine-600 transition"
      >
        Create a new proposal 💕
      </Link>
    </div>
  </main>
);

// Expired Screen
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
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-valentine-500 text-white rounded-full font-semibold hover:bg-valentine-600 transition"
      >
        Create a new proposal 💕
      </Link>
    </div>
  </main>
);

export default function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch proposal data
  useEffect(() => {
    async function fetchProposal() {
      try {
        const data = await getProposal(id);
        if (data) {
          setProposal(data);
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

  // Auto-refresh every 30 seconds if waiting for response
  useEffect(() => {
    if (!proposal || proposal.response) return;
    
    const interval = setInterval(async () => {
      try {
        const data = await getProposal(id);
        if (data) {
          setProposal(data);
        }
      } catch (err) {
        console.error('Error refreshing proposal:', err);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [id, proposal]);

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
  const timeRemaining = getTimeRemaining(proposal.expiresAt);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-gray-500 hover:text-gray-700 mb-4">
            ← Back to home
          </Link>
          <h1 className="font-display text-3xl font-bold text-gray-800">
            Proposal Status 📊
          </h1>
          <p className="text-gray-600 mt-2">
            Keep track of your proposal to {proposal.recipientName}
          </p>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          {/* Proposal Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="text-4xl">{config.emoji}</div>
            <div>
              <h2 className="font-semibold text-gray-800">{config.headline}</h2>
              <p className="text-sm text-gray-500">
                To: {proposal.recipientName} • From: {proposal.proposerName}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="text-center py-6">
            {proposal.response === 'yes' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="font-display text-2xl font-bold text-green-600 mb-2">
                  They said YES!
                </h3>
                <p className="text-gray-600">
                  Congratulations! {proposal.recipientName} accepted your proposal!
                </p>
                {proposal.respondedAt && (
                  <p className="text-sm text-gray-400 mt-2">
                    Responded on {proposal.respondedAt.toLocaleDateString()} at{' '}
                    {proposal.respondedAt.toLocaleTimeString()}
                  </p>
                )}
              </motion.div>
            ) : proposal.response === 'no' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <div className="text-6xl mb-4">💙</div>
                <h3 className="font-display text-2xl font-bold text-gray-600 mb-2">
                  They responded
                </h3>
                <p className="text-gray-600">
                  {proposal.recipientName} has seen your proposal and responded.
                  <br />
                  Whatever happens, you were brave enough to ask. 💙
                </p>
                {proposal.respondedAt && (
                  <p className="text-sm text-gray-400 mt-2">
                    Responded on {proposal.respondedAt.toLocaleDateString()} at{' '}
                    {proposal.respondedAt.toLocaleTimeString()}
                  </p>
                )}
              </motion.div>
            ) : (
              <div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  ⏳
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-blue-600 mb-2">
                  Waiting for response...
                </h3>
                <p className="text-gray-600">
                  {proposal.recipientName} hasn&apos;t responded yet.
                  <br />
                  We&apos;ll email you when they do!
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  This page auto-refreshes every 30 seconds
                </p>
              </div>
            )}
          </div>

          {/* Time Remaining */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              ⏰ {timeRemaining}
            </p>
          </div>
        </motion.div>

        {/* Share Link Again */}
        {!proposal.response && (
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
            <p className="text-sm text-gray-500 mb-2">📤 Share link (send to {proposal.recipientName}):</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${id}`}
                readOnly
                className="flex-1 p-3 bg-gray-50 rounded-lg text-sm font-mono"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/p/${id}`);
                  alert('Link copied! 💕');
                }}
                className="p-3 bg-valentine-500 text-white rounded-lg hover:bg-valentine-600 transition"
              >
                📋
              </button>
            </div>
          </div>
        )}

        {/* Create Another */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Create another proposal 💕
          </Link>
        </div>
      </div>
    </main>
  );
}
