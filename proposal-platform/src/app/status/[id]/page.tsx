'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PROPOSAL_CONFIGS, ProposalType, Proposal } from '@/types/proposal';
import { getProposal, isProposalExpired, getTimeRemaining } from '@/lib/proposals';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-16 h-16 rounded-full bg-blue-200"
    />
  </div>
);

const NotFoundScreen = () => (
  <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl text-gray-400">?</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-4">
        Proposal not found
      </h1>
      <p className="text-gray-600 mb-8">
        This proposal doesn&apos;t exist or may have been deleted.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-valentine-500 text-white rounded-full font-medium hover:bg-valentine-600 transition"
      >
        Create a new one
      </Link>
    </div>
  </main>
);

const ExpiredScreen = () => (
  <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl text-gray-400">♡</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-4">
        This proposal has expired
      </h1>
      <p className="text-gray-600 mb-8">
        Proposals are available for 5 days to keep the platform free.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-valentine-500 text-white rounded-full font-medium hover:bg-valentine-600 transition"
      >
        Create a new one
      </Link>
    </div>
  </main>
);

export default function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (loading) return <LoadingScreen />;
  if (error || !proposal) return <NotFoundScreen />;
  if (isProposalExpired(proposal)) return <ExpiredScreen />;

  const config = PROPOSAL_CONFIGS[proposal.type];
  const timeRemaining = getTimeRemaining(proposal.expiresAt);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-gray-400 hover:text-gray-600 mb-6 text-sm">
            ← Back to home
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-800 mb-2">
            Proposal Status
          </h1>
          <p className="text-gray-500">
            Your proposal to {proposal.recipientName}
          </p>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl mb-6"
        >
          {/* Proposal Info */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="text-3xl">{config.emoji}</div>
            <div>
              <h2 className="font-semibold text-gray-800">{config.headline}</h2>
              <p className="text-sm text-gray-500">
                From {proposal.proposerName} to {proposal.recipientName}
              </p>
            </div>
          </div>

          {/* Status Display */}
          <div className="text-center py-8">
            {proposal.response === 'yes' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-green-600 mb-3">
                  They said yes!
                </h3>
                <p className="text-gray-600">
                  Congratulations! {proposal.recipientName} accepted your proposal.
                </p>
                {proposal.respondedAt && (
                  <p className="text-sm text-gray-400 mt-4">
                    {proposal.respondedAt.toLocaleDateString()} at {proposal.respondedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </motion.div>
            ) : proposal.response === 'no' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-blue-400">♡</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-600 mb-3">
                  They responded
                </h3>
                <p className="text-gray-600">
                  {proposal.recipientName} has seen your proposal.
                  <br />
                  <span className="text-gray-400">Whatever happens, you were brave enough to ask.</span>
                </p>
                {proposal.respondedAt && (
                  <p className="text-sm text-gray-400 mt-4">
                    {proposal.respondedAt.toLocaleDateString()} at {proposal.respondedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </motion.div>
            ) : (
              <div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-blue-600 mb-3">
                  Waiting for response
                </h3>
                <p className="text-gray-600 mb-2">
                  {proposal.recipientName} hasn&apos;t responded yet.
                </p>
                <p className="text-sm text-gray-400">
                  This page updates automatically
                </p>
              </div>
            )}
          </div>

          {/* Time Remaining */}
          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              {timeRemaining}
            </p>
          </div>
        </motion.div>

        {/* Share Link */}
        {!proposal.response && (
          <div className="bg-white rounded-2xl p-5 shadow-lg mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Share link (send to {proposal.recipientName}):
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${id}`}
                readOnly
                className="flex-1 p-3 bg-gray-50 rounded-xl text-sm font-mono text-gray-600"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/p/${id}`);
                }}
                className="px-4 py-3 bg-valentine-500 text-white rounded-xl font-medium hover:bg-valentine-600 transition"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Create Another */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 text-gray-500 hover:text-gray-700 font-medium transition"
          >
            Create another proposal
          </Link>
        </div>
      </div>
    </main>
  );
}
