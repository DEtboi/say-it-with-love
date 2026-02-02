import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Proposal, ProposalType, CreateProposalForm } from '@/types/proposal';
import { v4 as uuidv4 } from 'uuid';

const PROPOSALS_COLLECTION = 'proposals';
const EXPIRY_DAYS = 5;

// Generate a short, shareable ID
function generateShortId(): string {
  return uuidv4().slice(0, 8);
}

// Calculate expiry date (5 days from creation)
function getExpiryDate(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + EXPIRY_DAYS);
  return expiry;
}

// Create a new proposal
export async function createProposal(form: CreateProposalForm): Promise<string> {
  const proposalId = generateShortId();
  
  const now = new Date();
  const expiresAt = getExpiryDate();
  
  const proposalData = {
    type: form.type,
    proposerName: form.proposerName,
    proposerEmail: form.proposerEmail,
    recipientName: form.recipientName,
    message: form.message,
    template: form.template,
    createdAt: Timestamp.fromDate(now),
    expiresAt: Timestamp.fromDate(expiresAt),
  };
  
  await setDoc(doc(db, PROPOSALS_COLLECTION, proposalId), proposalData);
  
  return proposalId;
}

// Get a proposal by ID
export async function getProposal(proposalId: string): Promise<Proposal | null> {
  const docRef = doc(db, PROPOSALS_COLLECTION, proposalId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  const data = docSnap.data();
  
  // Convert Firestore Timestamps to Dates
  const proposal: Proposal = {
    id: proposalId,
    type: data.type as ProposalType,
    proposerName: data.proposerName,
    proposerEmail: data.proposerEmail || '',
    recipientName: data.recipientName,
    message: data.message,
    template: data.template,
    createdAt: data.createdAt?.toDate() || new Date(),
    expiresAt: data.expiresAt?.toDate() || new Date(),
    response: data.response,
    respondedAt: data.respondedAt?.toDate(),
  };
  
  return proposal;
}

// Check if a proposal has expired
export function isProposalExpired(proposal: Proposal): boolean {
  return new Date() > proposal.expiresAt;
}

// Record the response to a proposal
export async function recordResponse(
  proposalId: string, 
  response: 'yes' | 'no'
): Promise<void> {
  const docRef = doc(db, PROPOSALS_COLLECTION, proposalId);
  
  await updateDoc(docRef, {
    response,
    respondedAt: serverTimestamp(),
  });
}

// Get remaining time until expiry
export function getTimeRemaining(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) {
    return 'Expired';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  }
  
  return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
}
