import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

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

function AuthButton({
  label,
  icon,
  onPress,
  variant,
}: {
  label: string;
  icon: string;
  onPress: () => void;
  variant: "primary" | "outline";
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

  return (
    <Animated.View style={[styles.authBtnWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {variant === "primary" ? (
          <LinearGradient
            colors={["#FFFFFF", "#F0F0F0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.authBtnPrimary}
          >
            <Text style={styles.authBtnPrimaryIcon}>{icon}</Text>
            <Text style={styles.authBtnPrimaryLabel}>{label}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.authBtnOutline}>
            <Text style={styles.authBtnOutlineIcon}>{icon}</Text>
            <Text style={styles.authBtnOutlineLabel}>{label}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function LoginScreen() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoSlide = useRef(new Animated.Value(-30)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(30)).current;
  const buttonsFade = useRef(new Animated.Value(0)).current;
  const orb1 = useRef(new Animated.Value(0.8)).current;
  const orb2 = useRef(new Animated.Value(0.9)).current;
  const scanLine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(logoSlide, { toValue: 0, useNativeDriver: true, speed: 12, bounciness: 4 }),
      ]),
      Animated.timing(subtitleFade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(cardFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(cardSlide, { toValue: 0, useNativeDriver: true, speed: 12, bounciness: 4 }),
      ]),
      Animated.timing(buttonsFade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1, { toValue: 1.1, duration: 3500, useNativeDriver: true }),
        Animated.timing(orb1, { toValue: 0.8, duration: 3500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orb2, { toValue: 1.12, duration: 2800, useNativeDriver: true }),
        Animated.timing(orb2, { toValue: 0.88, duration: 2800, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(scanLine, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.delay(800),
      ])
    ).start();
  }, []);

  const scanTranslate = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [-height * 0.4, height * 0.4],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <Animated.View style={[styles.orb1, { transform: [{ scale: orb1 }] }]}>
        <LinearGradient
          colors={["#00F5D412", "#7B61FF06"]}
          style={styles.orbGradient}
        />
      </Animated.View>
      <Animated.View style={[styles.orb2, { transform: [{ scale: orb2 }] }]}>
        <LinearGradient
          colors={["#7B61FF14", "#00F5D408"]}
          style={styles.orbGradient}
        />
      </Animated.View>

      <Animated.View
        style={[styles.scanLineWrapper, { transform: [{ translateY: scanTranslate }] }]}
      >
        <LinearGradient
          colors={["transparent", `${COLORS.primary}10`, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.scanLineGradient}
        />
      </Animated.View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoSection,
            { opacity: fadeAnim, transform: [{ translateY: logoSlide }] },
          ]}
        >
          <View style={styles.logoBadge}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBadgeGradient}
            >
              <Text style={styles.logoBadgeIcon}>⚡</Text>
            </LinearGradient>
          </View>
          <View style={styles.wordmarkRow}>
            <Text style={styles.wordmarkForm}>FORM</Text>
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.wordmarkFixPill}
            >
              <Text style={styles.wordmarkFix}>FIX</Text>
            </LinearGradient>
            <Text style={styles.wordmarkAI}> AI</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.subtitleBlock, { opacity: subtitleFade }]}>
          <Text style={styles.subtitle}>AI-Powered Sports Injury Prevention</Text>
          <View style={styles.tagRow}>
            {["Biomechanics", "Real-time", "Precision"].map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardFade,
              transform: [{ translateY: cardSlide }],
            },
          ]}
        >
          <LinearGradient
            colors={["#1C2333", "#121826"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderDot} />
              <Text style={styles.cardHeaderText}>Athlete Login</Text>
            </View>

            <View style={styles.featureRow}>
              {[
                { icon: "🎯", label: "Injury Detection" },
                { icon: "📊", label: "Form Analysis" },
                { icon: "⚡", label: "AI Insights" },
              ].map((feat) => (
                <View key={feat.label} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>{feat.icon}</Text>
                  <Text style={styles.featureLabel}>{feat.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.buttons, { opacity: buttonsFade }]}>
          <AuthButton
            label="Continue with Google"
            icon="G"
            onPress={() => router.replace("/(main)/home")}
            variant="primary"
          />
          <AuthButton
            label="Continue as Guest"
            icon="◎"
            onPress={() => router.replace("/(main)/home")}
            variant="outline"
          />
        </Animated.View>

        <Text style={styles.legal}>
          By continuing, you agree to our{" "}
          <Text style={styles.legalLink}>Terms of Service</Text> &{" "}
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </Text>
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
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    overflow: "hidden",
  },
  orb2: {
    position: "absolute",
    bottom: height * 0.05,
    left: -width * 0.25,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    overflow: "hidden",
  },
  orbGradient: { flex: 1, borderRadius: width * 0.425 },
  scanLineWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 60,
    top: 0,
    pointerEvents: "none",
  },
  scanLineGradient: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 36,
    gap: 24,
  },
  logoSection: {
    alignItems: "center",
    gap: 14,
  },
  logoBadge: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  logoBadgeGradient: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  logoBadgeIcon: { fontSize: 28 },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  wordmarkForm: {
    fontSize: 40,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  wordmarkFixPill: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  wordmarkFix: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.background,
    letterSpacing: -0.5,
  },
  wordmarkAI: {
    fontSize: 40,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  subtitleBlock: {
    alignItems: "center",
    gap: 12,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    letterSpacing: 0.3,
    fontWeight: "500",
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    backgroundColor: "#1F2937",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardGradient: {
    padding: 20,
    gap: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardHeaderDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  cardHeaderText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featureItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#0B0F1A60",
  },
  featureIcon: { fontSize: 20 },
  featureLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  buttons: {
    gap: 12,
  },
  authBtnWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  authBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    gap: 10,
    borderRadius: 16,
  },
  authBtnPrimaryIcon: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.background,
  },
  authBtnPrimaryLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.background,
    letterSpacing: 0.3,
  },
  authBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    gap: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  authBtnOutlineIcon: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  authBtnOutlineLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  legal: {
    textAlign: "center",
    color: `${COLORS.textSecondary}70`,
    fontSize: 11,
    lineHeight: 18,
  },
  legalLink: {
    color: COLORS.textSecondary,
    textDecorationLine: "underline",
  },
});