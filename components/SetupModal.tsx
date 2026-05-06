import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connectWallet } from '../services/mwa';
import { PublicKey } from '@solana/web3.js';

const SETUP_KEY = 'setup:complete';
const RECIPIENT_KEY = 'setup:recipient:address';
const RECIPIENT_LABEL_KEY = 'setup:recipient:label';
const DEFAULT_AMOUNT_KEY = 'setup:default_amount';

const DEFAULT_DEVNET_RECIPIENT = 'EkNsHkU3Lf5jyvCBBSXjA2DTXRN2YBZrwqVo8PodMtq';

export async function isSetupComplete(): Promise<boolean> {
  const val = await AsyncStorage.getItem(SETUP_KEY);
  return val === 'true';
}

export async function getSetupData(): Promise<{
  recipientAddress: string;
  recipientLabel: string;
  defaultAmount: number;
}> {
  const [addr, label, amt] = await Promise.all([
    AsyncStorage.getItem(RECIPIENT_KEY),
    AsyncStorage.getItem(RECIPIENT_LABEL_KEY),
    AsyncStorage.getItem(DEFAULT_AMOUNT_KEY),
  ]);
  return {
    recipientAddress: addr ?? DEFAULT_DEVNET_RECIPIENT,
    recipientLabel: label ?? 'Demo Recipient (devnet)',
    defaultAmount: amt ? parseFloat(amt) : 0.01,
  };
}

interface Props {
  visible: boolean;
  onComplete: (data: {
    walletPublicKey: PublicKey;
    recipientAddress: string;
    recipientLabel: string;
    defaultAmount: number;
  }) => void;
}

type SetupStep = 'welcome' | 'wallet' | 'amount' | 'recipient' | 'done';

