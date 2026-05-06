/**
 * useDailyState — the central state machine for the Selah daily loop.
 *
 * Manages: verse loading, reflection streaming, completion tracking,
 * journal writes, and coordinates the full give → mint flow.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PublicKey } from '@solana/web3.js';
import { getDailyVerse, Verse } from '../services/youversion';
import { getReflection } from '../services/gloo';
import { signAndSendTransfer } from '../services/mwa';
import { mintSelah } from '../services/solana';

// ─── Storage keys ────────────────────────────────────────────────────────────

const todayKey = () => `completion:${getTodayDateStr()}`;
const JOURNAL_KEY = 'journal';

function getTodayDateStr(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type DailyPhase =
  | 'loading'       // initial load
  | 'ready'         // verse + reflection loaded, ready to give
  | 'connecting'    // connecting wallet
  | 'signing'       // MWA signing dialog open
  | 'minting'       // minting SELAH token
  | 'complete'      // today's loop done
  | 'error';        // something went wrong

export interface JournalEntry {
  date: string;           // "YYYY-MM-DD"
  verseRef: string;       // "Psalm 46:10"
  amountSOL: number;
  transferSig: string;
  mintSig: string;
  selahBalance: number;
}

export interface DailyState {
  phase: DailyPhase;
  verse: Verse | null;
  reflection: string;
  isStreamingReflection: boolean;
  isCompletedToday: boolean;
  errorMessage: string | null;
  journal: JournalEntry[];
}

export interface DailyActions {
  executeGiveFlow: (
    amountSOL: number,
    recipientAddress: string,
    walletPublicKey: PublicKey,
  ) => Promise<void>;
  retryReflection: () => void;
  clearError: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDailyState(): DailyState & DailyActions {
  const [phase, setPhase] = useState<DailyPhase>('loading');
  const [verse, setVerse] = useState<Verse | null>(null);
  const [reflection, setReflection] = useState('');
  const [isStreamingReflection, setIsStreamingReflection] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [journal, setJournal] = useState<JournalEntry[]>([]);

  const reflectionAbortRef = useRef(false);

  // ── Load on mount ────────────────────────────────────────────────────────

  useEffect(() => {
    initializeDay();
  }, []);

  async function initializeDay() {
    setPhase('loading');
    setErrorMessage(null);

    try {
      // Check if already completed today
      const completed = await checkCompletedToday();

      // Load verse
      const todayVerse = await getDailyVerse();
      setVerse(todayVerse);

      // Load journal
      const entries = await loadJournal();
      setJournal(entries);

      if (completed) {
        setPhase('complete');
        setIsCompletedToday(true);
        return;
      }

      setPhase('ready');

      // Start streaming reflection
      loadReflection(todayVerse);
    } catch (err) {
      setPhase('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load today\'s verse.',
      );
    }
  }

  async function loadReflection(forVerse: Verse) {
    if (isStreamingReflection) return;
    reflectionAbortRef.current = false;
    setIsStreamingReflection(true);
    setReflection('');

    try {
      await getReflection(forVerse.reference, forVerse.text, (chunk) => {
        if (reflectionAbortRef.current) return;
        setReflection((prev) => prev + chunk);
      });
    } catch {
      // Non-fatal — fallback text is set inside getReflection
    } finally {
      setIsStreamingReflection(false);
    }
  }

  // ── Give flow ────────────────────────────────────────────────────────────

  const executeGiveFlow = useCallback(
    async (
      amountSOL: number,
      recipientAddress: string,
      walletPublicKey: PublicKey,
    ) => {
      if (!verse) return;
      setErrorMessage(null);

      try {
        // Step 1: Sign + send SOL transfer
        setPhase('signing');
        const transferSig = await signAndSendTransfer(
          amountSOL,
          recipientAddress,
          walletPublicKey,
        );

        // Step 2: Mint 1 SELAH
        setPhase('minting');
        const { signature: mintSig, newBalance: selahBalance } =
          await mintSelah(walletPublicKey, transferSig);

        // Step 3: Record completion
        const entry: JournalEntry = {
          date: getTodayDateStr(),
          verseRef: verse.reference,
          amountSOL,
          transferSig,
          mintSig,
          selahBalance,
        };

        await recordCompletion(entry);

        const updatedJournal = await loadJournal();
        setJournal(updatedJournal);
        setIsCompletedToday(true);
        setPhase('complete');
      } catch (err) {
        setPhase('ready');
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Transaction failed. Please try again.',
        );
      }
    },
    [verse],
  );

  const retryReflection = useCallback(() => {
    if (verse) loadReflection(verse);
  }, [verse]);

  const clearError = useCallback(() => setErrorMessage(null), []);

  return {
    phase,
    verse,
    reflection,
    isStreamingReflection,
    isCompletedToday,
    errorMessage,
    journal,
    executeGiveFlow,
    retryReflection,
    clearError,
  };
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

async function checkCompletedToday(): Promise<boolean> {
  const val = await AsyncStorage.getItem(todayKey());
  return val !== null;
}

async function recordCompletion(entry: JournalEntry): Promise<void> {
  await AsyncStorage.setItem(todayKey(), JSON.stringify(entry));

  const raw = await AsyncStorage.getItem(JOURNAL_KEY);
  const existing: JournalEntry[] = raw ? JSON.parse(raw) : [];
  // Prepend newest, keep last 365
  const updated = [entry, ...existing.filter((e) => e.date !== entry.date)].slice(0, 365);
  await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
}

async function loadJournal(): Promise<JournalEntry[]> {
  const raw = await AsyncStorage.getItem(JOURNAL_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}
