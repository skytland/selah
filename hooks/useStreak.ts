/**
 * useStreak — calculates the user's consecutive daily completion streak
 * from the AsyncStorage journal. A streak is the count of consecutive
 * calendar days ending today (or yesterday, to allow for today not yet done).
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { JournalEntry } from './useDailyState';

const JOURNAL_KEY = 'journal';

function dateStrToMs(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getTime();
}

function getMsDayOffset(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/**
 * Calculates the streak from a sorted (newest-first) array of journal entries.
 * Returns 0 if no completions. The streak counts back from today or yesterday.
 */
export function calculateStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;

  const today = getMsDayOffset(0);
  const yesterday = getMsDayOffset(-1);

  const dates = new Set(entries.map((e) => e.date));

  // Streak must include today or yesterday to be "active"
  const anchorDate = dates.has(today) ? today : dates.has(yesterday) ? yesterday : null;
  if (!anchorDate) return 0;

  let streak = 0;
  let checkDate = anchorDate;

  while (dates.has(checkDate)) {
    streak++;
    // Move one day back
    const ms = dateStrToMs(checkDate) - 86_400_000;
    checkDate = new Date(ms).toISOString().slice(0, 10);
  }

  return streak;
}

/** React hook that reads the journal from AsyncStorage and returns the streak count. */
export function useStreak(journalEntries?: JournalEntry[]): number {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (journalEntries !== undefined) {
      setStreak(calculateStreak(journalEntries));
      return;
    }

    // No external entries provided — load from storage directly
    AsyncStorage.getItem(JOURNAL_KEY)
      .then((raw) => {
        if (!raw) return;
        const entries = JSON.parse(raw) as JournalEntry[];
        setStreak(calculateStreak(entries));
      })
      .catch(() => setStreak(0));
  }, [journalEntries]);

  return streak;
}
