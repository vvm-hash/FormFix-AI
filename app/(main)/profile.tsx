import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const { width: SCREEN_W } = Dimensions.get("window");

const COLORS = {
  background: "#0B0F1A",
  card: "#121826",
  cardElevated: "#161D2E",
  primary: "#00F5D4",
  accent: "#7B61FF",
  danger: "#FF4D6D",
  warning: "#FF9800",
  textPrimary: "#FFFFFF",
  textSecondary: "#A0AEC0",
  border: "#1F2937",
};

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────

const ATHLETE = {
  name: "V M",
  level: "Amateur Athlete",
  memberSince: "Jan 2025",
  tags: ["Running", "Strength Training", "HIIT"],
  initials: "VM",
};

const STATS = [
  {
    id: "s1",
    label: "Total Analyses",
    value: "24",
    unit: "",
    color: COLORS.primary,
    icon: "◈",
  },
  {
    id: "s2",
    label: "High Risk Flags",
    value: "7",
    unit: "",
    color: COLORS.danger,
    icon: "⚠",
  },
  {
    id: "s3",
    label: "Improvement",
    value: "68",
    unit: "%",
    color: COLORS.accent,
    icon: "▲",
  },
  {
    id: "s4",
    label: "Exercises",
    value: "12",
    unit: "",
    color: COLORS.warning,
    icon: "⟳",
  },
];

const SESSIONS = [
  {
    id: "sess1",
    exercise: "Running Gait",
    category: "Cardio",
    riskScore: 72,
    severity: "high" as const,
    date: "May 7, 2025",
    angles: 3,
    issues: 4,
  },
  {
    id: "sess2",
    exercise: "Squat Mechanics",
    category: "Strength",
    riskScore: 45,
    severity: "medium" as const,
    date: "May 3, 2025",
    angles: 2,
    issues: 2,
  },
  {
    id: "sess3",
    exercise: "Deadlift Form",
    category: "Strength",
    riskScore: 58,
    severity: "medium" as const,
    date: "Apr 29, 2025",
    angles: 3,
    issues: 3,
  },
  {
    id: "sess4",
    exercise: "Box Jump Landing",
    category: "Plyometric",
    riskScore: 31,
    severity: "low" as const,
    date: "Apr 22, 2025",
    angles: 2,
    issues: 1,
  },
];

const AI_INSIGHTS = [
  {
    id: "ai1",
    label: "Most Recurring Issue",
    value: "Knee Valgus Collapse",
    detail: "Detected in 4 of 5 lower-body analyses",
    color: COLORS.danger,
    icon: "⟆",
  },
  {
    id: "ai2",
    label: "Best Improvement Area",
    value: "Core Engagement",
    detail: "42% improvement over last 30 days",
    color: COLORS.primary,
    icon: "✦",
  },
  {
    id: "ai3",
    label: "AI Performance Summary",
    value: "Above Average",
    detail: "Top 34% of athletes in your category",
    color: COLORS.accent,
    icon: "◎",
  },
];

const PROGRESS_METRICS = [
  { id: "p1", label: "Posture Stability Score", value: 74, max: 100, color: COLORS.primary },
  { id: "p2", label: "Injury Risk Reduction", value: 61, max: 100, color: COLORS.accent },
  { id: "p3", label: "Form Consistency", value: 83, max: 100, color: COLORS.warning },
  { id: "p4", label: "Biomechanical Balance", value: 55, max: 100, color: COLORS.danger },
];

