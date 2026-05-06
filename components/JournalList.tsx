import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import type { JournalEntry } from '../hooks/useDailyState';

interface Props {
  entries: JournalEntry[];
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function JournalRow({ entry }: { entry: JournalEntry }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowDate}>{formatDisplayDate(entry.date)}</Text>
        <Text style={styles.rowVerse}>{entry.verseRef}</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowAmount}>
          {entry.amountSOL.toFixed(3)} SOL
        </Text>
        <View style={styles.tokenPill}>
          <Text style={styles.tokenPillText}>+1 SELAH</Text>
        </View>
      </View>
    </View>
  );
}

export default function JournalList({ entries }: Props) {
  const recent = entries.slice(0, 7);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Journal</Text>
        <Text style={styles.sectionSub}>Last {recent.length} days</Text>
      </View>

      {recent.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Complete your first giving moment to see your journal here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={recent}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => <JournalRow entry={item} />}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 48,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#444441',
    letterSpacing: 0.1,
  },
  sectionSub: {
    fontSize: 12,
    color: '#ADADAA',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowLeft: {
    flex: 1,
    gap: 2,
  },
  rowDate: {
    fontSize: 12,
    color: '#9E9E97',
    fontWeight: '500',
  },
  rowVerse: {
    fontSize: 14,
    color: '#444441',
    fontWeight: '500',
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rowAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F6E56',
  },
  tokenPill: {
    backgroundColor: '#EDE9FE',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  tokenPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#534AB7',
    letterSpacing: 0.3,
  },
  separator: {
    height: 1,
    backgroundColor: '#F2F2F0',
  },
  empty: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#ADADAA',
    textAlign: 'center',
    lineHeight: 20,
  },
});
