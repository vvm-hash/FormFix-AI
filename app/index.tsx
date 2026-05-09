import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { GradientButton } from "../components/GradientButton";
import { COLORS } from "../constants/colors";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(24)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(24)).current;
  const orb1Scale = useRef(new Animated.Value(0.85)).current;
  const orb2Scale = useRef(new Animated.Value(0.9)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(slideUp, {
          toValue: 0,
          useNativeDriver: true,
          speed: 12,
          bounciness: 4,
        }),
      ]),
      Animated.parallel([
        Animated.timing(subtitleFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleSlide, {
          toValue: 0,
          useNativeDriver: true,
          speed: 14,
          bounciness: 3,
        }),
        Animated.timing(lineWidth, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonFade, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.spring(buttonSlide, {
          toValue: 0,
          useNativeDriver: true,
          speed: 14,
          bounciness: 4,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Scale, {
          toValue: 1.12,
          duration: 3200,
          useNativeDriver: true,
        }),
        Animated.timing(orb1Scale, {
          toValue: 0.85,
          duration: 3200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orb2Scale, {
          toValue: 1.1,
          duration: 2600,
          useNativeDriver: true,
        }),
        Animated.timing(orb2Scale, {
          toValue: 0.88,
          duration: 2600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animatedLineWidth = lineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "56%"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <Animated.View
        style={[
          styles.orb1,
          { transform: [{ scale: orb1Scale }] },
        ]}
      >
        <LinearGradient
          colors={["#00F5D420", "#7B61FF08"]}
          style={styles.orbGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.orb2,
          { transform: [{ scale: orb2Scale }] },
        ]}
      >
        <LinearGradient
          colors={["#7B61FF18", "#00F5D40A"]}
          style={styles.orbGradient}
        />
      </Animated.View>

      <View style={styles.gridOverlay}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={styles.gridLine} />
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>AI POWERED</Text>
          </View>
        </View>

        <Animated.View
          style={{
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
          }}
        >
          <Text style={styles.wordForm}>FORM</Text>
          <View style={styles.fixRow}>
            <Text style={styles.wordFix}>FIX</Text>
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiPill}
            >
              <Text style={styles.aiPillText}>AI</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.dividerRow,
            { width: animatedLineWidth },
          ]}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.divider}
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: subtitleFade,
            transform: [{ translateY: subtitleSlide }],
            alignItems: "center",
          }}
        >
          <Text style={styles.subtitle}>Analyze. Detect. Prevent.</Text>
          <Text style={styles.tagline}>
            Real-time movement intelligence{"\n"}for peak athletic performance.
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.buttonWrapper,
            {
              opacity: buttonFade,
              transform: [{ translateY: buttonSlide }],
            },
          ]}
        >
          <GradientButton
            title="Get Started"
            onPress={() => router.push("/(auth)/login")}
          />

          <View style={styles.hintRow}>
            <View style={styles.hintDot} />
            <Text style={styles.hintText}>No equipment required</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerDot} />
        <View style={[styles.footerDot, styles.footerDotActive]} />
        <View style={styles.footerDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  orb1: {
    position: "absolute",
    top: -height * 0.12,
    right: -width * 0.25,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    overflow: "hidden",
  },
  orb2: {
    position: "absolute",
    bottom: height * 0.05,
    left: -width * 0.3,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    overflow: "hidden",
  },
  orbGradient: {
    flex: 1,
    borderRadius: width * 0.45,
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  gridLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#1F293720",
    marginHorizontal: 0,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  badgeRow: {
    marginBottom: 28,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#00F5D412",
    borderWidth: 1,
    borderColor: "#00F5D430",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2.5,
  },
  wordForm: {
    fontSize: 72,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -1,
    textAlign: "center",
    lineHeight: 72,
  },
  fixRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  wordFix: {
    fontSize: 72,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -1,
    lineHeight: 80,
  },
  aiPill: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  aiPillText: {
    color: COLORS.background,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
  },
  dividerRow: {
    height: 2,
    marginVertical: 28,
    borderRadius: 2,
    overflow: "hidden",
    alignSelf: "center",
  },
  divider: {
    flex: 1,
    height: 2,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 12,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 48,
    alignItems: "center",
    gap: 20,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hintDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  hintText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: 36,
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  footerDotActive: {
    width: 20,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
});