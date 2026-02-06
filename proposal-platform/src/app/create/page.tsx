'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PROPOSAL_CONFIGS, TEMPLATES, ProposalType, TemplateId } from '@/types/proposal';
import { createProposal } from '@/lib/proposals';

// Premium animated background
const CreateBackground = ({ type }: { type: ProposalType }) => {
  const colors: Record<ProposalType, { from: string; to: string }> = {
    valentine: { from: 'rgba(251,113,133,0.3)', to: 'rgba(244,63,94,0.2)' },
    marriage: { from: 'rgba(251,191,36,0.3)', to: 'rgba(245,158,11,0.2)' },
    girlfriend: { from: 'rgba(217,70,239,0.3)', to: 'rgba(168,85,247,0.2)' },
    boyfriend: { from: 'rgba(45,212,191,0.3)', to: 'rgba(20,184,166,0.2)' },
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50" />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors[type].from} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          top: '-10%',
          right: '-10%',
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors[type].to} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          bottom: '-10%',
          left: '-10%',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

// Confetti celebration
const Confetti = () => {
  const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#fda4af', '#fecdd3', '#a855f7', '#c084fc'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(80)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: -20,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
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
            delay: Math.random() * 1.5,
            ease: 'easeOut',
          }}
          style={{
            position: 'fixed',
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
};

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
    isAnonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [statusLink, setStatusLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const proposalId = await createProposal({
        type: proposalType,
        proposerName: formData.proposerName,
        proposerEmail: '',
        recipientName: formData.recipientName,
        message: formData.message,
        template: formData.template,
        isAnonymous: formData.isAnonymous,
      });
      
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setGeneratedLink(`${origin}/p/${proposalId}`);
      setStatusLink(`${origin}/status/${proposalId}`);
    } catch (err) {
      console.error('Error creating proposal:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLink = (link: string, type: 'share' | 'status') => {
    navigator.clipboard.writeText(link);
    if (type === 'share') {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } else {
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

  const gradients: Record<ProposalType, string> = {
    valentine: 'from-rose-500 via-pink-500 to-rose-400',
    marriage: 'from-amber-500 via-yellow-500 to-orange-400',
    girlfriend: 'from-fuchsia-500 via-purple-500 to-pink-500',
    boyfriend: 'from-teal-500 via-cyan-500 to-blue-500',
  };

  // Success state
  if (generatedLink && statusLink) {
    return (
      <>
        <Confetti />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="max-w-xl mx-auto text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className={`w-24 h-24 bg-gradient-to-br ${gradients[proposalType]} rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl`}
          >
            <motion.svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-4xl font-bold text-gray-900 mb-4"
          >
            Your proposal is ready!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-lg mb-10"
          >
            Share the magic with {formData.recipientName}
          </motion.p>

          {/* Share Link Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 mb-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${gradients[proposalType]} rounded-xl flex items-center justify-center`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Share this link</p>
                <p className="text-sm text-gray-500">Send to {formData.recipientName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="flex-1 p-4 bg-gray-50/80 rounded-2xl text-sm font-mono text-gray-600 border-0"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyLink(generatedLink, 'share')}
                className={`px-6 py-4 rounded-2xl font-semibold transition-all ${
                  copiedShare 
                    ? 'bg-green-500 text-white' 
                    : `bg-gradient-to-r ${gradients[proposalType]} text-white shadow-lg`
                }`}
              >
                {copiedShare ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
          </motion.div>

          {/* Status Link Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-6 shadow-lg border border-slate-100 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Your private status page</p>
                <p className="text-sm text-gray-500">Check when they respond (don&apos;t share this)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={statusLink}
                readOnly
                className="flex-1 p-4 bg-white/80 rounded-2xl text-sm font-mono text-gray-600 border-0"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyLink(statusLink, 'status')}
                className={`px-6 py-4 rounded-2xl font-semibold transition-all ${
                  copiedStatus 
                    ? 'bg-green-500 text-white' 
                    : 'bg-slate-700 text-white'
                }`}
              >
                {copiedStatus ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href={`https://wa.me/?text=${encodeURIComponent(`I have something special for you... ${generatedLink}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-[#25D366] text-white rounded-full font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share on WhatsApp
            </motion.a>
            <Link href={`/p/${generatedLink?.split('/').pop()}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold shadow-lg border border-gray-200"
              >
                Preview Proposal
              </motion.button>
            </Link>
          </motion.div>

          <p className="mt-10 text-sm text-gray-400">
            This link expires in 5 days
          </p>
        </motion.div>
      </>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
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
        
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl mb-4"
        >
          {config.emoji}
        </motion.div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          {config.headline}
        </h1>
        <p className="text-gray-500">Let&apos;s create something beautiful</p>
      </motion.div>

      {/* Progress indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-4 mb-10"
      >
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-4">
            <motion.div
              animate={{ 
                scale: step === s ? 1.1 : 1,
              }}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                ${step >= s 
                  ? `bg-gradient-to-br ${gradients[proposalType]} text-white shadow-lg` 
                  : 'bg-gray-100 text-gray-400'
                }
              `}
            >
              {step > s ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : s}
            </motion.div>
            {s < 2 && (
              <div className={`w-16 h-1 rounded-full transition-colors duration-300 ${step > s ? `bg-gradient-to-r ${gradients[proposalType]}` : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl border border-white/50"
          >
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
              Who&apos;s this proposal for?
            </h2>
            <p className="text-gray-500 mb-8">Tell us about you and your special someone</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.proposerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, proposerName: e.target.value }))}
                  className="w-full p-4 bg-gray-50/80 rounded-2xl border-2 border-transparent focus:border-rose-300 focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Their name
                </label>
                <input
                  type="text"
                  placeholder="Enter their name"
                  value={formData.recipientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                  className="w-full p-4 bg-gray-50/80 rounded-2xl border-2 border-transparent focus:border-rose-300 focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Anonymous Toggle */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  formData.isAnonymous 
                    ? `bg-gradient-to-r ${gradients[proposalType]} border-transparent` 
                    : 'bg-gray-50/80 border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.isAnonymous ? 'bg-white/20' : 'bg-white'
                    }`}>
                      <span className="text-2xl">🎭</span>
                    </div>
                    <div>
                      <p className={`font-semibold ${formData.isAnonymous ? 'text-white' : 'text-gray-900'}`}>
                        Send Anonymously
                      </p>
                      <p className={`text-sm ${formData.isAnonymous ? 'text-white/80' : 'text-gray-500'}`}>
                        They&apos;ll have to guess who you are (3 tries!)
                      </p>
                    </div>
                  </div>
                  <div className={`w-14 h-8 rounded-full p-1 transition-all ${
                    formData.isAnonymous ? 'bg-white/30' : 'bg-gray-300'
                  }`}>
                    <motion.div 
                      className={`w-6 h-6 rounded-full shadow-md ${
                        formData.isAnonymous ? 'bg-white' : 'bg-white'
                      }`}
                      animate={{ x: formData.isAnonymous ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl border border-white/50"
          >
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
              Write your message
            </h2>
            <p className="text-gray-500 mb-8">Pour your heart out — be genuine and speak from the heart</p>

            <textarea
              placeholder={`Dear ${formData.recipientName || 'them'}...\n\nWrite something beautiful from your heart...`}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={6}
              className="w-full p-4 bg-gray-50/80 rounded-2xl border-2 border-transparent focus:border-rose-300 focus:bg-white outline-none transition-all resize-none mb-8 text-gray-900 placeholder-gray-400"
            />

            {/* Template Selection */}
            <h3 className="font-semibold text-gray-700 mb-4">Choose a style</h3>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((template) => (
                <motion.button
                  key={template.id}
                  onClick={() => setFormData(prev => ({ ...prev, template: template.id }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-2xl text-left transition-all ${
                    formData.template === template.id
                      ? `bg-gradient-to-br ${gradients[proposalType]} text-white shadow-lg`
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <p className="font-semibold">{template.name}</p>
                  <p className={`text-sm ${formData.template === template.id ? 'text-white/80' : 'text-gray-500'}`}>
                    {template.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between mt-8"
      >
        <motion.button
          onClick={() => setStep(prev => Math.max(1, prev - 1))}
          whileHover={step > 1 ? { scale: 1.02 } : {}}
          whileTap={step > 1 ? { scale: 0.98 } : {}}
          className={`px-8 py-4 rounded-full font-semibold transition-all ${
            step === 1 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-600 bg-white shadow-lg hover:shadow-xl'
          }`}
          disabled={step === 1}
        >
          Back
        </motion.button>

        {step < 2 ? (
          <motion.button
            onClick={() => setStep(prev => prev + 1)}
            disabled={!isStepValid(step)}
            whileHover={isStepValid(step) ? { scale: 1.02 } : {}}
            whileTap={isStepValid(step) ? { scale: 0.98 } : {}}
            className={`px-8 py-4 rounded-full font-semibold transition-all ${
              isStepValid(step)
                ? `bg-gradient-to-r ${gradients[proposalType]} text-white shadow-xl`
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </motion.button>
        ) : (
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting || !isStepValid(step)}
            whileHover={!isSubmitting && isStepValid(step) ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting && isStepValid(step) ? { scale: 0.98 } : {}}
            className={`px-8 py-4 rounded-full font-semibold transition-all flex items-center gap-3 ${
              isSubmitting || !isStepValid(step)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : `bg-gradient-to-r ${gradients[proposalType]} text-white shadow-xl`
            }`}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Creating...
              </>
            ) : (
              <>
                Create Proposal
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </motion.button>
        )}
      </motion.div>

      <p className="text-center text-sm text-gray-400 mt-10">
        Proposals auto-delete after 5 days to keep the platform free
      </p>
    </div>
  );
}

function CreateFormLoading() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full mx-auto"
      />
    </div>
  );
}

export default function CreatePage() {
  return (
    <main className="min-h-screen relative py-12 px-4">
      <Suspense fallback={<CreateFormLoading />}>
        <CreateFormContentWrapper />
      </Suspense>
    </main>
  );
}

function CreateFormContentWrapper() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') as ProposalType | null;
  const proposalType = typeParam && PROPOSAL_CONFIGS[typeParam] ? typeParam : 'valentine';
  
  return (
    <>
      <CreateBackground type={proposalType} />
      <div className="relative z-10">
        <CreateFormContent />
      </div>
    </>
  );
}
