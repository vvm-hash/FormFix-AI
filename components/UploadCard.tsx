import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ViewStyle,
} from "react-native";
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

interface UploadCardProps {
  title: string;
  uploaded: boolean;
  onUpload: () => void;
  onRecord: () => void;
  accentColor?: string;
  style?: ViewStyle;
}

export function UploadCard({
  title,
  uploaded,
  onUpload,
  onRecord,
  accentColor = COLORS.primary,
  style,
}: UploadCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 4 }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: uploaded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (uploaded) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [uploaded]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, accentColor],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          borderColor,
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: uploaded ? 0.3 : 0,
          shadowRadius: 12,
          elevation: uploaded ? 6 : 0,
        },
      ]}
    >
      <LinearGradient
        colors={uploaded ? [`${accentColor}12`, `${accentColor}06`] : ["#12182600", "#12182600"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={[styles.titleRow]}>
            <View style={[styles.angleIndicator, { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40` }]}>
              <Text style={[styles.angleIcon, { color: accentColor }]}>◉</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={[styles.statusBadge, uploaded && { backgroundColor: `${accentColor}15`, borderColor: `${accentColor}40` }]}>
            <View style={[styles.statusDot, { backgroundColor: uploaded ? accentColor : COLORS.border }]} />
            <Text style={[styles.statusText, uploaded && { color: accentColor }]}>
              {uploaded ? "Ready" : "Empty"}
            </Text>
          </View>
        </View>

        <View style={styles.previewArea}>
          {uploaded ? (
            <View style={styles.uploadedPreview}>
              <Animated.View style={[styles.playIconWrap, { transform: [{ scale: pulseAnim }], borderColor: `${accentColor}50`, backgroundColor: `${accentColor}15` }]}>
                <Text style={[styles.playIcon, { color: accentColor }]}>▶</Text>
              </Animated.View>
              <Text style={styles.uploadedLabel}>1 clip uploaded</Text>
              <View style={styles.uploadedBadgeRow}>
                <View style={styles.uploadedBadgeDot} />
                <Text style={styles.uploadedBadgeText}>Clip_001.mp4</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyPreview}>
              <View style={styles.emptyIconWrap}>
                <Text style={styles.emptyIcon}>+</Text>
              </View>
              <Text style={styles.emptyLabel}>No video added</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={onUpload}
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.75 }]}
          >
            <LinearGradient
              colors={[`${accentColor}20`, `${accentColor}08`]}
              style={styles.actionBtnGradient}
            >
              <Text style={[styles.actionIcon, { color: accentColor }]}>↑</Text>
              <Text style={[styles.actionLabel, { color: accentColor }]}>Upload</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={onRecord}
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.75 }]}
          >
            <View style={[styles.actionBtnOutline]}>
              <Text style={styles.actionIcon}>⬤</Text>
              <Text style={styles.actionLabel}>Record</Text>
            </View>
          </Pressable>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: COLORS.card,
    overflow: "hidden",
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  angleIndicator: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  angleIcon: {
    fontSize: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.border,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  previewArea: {
    height: 80,
    borderRadius: 10,
    backgroundColor: "#0B0F1A80",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  uploadedPreview: {
    alignItems: "center",
    gap: 6,
  },
  playIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    fontSize: 12,
    marginLeft: 2,
  },
  uploadedLabel: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  uploadedBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  uploadedBadgeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  uploadedBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  emptyPreview: {
    alignItems: "center",
    gap: 6,
  },
  emptyIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: "300",
  },
  emptyLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  actionBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: `${COLORS.primary}25`,
    borderRadius: 10,
  },
  actionBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: "#1F293730",
  },
  actionIcon: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  actionLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});