const SETTINGS_ITEMS = [
  { id: "set1", icon: "⬡", label: "Export Reports", sub: "Download your analysis PDFs", color: COLORS.primary },
  { id: "set2", icon: "◉", label: "Notifications", sub: "Manage alerts and reminders", color: COLORS.accent },
  { id: "set3", icon: "◈", label: "About FORMFIX AI", sub: "Version 1.0.0  ·  Build 2025", color: COLORS.textSecondary },
  { id: "set4", icon: "⊛", label: "Privacy & Data", sub: "Manage your data and permissions", color: COLORS.textSecondary },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

type Severity = "low" | "medium" | "high" | "critical";

function getRiskColor(severity: Severity): string {
  switch (severity) {
    case "critical": return "#FF1744";
    case "high": return COLORS.danger;
    case "medium": return COLORS.warning;
    case "low": return COLORS.primary;
    default: return COLORS.textSecondary;
  }
}

function getSeverityLabel(severity: Severity): string {
  switch (severity) {
    case "critical": return "CRITICAL";
    case "high": return "HIGH RISK";
    case "medium": return "MODERATE";
    case "low": return "LOW RISK";
    default: return "UNKNOWN";
  }
}

// ─────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────

const SectionLabel: React.FC<{ title: string; accent?: string }> = ({
  title,
  accent = COLORS.primary,
}) => (
  <View style={styles.sectionLabelRow}>
    <View style={[styles.sectionAccentBar, { backgroundColor: accent }]} />
    <Text style={styles.sectionLabelText}>{title}</Text>
  </View>
);

// — Avatar
const AthleteAvatar: React.FC = () => {
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    
    <View style={styles.avatarWrapper}>
      <Animated.View
        style={[styles.avatarSpinRing, { transform: [{ rotate }] }]}
      />
      <LinearGradient
        colors={[COLORS.primary, COLORS.accent]}
        style={styles.avatarGradientRing}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.avatarInner}>
          <LinearGradient
            colors={["#1A2236", COLORS.cardElevated]}
            style={styles.avatarBackground}
          >
            <Text style={styles.avatarInitials}>{ATHLETE.initials}</Text>
          </LinearGradient>
        </View>
      </LinearGradient>
      <View style={styles.avatarOnlineDot} />
    </View>
  );
};

// — Stat Card
const StatCard: React.FC<{
  label: string;
  value: string;
  unit: string;
  color: string;
  icon: string;
  delay: number;
}> = ({ label, value, unit, color, icon, delay }) => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCard,
        { opacity: fadeIn, transform: [{ translateY: slideUp }] },
      ]}
    >
      <LinearGradient
        colors={[`${color}10`, COLORS.card]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={[styles.statIconWrap, { backgroundColor: `${color}18`, borderColor: `${color}30` }]}>
        <Text style={[styles.statIcon, { color }]}>{icon}</Text>
      </View>
      <View style={styles.statValueRow}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        {unit ? <Text style={[styles.statUnit, { color }]}>{unit}</Text> : null}
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={[styles.statGlowLine, { backgroundColor: color }]} />
    </Animated.View>
  );
};

// — Session Card
const SessionCard: React.FC<{
  session: (typeof SESSIONS)[0];
  index: number;
}> = ({ session, index }) => {
  const color = getRiskColor(session.severity);
  const label = getSeverityLabel(session.severity);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 400, delay: index * 90, useNativeDriver: true }),
      Animated.timing(slideIn, { toValue: 0, duration: 400, delay: index * 90, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeIn, transform: [{ translateY: slideIn }] }]}>
      <LinearGradient
        colors={[`${color}0D`, COLORS.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.sessionCard, { borderColor: `${color}2A` }]}
      >
        <View style={[styles.sessionAccentBar, { backgroundColor: color }]} />

        <View style={styles.sessionBody}>
          <View style={styles.sessionTop}>
            <View style={styles.sessionTitleWrap}>
              <Text style={styles.sessionExercise}>{session.exercise}</Text>
              <View style={styles.sessionCategoryBadge}>
                <Text style={styles.sessionCategoryText}>{session.category}</Text>
              </View>
            </View>
            <View style={[styles.sessionSeverityPill, { backgroundColor: `${color}18`, borderColor: `${color}44` }]}>
              <Text style={[styles.sessionSeverityText, { color }]}>{label}</Text>
            </View>
          </View>

          <View style={styles.sessionMeta}>
            <Text style={styles.sessionDate}>{session.date}</Text>
            <View style={styles.sessionDot} />
            <Text style={styles.sessionMetaText}>{session.angles} angles</Text>
            <View style={styles.sessionDot} />
            <Text style={styles.sessionMetaText}>{session.issues} issues</Text>
          </View>

          <View style={styles.sessionRiskRow}>
            <View style={styles.sessionBarTrack}>
              <View
                style={[
                  styles.sessionBarFill,
                  { width: `${session.riskScore}%`, backgroundColor: color },
                ]}
              />
            </View>
            <Text style={[styles.sessionRiskVal, { color }]}>{session.riskScore}%</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// — AI Insight Card
