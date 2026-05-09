import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

const COLORS = {
  background: "#0B0F1A",
  card: "#121826",
  primary: "#00F5D4",
  accent: "#7B61FF",
  danger: "#FF4D6D",
  textPrimary: "#FFFFFF",
  textSecondary: "#A0AEC0",
  border: "#1F2937",
};

interface LoadingAnimationProps {
  text?: string;
}

export function LoadingAnimation({ text }: LoadingAnimationProps) {
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;
  const corePulse = useRef(new Animated.Value(0.85)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulseRing = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 1800,
              useNativeDriver: true,
              easing: Easing.out(Easing.ease),
            }),
          ]),
        ])
      );

    pulseRing(ring1, 0).start();
    pulseRing(ring2, 600).start();
    pulseRing(ring3, 1200).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(corePulse, { toValue: 1.1, duration: 900, useNativeDriver: true }),
        Animated.timing(corePulse, { toValue: 0.85, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(textOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(textOpacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const makeRingStyle = (anim: Animated.Value, size: number) => ({
    position: "absolute" as const,
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.7, 0.3, 0] }),
    transform: [
      {
        scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.8] }),
      },
    ],
  });

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={styles.container}>
      <View style={styles.ringContainer}>
        <Animated.View style={makeRingStyle(ring1, 80)} />
        <Animated.View style={makeRingStyle(ring2, 80)} />
        <Animated.View style={makeRingStyle(ring3, 80)} />

        <Animated.View
          style={[styles.orbitRing, { transform: [{ rotate: spin }] }]}
        >
          <View style={styles.orbitDot} />
        </Animated.View>

        <Animated.View style={[styles.core, { transform: [{ scale: corePulse }] }]}>
          <View style={styles.coreInner}>
            <Text style={styles.coreIcon}>⚡</Text>
          </View>
        </Animated.View>
      </View>

      {text !== undefined && (
        <Animated.Text style={[styles.text, { opacity: textOpacity }]}>
          {text || "Processing..."}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  ringContainer: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  orbitRing: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: `${COLORS.accent}40`,
    borderStyle: "dashed",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  orbitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    marginRight: -4,
  },
  core: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${COLORS.primary}18`,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  coreInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  coreIcon: {
    fontSize: 18,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});