export default function SetupModal({ visible, onComplete }: Props) {
  const [step, setStep] = useState<SetupStep>('welcome');
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletPublicKey, setWalletPublicKey] = useState<PublicKey | null>(null);
  const [defaultAmount, setDefaultAmount] = useState(0.01);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientLabel, setRecipientLabel] = useState('');
  const [recipientError, setRecipientError] = useState('');

  function amountLabel(val: number): string {
    return `${val.toFixed(3)} SOL`;
  }

  async function handleConnectWallet() {
    setIsConnecting(true);
    try {
      const session = await connectWallet();
      setWalletPublicKey(session.publicKey);
      setStep('amount');
    } catch (err) {
      Alert.alert(
        'Wallet connection failed',
        err instanceof Error ? err.message : 'Could not connect to wallet app.',
      );
    } finally {
      setIsConnecting(false);
    }
  }

  function handleAmountContinue() {
    setStep('recipient');
  }

  function handleRecipientContinue() {
    const addr = recipientAddress.trim();
    if (!addr) {
      // Use devnet default for demo
      setRecipientAddress(DEFAULT_DEVNET_RECIPIENT);
      setRecipientLabel('Demo Recipient (devnet)');
      completeSetup(DEFAULT_DEVNET_RECIPIENT, 'Demo Recipient (devnet)');
      return;
    }
    try {
      new PublicKey(addr);
      setRecipientError('');
      completeSetup(addr, recipientLabel.trim() || 'My Church/Charity');
    } catch {
      setRecipientError('Please enter a valid Solana wallet address.');
    }
  }

  async function completeSetup(addr: string, label: string) {
    await Promise.all([
      AsyncStorage.setItem(SETUP_KEY, 'true'),
      AsyncStorage.setItem(RECIPIENT_KEY, addr),
      AsyncStorage.setItem(RECIPIENT_LABEL_KEY, label),
      AsyncStorage.setItem(DEFAULT_AMOUNT_KEY, defaultAmount.toString()),
    ]);
    setStep('done');
    setTimeout(() => {
      onComplete({
        walletPublicKey: walletPublicKey!,
        recipientAddress: addr,
        recipientLabel: label,
        defaultAmount,
      });
    }, 800);
  }

  const amountOptions = [0.001, 0.005, 0.01, 0.025, 0.05, 0.1];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'welcome' && (
          <View style={styles.stepContainer}>
            <Text style={styles.selahHero}>SELAH</Text>
            <Text style={styles.hebrewGloss}>sē-läh  •  Hebrew</Text>
            <Text style={styles.meaning}>
              Pause. Breathe. Let this land.
            </Text>
            <Text style={styles.body}>
              Every day: one verse, one reflection, one gift to someone you
              choose, and one SELAH token — a soul-bound record that you showed up.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setStep('wallet')}
            >
              <Text style={styles.primaryButtonText}>Get started</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'wallet' && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>1 of 3</Text>
            <Text style={styles.stepTitle}>Connect your wallet</Text>
            <Text style={styles.stepBody}>
              Selah uses your Solana wallet for signing transactions. Your
              private keys never leave your wallet app.
            </Text>
            <TouchableOpacity
              style={[styles.primaryButton, isConnecting && styles.buttonDisabled]}
              onPress={handleConnectWallet}
              disabled={isConnecting}
            >
              <Text style={styles.primaryButtonText}>
                {isConnecting ? 'Connecting…' : 'Connect wallet'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'amount' && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>2 of 3</Text>
            <Text style={styles.stepTitle}>Set your default giving amount</Text>
            <Text style={styles.stepBody}>
              This is how much SOL you'll give each day. You can always
              adjust it before each transaction.
            </Text>
            <View style={styles.amountGrid}>
              {amountOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.amountOption,
                    defaultAmount === opt && styles.amountOptionSelected,
                  ]}
                  onPress={() => setDefaultAmount(opt)}
                >
                  <Text
                    style={[
                      styles.amountOptionText,
                      defaultAmount === opt && styles.amountOptionTextSelected,
                    ]}
                  >
                    {amountLabel(opt)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.selectedAmount}>
              Giving {amountLabel(defaultAmount)} per day
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAmountContinue}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'recipient' && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>3 of 3</Text>
            <Text style={styles.stepTitle}>Choose a recipient</Text>
            <Text style={styles.stepBody}>
              Enter the Solana wallet address of the church or charity you
              want to give to. Leave blank to use the demo address for now.
            </Text>
            <TextInput
              style={[styles.textInput, recipientError ? styles.textInputError : undefined]}
              placeholder="Solana wallet address (base58)"
              placeholderTextColor="#ADADAA"
              value={recipientAddress}
              onChangeText={(v) => {
                setRecipientAddress(v);
                setRecipientError('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              multiline={false}
            />
            {recipientError ? (
              <Text style={styles.errorText}>{recipientError}</Text>
            ) : null}
            <TextInput
              style={styles.textInput}
              placeholder="Label (e.g. 'My Church')"
              placeholderTextColor="#ADADAA"
              value={recipientLabel}
              onChangeText={setRecipientLabel}
              maxLength={40}
            />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleRecipientContinue}
            >
              <Text style={styles.primaryButtonText}>
                {recipientAddress.trim() ? 'Save recipient' : 'Use demo address'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'done' && (
          <View style={styles.stepContainer}>
            <Text style={styles.doneEmoji}>✦</Text>
            <Text style={styles.stepTitle}>You're set.</Text>
            <Text style={styles.stepBody}>
              Your first verse is waiting. Pause. Reflect. Give. Receive.
            </Text>
          </View>
        )}
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 32,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    minHeight: 500,
  },
  selahHero: {
    fontSize: 52,
    fontWeight: '800',
    color: '#534AB7',
    letterSpacing: 6,
    textAlign: 'center',
  },
  hebrewGloss: {
    fontSize: 13,
    color: '#9E9E97',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  meaning: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444441',
    textAlign: 'center',
    marginTop: 4,
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666660',
    textAlign: 'center',
    marginTop: 8,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#534AB7',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#444441',
    textAlign: 'center',
  },
  stepBody: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666660',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#534AB7',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
    shadowColor: '#534AB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#B0AAD8',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 8,
  },
  amountOption: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DDDDD8',
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  amountOptionSelected: {
    borderColor: '#534AB7',
    backgroundColor: '#EDE9FE',
  },
  amountOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444441',
  },
  amountOptionTextSelected: {
    color: '#534AB7',
    fontWeight: '700',
  },
  selectedAmount: {
    fontSize: 13,
    color: '#9E9E97',
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DDDDD8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#444441',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  textInputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginTop: -8,
  },
  doneEmoji: {
    fontSize: 48,
    color: '#534AB7',
    textAlign: 'center',
  },
});
