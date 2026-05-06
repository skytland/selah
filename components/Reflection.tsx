import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface Props {
  text: string;
  isStreaming: boolean;
  onRetry?: () => void;
}

/** Animated pulsing dots shown while the reflection is streaming. */
function PulsingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );

    const a1 = pulse(dot1, 0);
    const a2 = pulse(dot2, 160);
    const a3 = pulse(dot3, 320);
    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, []);

  return (
    <View style={dotStyles.row}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View key={i} style={[dotStyles.dot, { opacity: dot }]} />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#534AB7',
  },
});

export default function Reflection({ text, isStreaming }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      {isStreaming && text.length === 0 ? (
        <PulsingDots />
      ) : (
        <Text style={styles.reflectionText}>{text}</Text>
      )}
      {isStreaming && text.length > 0 && <PulsingDots />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingBottom: 24,
    minHeight: 80,
  },
  divider: {
    height: 1,
    backgroundColor: '#EBEBEA',
    marginBottom: 20,
  },
  reflectionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666660',
    fontStyle: 'italic',
    fontWeight: '400',
  },
});