const InsightCard: React.FC<{ insight: (typeof AI_INSIGHTS)[0]; index: number }> = ({
  insight,
  index,
}) => {
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 500,
      delay: 200 + index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeIn }}>
      <LinearGradient
        colors={[`${insight.color}0C`, COLORS.card]}
        style={[styles.insightCard, { borderColor: `${insight.color}28` }]}
      >
        <View style={[styles.insightIconWrap, { backgroundColor: `${insight.color}18` }]}>
          <Text style={[styles.insightIcon, { color: insight.color }]}>{insight.icon}</Text>
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightLabel}>{insight.label}</Text>
          <Text style={[styles.insightValue, { color: insight.color }]}>{insight.value}</Text>
          <Text style={styles.insightDetail}>{insight.detail}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// — Progress Bar Row
const ProgressRow: React.FC<{
  label: string;
  value: number;
  max: number;
  color: string;
  index: number;
}> = ({ label, value, max, color, index }) => {
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: value / max,
      duration: 800,
      delay: 300 + index * 120,
      useNativeDriver: false,
    }).start();
  }, []);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", `${(value / max) * 100}%`],
  });

  return (
    <View style={styles.progressRow}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={[styles.progressValue, { color }]}>{value}</Text>
      </View>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[styles.progressFill, { width: barWidth, backgroundColor: color }]}
        />
        <View style={[styles.progressGlow, { shadowColor: color }]} />
      </View>
    </View>
  );
};

