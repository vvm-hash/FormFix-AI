import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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

type Severity = "low" | "medium" | "high";

interface RiskCardProps {
  title: string;
  severity: Severity;
  description: string;
  style?: ViewStyle;
}

const SEVERITY_CONFIG: Record<
  Severity,
  { color: string; label: string; icon: string; gradientColors: [string, string] }
> = {
  low: {
    color: COLORS.primary,
    label: "Low Risk",
    icon: "✓",
    gradientColors: ["#00F5D412", "#00F5D405"],
  },
  medium: {
    color: "#FF9F43",
    label: "Medium Risk",
    icon: "⚠",
    gradientColors: ["#FF9F4312", "#FF9F4305"],
  },
  high: {
    color: COLORS.danger,
    label: "High Risk",
    icon: "✕",
    gradientColors: ["#FF4D6D18", "#FF4D6D05"],
  },
};

export function RiskCard({ title, severity, description, style }: RiskCardProps) {
  const config = SEVERITY_CONFIG[severity];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 4 }),
    ]).start();

    if (severity === "high") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.25, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [severity]);

  const barSegments = severity === "low" ? 1 : severity === "medium" ? 2 : 3;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        style,
        {
          borderColor: `${config.color}35`,
          shadowColor: config.color,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={config.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.topRow}>
          <View style={styles.leftSection}>
            <View style={[styles.iconWrap, { backgroundColor: `${config.color}18`, borderColor: `${config.color}40` }]}>
              {severity === "high" ? (
                <Animated.Text style={[styles.iconText, { color: config.color, transform: [{ scale: pulseAnim }] }]}>
                  {config.icon}
                </Animated.Text>
              ) : (
                <Text style={[styles.iconText, { color: config.color }]}>{config.icon}</Text>
              )}
            </View>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>{title}</Text>
              <View style={[styles.severityBadge, { backgroundColor: `${config.color}14`, borderColor: `${config.color}35` }]}>
                <View style={[styles.severityDot, { backgroundColor: config.color, shadowColor: config.color }]} />
                <Text style={[styles.severityLabel, { color: config.color }]}>{config.label}</Text>
              </View>
            </View>
          </View>

          <View style={styles.barStack}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.barSegment,
                  {
                    backgroundColor: i < barSegments ? config.color : COLORS.border,
                    shadowColor: i < barSegments ? config.color : "transparent",
                    shadowOpacity: i < barSegments ? 0.7 : 0,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 0 },
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: `${config.color}18` }]} />

        <Text style={styles.description}>{description}</Text>

        <View style={[styles.accentBar, { backgroundColor: config.color }]} />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: COLORS.card,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  gradient: {
    padding: 16,
    position: "relative",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 16,
    fontWeight: "800",
  },
  titleBlock: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    borderWidth: 1,
  },
  severityDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  severityLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  barStack: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    marginTop: 4,
  },
  barSegment: {
    width: 6,
    height: 20,
    borderRadius: 3,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
});