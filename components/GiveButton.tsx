import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { DailyPhase } from '../hooks/useDailyState';

interface Props {
  phase: DailyPhase;
  isWalletConnected: boolean;
  defaultAmount: number;
  recipientLabel: string;
  onConnectWallet: () => void;
  onGive: (amountSOL: number) => void;
  onChangeRecipient: () => void;
  errorMessage: string | null;
  onClearError: () => void;
}

export default function GiveButton({
  phase,
  isWalletConnected,
  defaultAmount,
  recipientLabel,
  onConnectWallet,
  onGive,
  onChangeRecipient,
  errorMessage,
  onClearError,
}: Props) {
  const [amount, setAmount] = useState(defaultAmount.toString());

  const isLoading =
    phase === 'signing' || phase === 'minting' || phase === 'connecting';
  const isComplete = phase === 'complete';
  const isDisabled = isLoading || isComplete || phase === 'loading';

  function handleGive() {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid SOL amount greater than 0.');
      return;
    }
    if (parsed > 10) {
      Alert.alert(
        'Large amount',
        `You're about to give ${parsed} SOL. Are you sure?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Give', onPress: () => onGive(parsed) },
        ],
      );
      return;
    }
    onGive(parsed);
  }

  function getButtonLabel(): string {
    if (!isWalletConnected) return 'Connect Wallet';
    if (isComplete) return 'Done for today ✓';
    if (phase === 'signing') return 'Waiting for signature…';
    if (phase === 'minting') return 'Minting SELAH…';
    if (phase === 'connecting') return 'Connecting…';
    return 'Give + Receive SELAH';
  }

  return (
    <View style={styles.container}>
      {/* Divider */}
      <View style={styles.divider} />

      {/* Error message */}
      {errorMessage && (
        <TouchableOpacity style={styles.errorBanner} onPress={onClearError}>
          <Text style={styles.errorText}>⚠ {errorMessage}</Text>
          <Text style={styles.errorDismiss}>Tap to dismiss</Text>
        </TouchableOpacity>
      )}

      {/* Amount row */}
      {!isComplete && (
        <View style={styles.amountRow}>
          <View style={styles.amountInputWrap}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={(val) => {
                onClearError();
                setAmount(val);
              }}
              keyboardType="decimal-pad"
              editable={!isDisabled}
              selectTextOnFocus
              maxLength={8}
            />
            <Text style={styles.solLabel}>SOL</Text>
          </View>
          <Text style={styles.arrowLabel}>→</Text>
          <TouchableOpacity
            style={styles.recipientChip}
            onPress={onChangeRecipient}
            disabled={isDisabled}
          >
            <Text style={styles.recipientText} numberOfLines={1}>
              {recipientLabel || 'Set recipient'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main button */}
      <TouchableOpacity
        style={[
          styles.button,
          isComplete && styles.buttonComplete,
          isDisabled && !isComplete && styles.buttonDisabled,
        ]}
        onPress={!isWalletConnected ? onConnectWallet : handleGive}
        disabled={isDisabled}
        activeOpacity={0.82}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={[styles.buttonText, isComplete && styles.buttonTextComplete]}>
            {getButtonLabel()}
          </Text>
        )}
      </TouchableOpacity>

      {/* SOL hint */}
      {!isComplete && !isLoading && (
        <Text style={styles.hint}>
          ~0.000005 SOL mint fee • devnet
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#EBEBEA',
    marginBottom: 20,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 13,
    color: '#B91C1C',
    fontWeight: '500',
  },
  errorDismiss: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 2,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
    minWidth: 90,
  },
  amountInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444441',
    minWidth: 50,
    padding: 0,
  },
  solLabel: {
    fontSize: 14,
    color: '#9E9E97',
    fontWeight: '500',
  },
  arrowLabel: {
    fontSize: 16,
    color: '#ADADAA',
  },
  recipientChip: {
    flex: 1,
    backgroundColor: '#F2F2F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  recipientText: {
    fontSize: 13,
    color: '#444441',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#534AB7',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#534AB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonComplete: {
    backgroundColor: '#0F6E56',
    shadowColor: '#0F6E56',
  },
  buttonDisabled: {
    backgroundColor: '#B0AAD8',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  buttonTextComplete: {
    fontWeight: '600',
  },
  hint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#ADADAA',
    marginTop: 8,
  },
});