// — Settings Row
const SettingsRow: React.FC<{ item: (typeof SETTINGS_ITEMS)[0] }> = ({ item }) => (
  <TouchableOpacity activeOpacity={0.75} style={styles.settingsRow}>
    <LinearGradient
      colors={[COLORS.cardElevated, COLORS.card]}
      style={styles.settingsRowInner}
    >
      <View style={[styles.settingsIconWrap, { backgroundColor: `${item.color}14`, borderColor: `${item.color}28` }]}>
        <Text style={[styles.settingsIcon, { color: item.color }]}>{item.icon}</Text>
      </View>
      <View style={styles.settingsTextWrap}>
        <Text style={styles.settingsLabel}>{item.label}</Text>
        <Text style={styles.settingsSub}>{item.sub}</Text>
      </View>
      <Text style={styles.settingsChevron}>›</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      {/* Ambient background gradient */}
      <LinearGradient
        colors={["#0E1320", "#0B0F1A", "#0D1122"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Top ambient glow */}
      <View style={styles.topAmbient} />
      <View style={styles.accentAmbient} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* ══════════════════════════════════
            1 · ATHLETE HEADER
        ══════════════════════════════════ */}
        <Animated.View
          style={[
            styles.athleteHeader,
            { opacity: headerFade, transform: [{ translateY: headerSlide }] },
          ]}
        >
          <LinearGradient
            colors={["rgba(0,245,212,0.07)", "rgba(123,97,255,0.05)", "transparent"]}
            style={styles.headerGradientBg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Top strip glow line */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent, "transparent"]}
            style={styles.headerTopLine}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />

          <View style={styles.headerContent}>
            <AthleteAvatar />

            <View style={styles.headerInfo}>
              <View style={styles.headerBadgeRow}>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✦ FORMFIX ATHLETE</Text>
                </View>
              </View>
              <Text style={styles.athleteName}>{ATHLETE.name}</Text>
              <Text style={styles.athleteLevel}>{ATHLETE.level}</Text>

              <View style={styles.tagsRow}>
                {ATHLETE.tags.map((tag) => (
                  <View key={tag} style={styles.tagPill}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.memberSince}>Member since {ATHLETE.memberSince}</Text>
            </View>
          </View>

          {/* Corner decorators */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </Animated.View>

        {/* ══════════════════════════════════
            2 · PERFORMANCE STATS
        ══════════════════════════════════ */}
        <View style={styles.section}>
          <SectionLabel title="PERFORMANCE STATS" accent={COLORS.primary} />
          <View style={styles.statsGrid}>
            {STATS.map((stat, i) => (
              <StatCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                unit={stat.unit}
                color={stat.color}
                icon={stat.icon}
                delay={i * 80}
              />
            ))}
          </View>
        </View>

        {/* ══════════════════════════════════
            3 · RECENT SESSIONS
        ══════════════════════════════════ */}
        <View style={styles.section}>
          <SectionLabel title="RECENT ANALYSIS SESSIONS" accent={COLORS.accent} />
          <View style={styles.sessionList}>
            {SESSIONS.map((sess, i) => (
              <SessionCard key={sess.id} session={sess} index={i} />
            ))}
          </View>
        </View>

        {/* ══════════════════════════════════
            4 · AI INSIGHTS
        ══════════════════════════════════ */}
        <View style={styles.section}>
          <SectionLabel title="AI INSIGHTS" accent={COLORS.primary} />
          <LinearGradient
            colors={[COLORS.cardElevated, COLORS.card]}
            style={styles.insightsCard}
          >
            <View style={styles.aiBadgeRow}>
              <View style={styles.aiPulseDot} />
              <Text style={styles.aiBadgeText}>FORMFIX INTELLIGENCE ENGINE</Text>
            </View>
            <View style={styles.insightsList}>
              {AI_INSIGHTS.map((ins, i) => (
                <InsightCard key={ins.id} insight={ins} index={i} />
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* ══════════════════════════════════
            5 · PROGRESS TRACKING
        ══════════════════════════════════ */}
        <View style={styles.section}>
          <SectionLabel title="PROGRESS TRACKING" accent={COLORS.accent} />
          <LinearGradient
            colors={[COLORS.cardElevated, COLORS.card]}
            style={styles.progressCard}
          >
            <View style={styles.progressTrendRow}>
              <View style={styles.progressTrendBadge}>
                <Text style={styles.progressTrendText}>↑ 14% vs Last Month</Text>
              </View>
              <Text style={styles.progressTrendSub}>30-day rolling average</Text>
            </View>
            {PROGRESS_METRICS.map((metric, i) => (
              <ProgressRow
                key={metric.id}
                label={metric.label}
                value={metric.value}
                max={metric.max}
                color={metric.color}
                index={i}
              />
            ))}
          </LinearGradient>
        </View>

        {/* ══════════════════════════════════
            6 · SETTINGS
        ══════════════════════════════════ */}
        <View style={styles.section}>
          <SectionLabel title="SETTINGS & MORE" accent={COLORS.textSecondary} />
          <View style={styles.settingsList}>
            {SETTINGS_ITEMS.map((item) => (
              <SettingsRow key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* ══════════════════════════════════
            7 · BOTTOM CTA
        ══════════════════════════════════ */}
        <TouchableOpacity
          style={styles.ctaWrapper}
          onPress={() => router.push("/(main)/exercises")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[COLORS.primary, "#00C4AA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>⟳  START NEW ANALYSIS</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const STAT_CARD_W = (SCREEN_W - 32 - 10) / 2;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topAmbient: {
    position: "absolute",
    top: -60,
    left: SCREEN_W / 2 - 100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(0,245,212,0.055)",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 70,
      },
    }),
  },
  accentAmbient: {
    position: "absolute",
    top: 200,
    right: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(123,97,255,0.04)",
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 0,
  },

  // ─ Section Label ─
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  sectionAccentBar: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  sectionLabelText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  section: {
    marginTop: 30,
  },

  // ─ Athlete Header ─
  athleteHeader: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    padding: 20,
    backgroundColor: COLORS.card,
  },
  headerGradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  headerTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  headerBadgeRow: {
    marginBottom: 2,
  },
  verifiedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,245,212,0.1)",
    borderWidth: 1,
    borderColor: "rgba(0,245,212,0.25)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  verifiedText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  athleteName: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  athleteLevel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  tagPill: {
    backgroundColor: "rgba(123,97,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(123,97,255,0.3)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  memberSince: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  corner: {
    position: "absolute",
    width: 12,
    height: 12,
    borderColor: COLORS.primary,
    opacity: 0.45,
  },
  cornerTL: { top: 8, left: 8, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: 8, right: 8, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: 8, left: 8, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: 8, right: 8, borderBottomWidth: 2, borderRightWidth: 2 },

  // ─ Avatar ─
  avatarWrapper: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarSpinRing: {
    position: "absolute",
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: "transparent",
    borderTopColor: COLORS.primary,
    borderRightColor: "rgba(0,245,212,0.3)",
    opacity: 0.6,
  },
  avatarGradientRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    flex: 1,
    width: "100%",
    borderRadius: 36,
    overflow: "hidden",
  },
  avatarBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  avatarOnlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.card,
  },

  // ─ Stats Grid ─
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    width: STAT_CARD_W,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 8,
    overflow: "hidden",
    backgroundColor: COLORS.card,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statIcon: {
    fontSize: 16,
    fontWeight: "900",
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 15,
  },
  statGlowLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.5,
  },

  // ─ Sessions ─
  sessionList: {
    gap: 10,
  },
  sessionCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: COLORS.card,
  },
  sessionAccentBar: {
    width: 3,
  },
  sessionBody: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  sessionTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  sessionTitleWrap: {
    flex: 1,
    gap: 4,
  },
  sessionExercise: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  sessionCategoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(160,174,192,0.1)",
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  sessionCategoryText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  sessionSeverityPill: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  sessionSeverityText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sessionDate: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  sessionDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.border,
  },
  sessionMetaText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  sessionRiskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  sessionBarTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    overflow: "hidden",
  },
  sessionBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  sessionRiskVal: {
    fontSize: 12,
    fontWeight: "800",
    minWidth: 34,
    textAlign: "right",
  },

  // ─ AI Insights ─
  insightsCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  aiBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  aiPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.primary,
  },
  aiBadgeText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    opacity: 0.85,
  },
  insightsList: {
    gap: 10,
  },
  insightCard: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
  },
  insightIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  insightIcon: {
    fontSize: 18,
    fontWeight: "900",
  },
  insightContent: {
    flex: 1,
    gap: 2,
  },
  insightLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  insightDetail: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },

  // ─ Progress ─
  progressCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 16,
  },
  progressTrendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressTrendBadge: {
    backgroundColor: "rgba(0,245,212,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,245,212,0.28)",
    borderRadius: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  progressTrendText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  progressTrendSub: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  progressRow: {
    gap: 7,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "500",
  },
  progressValue: {
    fontSize: 13,
    fontWeight: "800",
  },
  progressTrack: {
    height: 5,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
      },
    }),
  },

  // ─ Settings ─
  settingsList: {
    gap: 8,
  },
  settingsRow: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsRowInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  settingsIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  settingsIcon: {
    fontSize: 16,
  },
  settingsTextWrap: {
    flex: 1,
    gap: 2,
  },
  settingsLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  settingsSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  settingsChevron: {
    color: COLORS.textSecondary,
    fontSize: 22,
    fontWeight: "300",
    marginRight: -2,
  },

  // ─ CTA ─
  ctaWrapper: {
    marginTop: 32,
    borderRadius: 14,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  ctaButton: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
});