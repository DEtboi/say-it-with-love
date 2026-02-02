'use client';

import { useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PROPOSAL_CONFIGS, TEMPLATES, ProposalType, TemplateId } from '@/types/proposal';

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
    recipientName: '',
    message: '',
    template: 'romantic' as TemplateId,
    images: [] as File[],
  });
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - formData.images.length);
    const validFiles = newFiles.filter(file => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 2MB.`);
        return false;
      }
      return true;
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [formData.images.length]);

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // For demo purposes, generate a mock link
    // In production, this would call createProposal from the proposals service
    const mockId = Math.random().toString(36).substring(2, 10);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setGeneratedLink(`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${mockId}`);
    setIsSubmitting(false);
  };

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      alert('Link copied to clipboard! 💕');
    }
  };

  const isStepValid = (s: number) => {
    switch (s) {
      case 1:
        return formData.proposerName.trim() && formData.recipientName.trim();
      case 2:
        return formData.message.trim();
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Success state - show generated link
  if (generatedLink) {
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
          Share this link with {formData.recipientName} and wait for the magic ✨
        </p>

        <div className="bg-white rounded-xl p-4 shadow-md mb-6">
          <p className="text-sm text-gray-500 mb-2">Your unique link:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={generatedLink}
              readOnly
              className="flex-1 p-3 bg-gray-50 rounded-lg text-sm font-mono"
            />
            <button
              onClick={copyLink}
              className="p-3 bg-valentine-500 text-white rounded-lg hover:bg-valentine-600 transition"
            >
              📋
            </button>
          </div>
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
            href={generatedLink}
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
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-all ${
              step >= s ? 'bg-valentine-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

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

            <p className="text-sm text-gray-400 mt-2">
              Tip: Be genuine and speak from the heart 💗
            </p>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="font-display text-xl font-semibold mb-6">
              Add some photos (optional) 📸
            </h2>

            {/* Image Upload */}
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-valentine-300 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={formData.images.length >= 5}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-600">
                    {formData.images.length >= 5 
                      ? 'Maximum 5 images reached' 
                      : 'Click to upload photos'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Max 2MB per image • Up to 5 images
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreview.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {imagePreview.map((src, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={src}
                        alt={`Upload ${i + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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

        {step < 3 ? (
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
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-valentine-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition flex items-center gap-2"
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
        ⏰ Your proposal and images will be automatically deleted after 5 days
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
