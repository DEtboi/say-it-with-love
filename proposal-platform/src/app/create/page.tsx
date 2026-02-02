'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PROPOSAL_CONFIGS, TEMPLATES, ProposalType, TemplateId } from '@/types/proposal';
import { createProposal } from '@/lib/proposals';

// Component that uses useSearchParams
function CreateFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const typeParam = searchParams.get('type') as ProposalType | null;
  const proposalType = typeParam && PROPOSAL_CONFIGS[typeParam] ? typeParam : 'valentine';
  const config = PROPOSAL_CONFIGS[proposalType];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    proposerName: '',
    proposerEmail: '',
    recipientName: '',
    message: '',
    template: 'romantic' as TemplateId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [statusLink, setStatusLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const proposalId = await createProposal({
        type: proposalType,
        proposerName: formData.proposerName,
        proposerEmail: formData.proposerEmail,
        recipientName: formData.recipientName,
        message: formData.message,
        template: formData.template,
      });
      
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setGeneratedLink(`${origin}/p/${proposalId}`);
      setStatusLink(`${origin}/status/${proposalId}`);
    } catch (err) {
      console.error('Error creating proposal:', err);
      setError('Failed to create proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard! 💕');
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isStepValid = (s: number) => {
    switch (s) {
      case 1:
        return formData.proposerName.trim() && 
               formData.proposerEmail.trim() && 
               isValidEmail(formData.proposerEmail) &&
               formData.recipientName.trim();
      case 2:
        return formData.message.trim();
      default:
        return false;
    }
  };

  // Success state - show generated link and status link
  if (generatedLink && statusLink) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center"
      >
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="font-display text-3xl font-bold text-gray-800 mb-4">
          Your proposal is ready!
        </h2>
        <p className="text-gray-600 mb-8">
          Share the proposal link with {formData.recipientName} and wait for the magic ✨
        </p>

        {/* Proposal Link */}
        <div className="bg-white rounded-xl p-4 shadow-md mb-4">
          <p className="text-sm text-gray-500 mb-2">📤 Share this link with {formData.recipientName}:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={generatedLink}
              readOnly
              className="flex-1 p-3 bg-gray-50 rounded-lg text-sm font-mono"
            />
            <button
              onClick={() => copyLink(generatedLink)}
              className="p-3 bg-valentine-500 text-white rounded-lg hover:bg-valentine-600 transition"
            >
              📋
            </button>
          </div>
        </div>

        {/* Status Link */}
        <div className="bg-blue-50 rounded-xl p-4 shadow-md mb-6">
          <p className="text-sm text-blue-600 mb-2">🔒 Your private status page (don&apos;t share!):</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={statusLink}
              readOnly
              className="flex-1 p-3 bg-white rounded-lg text-sm font-mono"
            />
            <button
              onClick={() => copyLink(statusLink)}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              📋
            </button>
          </div>
          <p className="text-xs text-blue-500 mt-2">
            You&apos;ll also receive an email when {formData.recipientName} responds!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`I have something special for you 💕 ${generatedLink}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition"
          >
            Share on WhatsApp 💬
          </a>
          <Link
            href={generatedLink.replace(typeof window !== 'undefined' ? window.location.origin : '', '')}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Preview Proposal 👀
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          ⏰ This link expires in 5 days
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block text-gray-500 hover:text-gray-700 mb-4">
          ← Back to home
        </Link>
        <div className="text-4xl mb-2">{config.emoji}</div>
        <h1 className="font-display text-3xl font-bold text-gray-800">
          {config.headline}
        </h1>
        <p className="text-gray-600 mt-2">Let&apos;s create something beautiful together</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center gap-2 mb-8">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-all ${
              step >= s ? 'bg-valentine-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
          {error}
        </div>
      )}

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="font-display text-xl font-semibold mb-6">
              Who&apos;s this proposal from and to? 💕
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.proposerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, proposerName: e.target.value }))}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-valentine-300 focus:border-valentine-300 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your email <span className="text-gray-400">(for notifications)</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.proposerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, proposerEmail: e.target.value }))}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-valentine-300 focus:border-valentine-300 outline-none transition"
                />
                <p className="text-xs text-gray-400 mt-1">
                  We&apos;ll notify you when they respond 📧
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Their name
                </label>
                <input
                  type="text"
                  placeholder="Enter their name"
                  value={formData.recipientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-valentine-300 focus:border-valentine-300 outline-none transition"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="font-display text-xl font-semibold mb-6">
              Write your heartfelt message 💌
            </h2>

            <textarea
              placeholder={`Dear ${formData.recipientName || 'them'}...\n\nWrite something from your heart...`}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={6}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-valentine-300 focus:border-valentine-300 outline-none transition resize-none"
            />

            <p className="text-sm text-gray-400 mt-2 mb-6">
              Tip: Be genuine and speak from the heart 💗
            </p>

            {/* Template Selection */}
            <h3 className="font-medium text-gray-700 mb-3">Choose a style</h3>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setFormData(prev => ({ ...prev, template: template.id }))}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    formData.template === template.id
                      ? 'border-valentine-500 bg-valentine-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-800">{template.name}</p>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep(prev => Math.max(1, prev - 1))}
          className={`px-6 py-3 rounded-full font-medium transition ${
            step === 1 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          disabled={step === 1}
        >
          ← Back
        </button>

        {step < 2 ? (
          <button
            onClick={() => setStep(prev => prev + 1)}
            disabled={!isStepValid(step)}
            className={`px-8 py-3 rounded-full font-semibold transition ${
              isStepValid(step)
                ? 'bg-valentine-500 text-white hover:bg-valentine-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isStepValid(step)}
            className={`px-8 py-3 rounded-full font-semibold transition flex items-center gap-2 ${
              isSubmitting || !isStepValid(step)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-valentine-500 to-pink-500 text-white hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Creating...
              </>
            ) : (
              <>
                Create Proposal ✨
              </>
            )}
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-sm text-gray-400 mt-8">
        ⏰ Your proposal will be automatically deleted after 5 days
        <br />
        to keep the platform free for everyone.
      </p>
    </div>
  );
}

// Loading fallback
function CreateFormLoading() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <Suspense fallback={<CreateFormLoading />}>
        <CreateFormContent />
      </Suspense>
    </main>
  );
}
