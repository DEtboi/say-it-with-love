export type ProposalType = 'valentine' | 'marriage' | 'girlfriend' | 'boyfriend';

export interface ProposalConfig {
  type: ProposalType;
  emoji: string;
  title: string;
  headline: string;
  buttonYes: string;
  buttonNo: string;
  successTitle: string;
  successMessage: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    gradient: string;
  };
  animation: 'playful' | 'elegant' | 'cute' | 'casual';
}

export interface Proposal {
  id: string;
  type: ProposalType;
  proposerName: string;
  proposerEmail?: string; // Optional - not used anymore
  recipientName: string;
  message: string;
  template: string;
  createdAt: Date;
  expiresAt: Date;
  response?: 'yes' | 'no';
  respondedAt?: Date;
}

export interface CreateProposalForm {
  type: ProposalType;
  proposerName: string;
  proposerEmail?: string; // Optional - not used anymore
  recipientName: string;
  message: string;
  template: string;
}

export const PROPOSAL_CONFIGS: Record<ProposalType, ProposalConfig> = {
  valentine: {
    type: 'valentine',
    emoji: '💘',
    title: 'Valentine',
    headline: 'Will you be my Valentine?',
    buttonYes: 'Yes, I will! 💕',
    buttonNo: 'Let me think...',
    successTitle: 'You said YES!',
    successMessage: "This is going to be the best Valentine's Day ever!",
    theme: {
      primary: 'valentine-500',
      secondary: 'valentine-200',
      accent: 'valentine-600',
      background: 'valentine-50',
      gradient: 'from-valentine-400 via-valentine-500 to-valentine-600',
    },
    animation: 'playful',
  },
  marriage: {
    type: 'marriage',
    emoji: '💍',
    title: 'Marriage',
    headline: 'Will you marry me?',
    buttonYes: 'Yes, forever! 💍',
    buttonNo: 'I need a moment...',
    successTitle: 'You said YES!',
    successMessage: "I can't wait to spend forever with you.",
    theme: {
      primary: 'marriage-500',
      secondary: 'marriage-200',
      accent: 'marriage-600',
      background: 'marriage-50',
      gradient: 'from-marriage-400 via-marriage-500 to-marriage-600',
    },
    animation: 'elegant',
  },
  girlfriend: {
    type: 'girlfriend',
    emoji: '💖',
    title: 'Girlfriend',
    headline: 'Will you be my girlfriend?',
    buttonYes: 'Yes!! 💖',
    buttonNo: 'Hmm...',
    successTitle: "She said YES!",
    successMessage: "You've made me the happiest person alive!",
    theme: {
      primary: 'girlfriend-500',
      secondary: 'girlfriend-200',
      accent: 'girlfriend-600',
      background: 'girlfriend-50',
      gradient: 'from-girlfriend-400 via-girlfriend-500 to-girlfriend-600',
    },
    animation: 'cute',
  },
  boyfriend: {
    type: 'boyfriend',
    emoji: '😌',
    title: 'Boyfriend',
    headline: 'Will you be my boyfriend?',
    buttonYes: 'Absolutely! 😎',
    buttonNo: 'Wait what...',
    successTitle: 'He said YES!',
    successMessage: "Let's gooo! This is awesome!",
    theme: {
      primary: 'boyfriend-500',
      secondary: 'boyfriend-200',
      accent: 'boyfriend-600',
      background: 'boyfriend-50',
      gradient: 'from-boyfriend-400 via-boyfriend-500 to-boyfriend-600',
    },
    animation: 'casual',
  },
};

export const TEMPLATES = [
  { id: 'classic', name: 'Classic', description: 'Timeless and elegant' },
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary' },
  { id: 'romantic', name: 'Romantic', description: 'Dreamy and heartfelt' },
  { id: 'playful', name: 'Playful', description: 'Fun and lighthearted' },
] as const;

export type TemplateId = typeof TEMPLATES[number]['id'];
