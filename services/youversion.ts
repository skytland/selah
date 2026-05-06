import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayRef, formatRef } from '../constants/verses';

const YVP_APP_KEY = process.env.EXPO_PUBLIC_YVP_APP_KEY ?? '';
const YVP_BASE = 'https://api.youversion.com/v1';
const BIBLE_VERSION_ID = 3034; // BSB — Berean Standard Bible

const CACHE_KEY = 'verse:today';
const CACHE_TTL_KEY = 'verse:today:ttl';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface Verse {
  reference: string;     // Human-readable, e.g. "Psalm 46:10"
  usfmRef: string;       // Raw USFM, e.g. "PSA.46.10"
  text: string;          // Full verse text
  version: string;       // e.g. "BSB"
  versionId: number;
}

/**
 * Returns today's Bible verse.
 * First checks AsyncStorage cache (24h TTL), then fetches from YouVersion API.
 * Falls back to a hardcoded verse if both are unavailable (offline + no cache).
 */
export async function getDailyVerse(): Promise<Verse> {
  // Check cache
  const ttlRaw = await AsyncStorage.getItem(CACHE_TTL_KEY);
  const cachedRaw = await AsyncStorage.getItem(CACHE_KEY);

  if (cachedRaw && ttlRaw) {
    const age = Date.now() - parseInt(ttlRaw, 10);
    if (age < TTL_MS) {
      try {
        return JSON.parse(cachedRaw) as Verse;
      } catch {
        // Cache corrupt — fall through to fetch
      }
    }
  }

  const usfmRef = getTodayRef();
  try {
    const response = await fetch(
      `${YVP_BASE}/bibles/${BIBLE_VERSION_ID}/passages/${usfmRef}`,
      {
        headers: {
          'X-YVP-App-Key': YVP_APP_KEY,
          'Accept': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`YouVersion API error: ${response.status}`);
    }

    const data = await response.json();

    // YouVersion API returns { data: { passages: [{ usfms, reference, content }] } }
    const passage = data?.data?.passages?.[0] ?? data?.passages?.[0] ?? data;
    const rawText: string =
      passage?.content ?? passage?.text ?? passage?.verses?.[0]?.text ?? '';

    // Strip any HTML tags from the response
    const cleanText = rawText.replace(/<[^>]+>/g, '').trim();

    const verse: Verse = {
      reference: formatRef(usfmRef),
      usfmRef,
      text: cleanText || getFallbackText(usfmRef),
      version: 'BSB',
      versionId: BIBLE_VERSION_ID,
    };

    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(verse));
    await AsyncStorage.setItem(CACHE_TTL_KEY, Date.now().toString());
    return verse;
  } catch (error) {
    console.warn('[YouVersion] Fetch failed, using cached or fallback:', error);

    // Return stale cache if available
    if (cachedRaw) {
      try {
        return JSON.parse(cachedRaw) as Verse;
      } catch {
        // Ignore
      }
    }

    // Absolute offline fallback
    return {
      reference: formatRef(usfmRef),
      usfmRef,
      text: getFallbackText(usfmRef),
      version: 'BSB',
      versionId: BIBLE_VERSION_ID,
    };
  }
}

/** Clears the verse cache — useful for testing or day rollover. */
export async function clearVerseCache(): Promise<void> {
  await AsyncStorage.multiRemove([CACHE_KEY, CACHE_TTL_KEY]);
}

/** Handful of hardcoded verses for full-offline fallback. */
function getFallbackText(usfm: string): string {
  const fallbacks: Record<string, string> = {
    'PSA.46.10':
      'Be still, and know that I am God. I will be exalted among the nations, I will be exalted in the earth.',
    'JHN.3.16':
      'For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life.',
    'PRO.3.5':
      'Trust in the LORD with all your heart, and lean not on your own understanding.',
    'PHP.4.13':
      'I can do all things through Christ who strengthens me.',
    'PSA.23.1':
      'The LORD is my shepherd; I shall not want.',
  };
  return (
    fallbacks[usfm] ??
    'The LORD is my strength and my shield; my heart trusts in Him, and He helps me.'
  );
}
