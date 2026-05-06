/**
 * SELAH — Pause. Reflect. Give. Receive.
 *
 * Single-screen React Native app.
 * One verse. One reflection. One gift. One SELAH token. Every day.
 *
 * github.com/skytland/selah | MIT License
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { PublicKey } from '@solana/web3.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import VerseCard from './components/VerseCard';
import Reflection from './components/Reflection';
import GiveButton from './components/GiveButton';
import StreakBadge from './components/StreakBadge';
import JournalList from './components/JournalList';
import SetupModal, {
  isSetupComplete,
  getSetupData,
} from './components/SetupModal';
import { useDailyState } from './hooks/useDailyState';
import { useStreak } from './hooks/useStreak';
import { getSelahBalance } from './services/solana';
import { connectWallet, getStoredWallet, reconnectWallet } from './services/mwa';

// ─── Notification setup ────────────────────────────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function scheduleDailyNotification() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Selah',
      body: "Your verse for today is waiting. Pause. Reflect. Give.",
      data: {},
    },
    trigger: {
      hour: 7,
      minute: 0,
      repeats: true,
    },
  });
}

// ─── Root App ─────────────────────────────────────────────────────────────

export default function App() {
  const [showSetup, setShowSetup] = useState(false);
  const [walletPublicKey, setWalletPublicKey] = useState<PublicKey | null>(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientLabel, setRecipientLabel] = useState('My Church');
  const [defaultAmount, setDefaultAmount] = useState(0.01);
  const [selahBalance, setSelahBalance] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const daily = useDailyState();
  const streak = useStreak(daily.journal);

  // ── Bootstrap ───────────────────────────────────────────────────────────

  useEffect(() => {
    bootstrap();
    scheduleDailyNotification();
  }, []);

  async function bootstrap() {
    try {
      const setupDone = await isSetupComplete();
      if (!setupDone) {
        setShowSetup(true);
        setIsInitialized(true);
        return;
      }

      // Load saved setup data
      const setup = await getSetupData();
      setRecipientAddress(setup.recipientAddress);
      setRecipientLabel(setup.recipientLabel);
      setDefaultAmount(setup.defaultAmount);

      // Try to reconnect wallet silently
      const stored = await getStoredWallet();
      if (stored) {
        const session = await reconnectWallet();
        if (session) {
          setWalletPublicKey(session.publicKey);
          // Load SELAH balance in background
          getSelahBalance(session.publicKey)
            .then(setSelahBalance)
            .catch(() => {});
        }
      }
    } catch (err) {
      console.warn('[Bootstrap] Error:', err);
    } finally {
      setIsInitialized(true);
    }
  }

  // ── Wallet connection ────────────────────────────────────────────────────

  const handleConnectWallet = useCallback(async () => {
    try {
      const session = await connectWallet();
      setWalletPublicKey(session.publicKey);
      getSelahBalance(session.publicKey)
        .then(setSelahBalance)
        .catch(() => {});
    } catch (err) {
      Alert.alert(
        'Connection failed',
        'Could not connect to wallet app. Make sure a Solana wallet is installed (e.g. Phantom or Seeker).',
      );
    }
  }, []);

  // ── Give flow ────────────────────────────────────────────────────────────

  const handleGive = useCallback(
    async (amountSOL: number) => {
      if (!walletPublicKey) {
        handleConnectWallet();
        return;
      }
      if (!recipientAddress) {
        Alert.alert('No recipient', 'Please set a recipient address first.');
        return;
      }

      await daily.executeGiveFlow(amountSOL, recipientAddress, walletPublicKey);

      if (daily.phase !== 'error') {
        // Haptic celebration
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Refresh SELAH balance
        getSelahBalance(walletPublicKey)
          .then(setSelahBalance)
          .catch(() => {});
      }
    },
    [walletPublicKey, recipientAddress, daily, handleConnectWallet],
  );

  // ── Setup completion ─────────────────────────────────────────────────────

  const handleSetupComplete = useCallback(
    (data: {
      walletPublicKey: PublicKey;
      recipientAddress: string;
      recipientLabel: string;
      defaultAmount: number;
    }) => {
      setWalletPublicKey(data.walletPublicKey);
      setRecipientAddress(data.recipientAddress);
      setRecipientLabel(data.recipientLabel);
      setDefaultAmount(data.defaultAmount);
      setShowSetup(false);

      getSelahBalance(data.walletPublicKey)
        .then(setSelahBalance)
        .catch(() => {});
    },
    [],
  );

  // ── Recipient edit ───────────────────────────────────────────────────────

  const handleChangeRecipient = useCallback(() => {
    Alert.prompt(
      'Change recipient',
      'Enter a Solana wallet address:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (addr) => {
            if (!addr?.trim()) return;
            try {
              new PublicKey(addr.trim());
              setRecipientAddress(addr.trim());
              await AsyncStorage.setItem('setup:recipient:address', addr.trim());
              Alert.prompt(
                'Recipient label',
                'Give this address a name:',
                async (label) => {
                  const lbl = label?.trim() || 'My Church';
                  setRecipientLabel(lbl);
                  await AsyncStorage.setItem('setup:recipient:label', lbl);
                },
                'plain-text',
                recipientLabel,
              );
            } catch {
              Alert.alert('Invalid address', 'Please enter a valid Solana public key.');
            }
          },
        },
      ],
      'plain-text',
      recipientAddress,
    );
  }, [recipientAddress, recipientLabel]);

  // ── Render ───────────────────────────────────────────────────────────────

  if (!isInitialized) {
    return <View style={styles.loadingRoot} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />

      <SetupModal visible={showSetup} onComplete={handleSetupComplete} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* TOP: Verse */}
        <VerseCard
          verse={daily.verse}
          isLoading={daily.phase === 'loading'}
        />

        {/* MIDDLE: Reflection */}
        {(daily.reflection || daily.isStreamingReflection) && (
          <Reflection
            text={daily.reflection}
            isStreaming={daily.isStreamingReflection}
            onRetry={daily.retryReflection}
          />
        )}

        {/* BOTTOM: Give + Streak */}
        {daily.phase !== 'loading' && (
          <>
            <GiveButton
              phase={daily.phase}
              isWalletConnected={!!walletPublicKey}
              defaultAmount={defaultAmount}
              recipientLabel={recipientLabel}
              onConnectWallet={handleConnectWallet}
              onGive={handleGive}
              onChangeRecipient={handleChangeRecipient}
              errorMessage={daily.errorMessage}
              onClearError={daily.clearError}
            />

            <StreakBadge streak={streak} selahBalance={selahBalance} />
          </>
        )}

        {/* SCROLL DOWN: Journal */}
        <JournalList entries={daily.journal} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  loadingRoot: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  scrollContent: {
    flexGrow: 1,
  },
});
