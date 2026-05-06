import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Verse } from '../services/youversion';

interface Props {
  verse: Verse | null;
  isLoading: boolean;
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function VerseCard({ verse, isLoading }: Props) {
  if (isLoading && !verse) {
    return (
      <View style={styles.container}>
        <Text style={styles.date}>{formatDate()}</Text>
        <View style={styles.skeletonRef} />
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: '80%' }]} />
        <View style={[styles.skeletonLine, { width: '65%' }]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formatDate()}</Text>
      {verse && (
        <>
          <Text style={styles.reference}>{verse.reference}</Text>
          <Text style={styles.verseText}>{verse.text}</Text>
          <Text style={styles.version}>{verse.version}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  date: {
    fontSize: 13,
    color: '#9E9E97',
    fontWeight: '400',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  reference: {
    fontSize: 15,
    fontWeight: '600',
    color: '#534AB7',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  verseText: {
    fontSize: 22,
    lineHeight: 34,
    color: '#444441',
    fontWeight: '400',
    marginBottom: 12,
  },
  version: {
    fontSize: 12,
    color: '#ADADAA',
    fontWeight: '400',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  // Loading skeletons
  skeletonRef: {
    height: 15,
    width: '30%',
    borderRadius: 6,
    backgroundColor: '#EBEBEA',
    marginBottom: 14,
  },
  skeletonLine: {
    height: 20,
    width: '100%',
    borderRadius: 6,
    backgroundColor: '#EBEBEA',
    marginBottom: 10,
  },
});
