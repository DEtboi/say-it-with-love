'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PROPOSAL_CONFIGS, TEMPLATES, ProposalType, TemplateId } from '@/types/proposal';
import { createProposal } from '@/lib/proposals';

function CreateFormContent() {
  const searchParams = useSearchParams();
  
  const typeParam = searchParams.get('type') as ProposalType | null;
  const proposalType = typeParam && PROPOSAL_CONFIGS[typeParam] ? typeParam : 'valentine';
  const config = PROPOSAL_CONFIGS[proposalType];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    proposerName: '',
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
        proposerEmail: '', // Empty - not using email anymore
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
  };

  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const handleCopyShare = () => {
    if (generatedLink) {
      copyLink(generatedLink);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleCopyStatus = () => {
    if (statusLink) {
      copyLink(statusLink);
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2000);
    }
  };

  const isStepValid = (s: number) => {
    switch (s) {
      case 1:
        return formData.proposerName.trim() && formData.recipientName.trim();
      case 2:
        return formData.message.trim();
      default:
        return false;
    }
  };

  // Success state
  if (generatedLink && statusLink) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        
        <h2 className="font-display text-3xl font-bold text-gray-800 mb-3">
          Your proposal is ready!
        </h2>
        <p className="text-gray-600 mb-8">
          Share the link with {formData.recipientName} and wait for the magic to happen.
        </p>

        {/* Share Link */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-4 text-left">
          <p className="text-sm font-medium text-gray-700 mb-3">Send this link to {formData.recipientName}:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={generatedLink}
              readOnly
              className="flex-1 p-3 bg-gray-50 rounded-xl text-sm font-mono text-gray-600"
            />
            <button
              onClick={handleCopyShare}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                copiedShare 
                  ? 'bg-green-500 text-white' 
                  : 'bg-valentine-500 text-white hover:bg-valentine-600'
              }`}
            >
              {copiedShare ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Status Link */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg mb-8 text-left">
          <p className="text-sm font-medium text-gray-700 mb-1">Your private status page:</p>
          <p className="text-xs text-gray-500 mb-3">Check here to see when they respond (don&apos;t share this)</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={statusLink}
              readOnly
              className="flex-1 p-3 bg-white rounded-xl text-sm font-mono text-gray-600"
            />
            <button
              onClick={handleCopyStatus}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                copiedStatus 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {copiedStatus ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`I have something special for you... ${generatedLink}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition"
          >
            Share on WhatsApp
          </a>
          <Link
            href={generatedLink.replace(typeof window !== 'undefined' ? window.location.origin : '', '')}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition"
          >
            Preview
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          This link will expire in 5 days
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block text-gray-400 hover:text-gray-600 mb-6 text-sm">
          ← Back to home
        </Link>
        <div className="text-4xl mb-3">{config.emoji}</div>
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">
          {config.headline}
        </h1>
        <p className="text-gray-500">Create something beautiful</p>
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-3 mb-10">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step >= s 
                  ? 'bg-valentine-500 text-white' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {s}
            </div>
            {s < 2 && (
              <div className={`w-12 h-0.5 ${step > s ? 'bg-valentine-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-center text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <h2 className="font-display text-xl font-semibold text-gray-800 mb-6">
              Who is this for?
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.proposerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, proposerName: e.target.value }))}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-valentine-200 focus:border-valentine-400 outline-none transition"
                />
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
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-valentine-200 focus:border-valentine-400 outline-none transition"
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
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <h2 className="font-display text-xl font-semibold text-gray-800 mb-6">
              Write your message
            </h2>

            <textarea
              placeholder={`Dear ${formData.recipientName || 'them'}...\n\nWrite something from your heart...`}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={6}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-valentine-200 focus:border-valentine-400 outline-none transition resize-none mb-6"
            />

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
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <p className="font-medium text-gray-800">{template.name}</p>
                  <p className="text-xs text-gray-500">{template.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(prev => Math.max(1, prev - 1))}
          className={`px-6 py-3 rounded-full font-medium transition ${
            step === 1 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          disabled={step === 1}
        >
          Back
        </button>

        {step < 2 ? (
          <button
            onClick={() => setStep(prev => prev + 1)}
            disabled={!isStepValid(step)}
            className={`px-8 py-3 rounded-full font-semibold transition ${
              isStepValid(step)
                ? 'bg-valentine-500 text-white hover:bg-valentine-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isStepValid(step)}
            className={`px-8 py-3 rounded-full font-semibold transition flex items-center gap-2 ${
              isSubmitting || !isStepValid(step)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-valentine-500 to-pink-500 text-white hover:shadow-lg'
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Proposal'}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        Proposals are automatically deleted after 5 days to keep the platform free.
      </p>
    </div>
  );
}

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
    <main className="min-h-screen py-12 px-4 bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <Suspense fallback={<CreateFormLoading />}>
        <CreateFormContent />
      </Suspense>
    </main>
  );
}
