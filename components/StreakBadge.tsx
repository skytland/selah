import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  streak: number;
  selahBalance?: number;
}

export default function StreakBadge({ streak, selahBalance }: Props) {
  if (streak === 0 && !selahBalance) return null;

  return (
    <View style={styles.container}>
      {streak > 0 && (
        <View style={styles.badge}>
          <Text style={styles.flame}>🔥</Text>
          <Text style={styles.streakText}>
            {streak}-day streak
          </Text>
        </View>
      )}
      {selahBalance !== undefined && selahBalance > 0 && (
        <View style={styles.tokenBadge}>
          <Text style={styles.tokenCount}>{selahBalance}</Text>
          <Text style={styles.tokenLabel}>SELAH</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 5,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  flame: {
    fontSize: 14,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C2410C',
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 4,
    borderWidth: 1,
    borderColor: '#C4B5FD',
  },
  tokenCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#534AB7',
  },
  tokenLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
    letterSpacing: 0.8,
  },
});
