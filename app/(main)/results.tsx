import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  MOCK_ANALYSIS_RESULT,
  getRiskColor,
  getSeverityLevel,
  getCategoryMeta,
  formatAnalysisDate,
  type DetectedIssue,
  type InjuryRisk,
  type Recommendation,
  type CorrectiveExercise,
} from "@/services/analysis";

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
  textPrimary: "#FFFFFF",
  textSecondary: "#A0AEC0",
  border: "#1F2937",
  overlay: "rgba(0,245,212,0.06)",
  dangerOverlay: "rgba(255,77,109,0.08)",
  accentOverlay: "rgba(123,97,255,0.08)",
};

// ─────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────

// — Section Label
const SectionLabel: React.FC<{ title: string; accent?: string }> = ({
  title,
  accent = COLORS.primary,
}) => (
  <View style={styles.sectionLabelRow}>
    <View style={[styles.sectionAccentBar, { backgroundColor: accent }]} />
    <Text style={styles.sectionLabelText}>{title}</Text>
  </View>
);

// — Glowing Joint Dot
const JointDot: React.FC<{
  x: number;
  y: number;
  color?: string;
  size?: number;
}> = ({ x, y, color = COLORS.primary, size = 8 }) => {
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200 + Math.random() * 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 1200 + Math.random() * 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.jointDot,
        {
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: pulse,
          shadowColor: color,
        },
      ]}
    />
  );
};

// — Skeleton Body Visualization
const SkeletonVisualization: React.FC<{ riskScore: number }> = ({
  riskScore,
}) => {
  const highRisk = riskScore >= 60;
  const kneeColor = highRisk ? COLORS.danger : COLORS.primary;
  const spineColor = highRisk ? "#FF9800" : COLORS.primary;

  return (
    <View style={styles.skeletonContainer}>
      <LinearGradient
        colors={["rgba(0,245,212,0.04)", "rgba(123,97,255,0.08)", "transparent"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Grid lines for futuristic feel */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {[...Array(6)].map((_, i) => (
          <View key={`hgrid-${i}`} style={[styles.gridLineH, { top: `${i * 20}%` as any }]} />
        ))}
        {[...Array(5)].map((_, i) => (
          <View key={`vgrid-${i}`} style={[styles.gridLineV, { left: `${i * 25}%` as any }]} />
        ))}
      </View>

      {/* Body outline SVG-style using Views */}
      <View style={styles.bodyOuterWrap}>
        {/* Head */}
        <View style={styles.headCircle} />
        {/* Neck */}
        <View style={styles.neckLine} />
        {/* Torso */}
        <View style={styles.torsoRect} />
        {/* Left arm */}
        <View style={[styles.armLine, styles.armLeft]} />
        {/* Right arm */}
        <View style={[styles.armLine, styles.armRight]} />
        {/* Left leg upper */}
        <View style={[styles.legLineUpper, styles.legLeft]} />
        {/* Right leg upper */}
        <View style={[styles.legLineUpper, styles.legRight]} />
        {/* Left leg lower */}
        <View style={[styles.legLineLower, styles.legLowerLeft]} />
        {/* Right leg lower */}
        <View style={[styles.legLineLower, styles.legLowerRight]} />

        {/* Joint dots */}
        {/* Head top */}
        <JointDot x={80} y={18} color={COLORS.primary} size={7} />
        {/* Shoulders */}
        <JointDot x={40} y={72} color={COLORS.primary} size={9} />
        <JointDot x={120} y={72} color={COLORS.primary} size={9} />
        {/* Elbows */}
        <JointDot x={22} y={115} color={COLORS.primary} size={7} />
        <JointDot x={138} y={115} color={COLORS.primary} size={7} />
        {/* Wrists */}
        <JointDot x={12} y={150} color={COLORS.primary} size={6} />
        <JointDot x={148} y={150} color={COLORS.primary} size={6} />
        {/* Hips */}
        <JointDot x={55} y={160} color={spineColor} size={9} />
        <JointDot x={105} y={160} color={spineColor} size={9} />
        {/* Knees */}
        <JointDot x={52} y={210} color={kneeColor} size={10} />
        <JointDot x={108} y={210} color={kneeColor} size={10} />
        {/* Ankles */}
        <JointDot x={50} y={255} color={COLORS.primary} size={7} />
        <JointDot x={110} y={255} color={COLORS.primary} size={7} />
      </View>

      {/* Risk labels */}
      <View style={styles.riskLabelKnee}>
        <Text style={[styles.riskLabelText, { color: kneeColor }]}>
          ⚠ KNEE
        </Text>
      </View>
      <View style={styles.riskLabelSpine}>
        <Text style={[styles.riskLabelText, { color: spineColor }]}>
          ⚠ SPINE
        </Text>
      </View>

      {/* Corner decorators */}
      <View style={[styles.cornerDeco, styles.cornerTL]} />
      <View style={[styles.cornerDeco, styles.cornerTR]} />
      <View style={[styles.cornerDeco, styles.cornerBL]} />
      <View style={[styles.cornerDeco, styles.cornerBR]} />

      {/* AI label */}
      <View style={styles.aiScanLabel}>
        <View style={styles.aiScanDot} />
        <Text style={styles.aiScanText}>AI MOTION SCAN ACTIVE</Text>
      </View>
    </View>
  );
};

// — Risk Score Ring Card
const RiskScoreCard: React.FC<{ score: number }> = ({ score }) => {
  const { label } = getSeverityLevel(
    score >= 80 ? "critical" : score >= 60 ? "high" : score >= 35 ? "medium" : "low"
  );
  const color = getRiskColor(
    score >= 80 ? "critical" : score >= 60 ? "high" : score >= 35 ? "medium" : "low"
  );

  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.cardElevated, COLORS.card]}
      style={styles.riskScoreCard}
    >
      <View style={styles.riskScoreLeft}>
        <Text style={styles.riskScoreOverline}>BIOMECHANICAL RISK</Text>
        <Animated.Text
          style={[styles.riskScoreValue, { color, transform: [{ scale: pulseAnim }] }]}
        >
          {score}%
        </Animated.Text>
        <View style={[styles.riskBadge, { backgroundColor: `${color}22`, borderColor: `${color}55` }]}>
          <Text style={[styles.riskBadgeText, { color }]}>{label}</Text>
        </View>
        <Text style={styles.riskScoreSubtext}>
          Based on {MOCK_ANALYSIS_RESULT.anglesAnalyzed} camera angles
        </Text>
      </View>

      <View style={styles.riskScoreRight}>
        {/* Faux ring */}
        <Animated.View
          style={[
            styles.riskRingOuter,
            { borderColor: `${color}33`, transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View style={[styles.riskRingInner, { borderColor: color }]}>
            <Text style={[styles.riskRingPercent, { color }]}>{score}</Text>
            <Text style={styles.riskRingPercentSign}>%</Text>
          </View>
        </Animated.View>

        <View style={styles.confidenceRow}>
          <View style={[styles.confidenceDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.confidenceText}>
            {MOCK_ANALYSIS_RESULT.confidenceScore}% confidence
          </Text>
        </View>
      </View>

      {/* Glow bleed */}
      <View style={[styles.riskCardGlow, { shadowColor: color }]} />
    </LinearGradient>
  );
};

// — Detected Issue Card (wraps RiskCard pattern)
const IssueCard: React.FC<{ issue: DetectedIssue; index: number }> = ({
  issue,
  index,
}) => {
  const color = getRiskColor(issue.severity);
  const { label } = getSeverityLevel(issue.severity);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideIn, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.issueCard,
        { opacity: fadeIn, transform: [{ translateY: slideIn }] },
      ]}
    >
      <LinearGradient
        colors={[`${color}12`, COLORS.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.issueCardGradient}
      >
        <View style={[styles.issueCardAccent, { backgroundColor: color }]} />
        <View style={styles.issueCardContent}>
          <View style={styles.issueCardHeader}>
            <Text style={styles.issueCardTitle}>{issue.title}</Text>
            <View
              style={[
                styles.issueSeverityPill,
                { backgroundColor: `${color}22`, borderColor: `${color}44` },
              ]}
            >
              <Text style={[styles.issueSeverityText, { color }]}>{label}</Text>
            </View>
          </View>
          <Text style={styles.issueCardDesc}>{issue.description}</Text>
          <View style={styles.issueBodyPartRow}>
            <View style={[styles.issueBodyPartDot, { backgroundColor: color }]} />
            <Text style={[styles.issueBodyPartText, { color }]}>
              {issue.bodyPart}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// — Injury Risk Bar Row
const InjuryRiskRow: React.FC<{ risk: InjuryRisk; index: number }> = ({
  risk,
  index,
}) => {
  const color = getRiskColor(risk.severity);
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: risk.probability / 100,
      duration: 700,
      delay: 300 + index * 100,
      useNativeDriver: false,
    }).start();
  }, []);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", `${risk.probability}%`],
  });

  return (
    <View style={styles.injuryRow}>
      <View style={styles.injuryRowHeader}>
        <Text style={styles.injuryName}>{risk.name}</Text>
        <Text style={[styles.injuryPercent, { color }]}>{risk.probability}%</Text>
      </View>
      <Text style={styles.injuryArea}>{risk.affectedArea}</Text>
      <View style={styles.injuryBarTrack}>
        <Animated.View
          style={[
            styles.injuryBarFill,
            { width: barWidth, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
};

// — Recommendation Row
const RecommendationRow: React.FC<{
  rec: Recommendation;
  index: number;
}> = ({ rec, index }) => {
  const priorityColor =
    rec.priority === "high"
      ? COLORS.danger
      : rec.priority === "medium"
      ? "#FF9800"
      : COLORS.primary;

  return (
    <View style={styles.recRow}>
      <View style={[styles.recIndexCircle, { borderColor: priorityColor }]}>
        <Text style={[styles.recIndex, { color: priorityColor }]}>
          {index + 1}
        </Text>
      </View>
      <Text style={styles.recText}>{rec.text}</Text>
    </View>
  );
};

// — Corrective Exercise Card
const CorrectiveCard: React.FC<{ exercise: CorrectiveExercise }> = ({
  exercise,
}) => {
  const { label, icon } = getCategoryMeta(exercise.category);
  const accent =
    exercise.category === "mobility"
      ? COLORS.primary
      : exercise.category === "stability"
      ? COLORS.accent
      : exercise.category === "activation"
      ? "#FF9800"
      : COLORS.danger;

  return (
    <View style={[styles.correctiveCard, { borderColor: `${accent}33` }]}>
      <LinearGradient
        colors={[`${accent}10`, COLORS.card]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.correctiveHeader}>
        <View style={[styles.correctiveIconWrap, { backgroundColor: `${accent}22` }]}>
          <Text style={[styles.correctiveIcon, { color: accent }]}>{icon}</Text>
        </View>
        <View style={styles.correctiveTitleWrap}>
          <Text style={styles.correctiveName}>{exercise.name}</Text>
          <Text style={[styles.correctiveCategory, { color: accent }]}>{label}</Text>
        </View>
        <View style={[styles.correctiveMetaPill, { borderColor: `${accent}44` }]}>
          <Text style={[styles.correctiveMetaText, { color: accent }]}>
            {exercise.sets ? `${exercise.sets} × ` : ""}
            {exercise.reps ? `${exercise.reps} reps` : exercise.duration ?? ""}
          </Text>
        </View>
      </View>
      <Text style={styles.correctiveDesc}>{exercise.description}</Text>
    </View>
  );
};

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const data = MOCK_ANALYSIS_RESULT;

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      {/* Background gradient */}
      <LinearGradient
        colors={["#0B0F1A", "#0E1320", "#0B0F1A"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Top ambient glow */}
      <View style={styles.topGlow} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Exercise Header ── */}
        <Animated.View
          style={[
            styles.exerciseHeader,
            {
              opacity: headerFade,
              transform: [{ translateY: headerSlide }],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(0,245,212,0.12)", "transparent"]}
            style={styles.headerGradientStrip}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>ANALYSIS COMPLETE</Text>
          </View>
          <Text style={styles.exerciseTitle}>{data.exerciseName}</Text>
          <Text style={styles.exerciseSubtitle}>
            {formatAnalysisDate(data.analysisDate)} · {data.anglesAnalyzed} angles
          </Text>
        </Animated.View>

        {/* ── Risk Score Card ── */}
        <RiskScoreCard score={data.riskScore} />

        {/* ── Skeleton Visualization ── */}
        <View style={styles.section}>
          <SectionLabel title="MOTION TRACKING" accent={COLORS.primary} />
          <SkeletonVisualization riskScore={data.riskScore} />
        </View>

        {/* ── Detected Issues ── */}
        <View style={styles.section}>
          <SectionLabel title="DETECTED ISSUES" accent={COLORS.danger} />
          {data.detectedIssues.map((issue: DetectedIssue, i: number) => (
            <IssueCard key={issue.id} issue={issue} index={i} />
          ))}
        </View>

        {/* ── Injury Risks ── */}
        <View style={styles.section}>
          <SectionLabel title="INJURY RISK ASSESSMENT" accent={COLORS.accent} />
          <LinearGradient
            colors={[COLORS.cardElevated, COLORS.card]}
            style={styles.injuryRisksCard}
          >
            {data.injuryRisks.map((risk: InjuryRisk, i: number) => (
              <InjuryRiskRow key={risk.id} risk={risk} index={i} />
            ))}
          </LinearGradient>
        </View>

        {/* ── AI Recommendations ── */}
        <View style={styles.section}>
          <SectionLabel title="AI RECOMMENDATIONS" accent={COLORS.primary} />
          <LinearGradient
            colors={[COLORS.cardElevated, COLORS.card]}
            style={styles.recommendationsCard}
          >
            <View style={styles.recAIBadge}>
              <View style={styles.recAIDot} />
              <Text style={styles.recAIText}>FORMFIX AI ANALYSIS</Text>
            </View>
            {data.recommendations.map((rec: Recommendation, i: number) => (
              <RecommendationRow key={rec.id} rec={rec} index={i} />
            ))}
          </LinearGradient>
        </View>

        {/* ── Corrective Exercises ── */}
        <View style={styles.section}>
          <SectionLabel title="CORRECTIVE PROTOCOL" accent={COLORS.accent} />
          {data.correctiveExercises.map((ex: CorrectiveExercise) => (
            <CorrectiveCard key={ex.id} exercise={ex} />
          ))}
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity
          style={styles.ctaWrapper}
          onPress={() => router.replace("/(main)/exercises")}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topGlow: {
    position: "absolute",
    top: -80,
    left: SCREEN_W / 2 - 120,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(0,245,212,0.06)",
    // Shadow not supported on Android but fine on iOS
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 80,
      },
    }),
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 4,
  },

  // ─ Exercise Header ─
  exerciseHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    overflow: "hidden",
  },
  headerGradientStrip: {
    position: "absolute",
    top: 0,
    left: -16,
    right: -16,
    height: 2,
  },
  headerBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,245,212,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,245,212,0.3)",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 10,
  },
  headerBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  exerciseTitle: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  exerciseSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    letterSpacing: 0.4,
  },

  // ─ Section ─
  section: {
    marginTop: 28,
  },
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

  // ─ Risk Score Card ─
  riskScoreCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    marginTop: 4,
    overflow: "hidden",
  },
  riskScoreLeft: {
    flex: 1,
    gap: 8,
  },
  riskScoreOverline: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  riskScoreValue: {
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -2,
  },
  riskBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  riskScoreSubtext: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  riskScoreRight: {
    alignItems: "center",
    gap: 10,
  },
  riskRingOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  riskRingInner: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "center",
  },
  riskRingPercent: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -1,
  },
  riskRingPercentSign: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  confidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  confidenceDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  confidenceText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  riskCardGlow: {
    position: "absolute",
    bottom: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
      },
    }),
  },

  // ─ Skeleton ─
  skeletonContainer: {
    height: 300,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  gridLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.border,
  },
  gridLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: COLORS.border,
  },
  bodyOuterWrap: {
    width: 160,
    height: 270,
    position: "relative",
  },
  headCircle: {
    position: "absolute",
    left: 60,
    top: 4,
    width: 40,
    height: 44,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(0,245,212,0.6)",
    backgroundColor: "transparent",
  },
  neckLine: {
    position: "absolute",
    left: 76,
    top: 48,
    width: 8,
    height: 18,
    backgroundColor: "rgba(0,245,212,0.5)",
    borderRadius: 2,
  },
  torsoRect: {
    position: "absolute",
    left: 45,
    top: 66,
    width: 70,
    height: 85,
    borderWidth: 2,
    borderColor: "rgba(0,245,212,0.5)",
    borderRadius: 6,
    backgroundColor: "rgba(0,245,212,0.03)",
  },
  armLine: {
    position: "absolute",
    top: 72,
    width: 3,
    height: 80,
    backgroundColor: "rgba(0,245,212,0.5)",
    borderRadius: 2,
  },
  armLeft: {
    left: 32,
    transform: [{ rotate: "-12deg" }],
  },
  armRight: {
    right: 32,
    transform: [{ rotate: "12deg" }],
  },
  legLineUpper: {
    position: "absolute",
    top: 154,
    width: 3,
    height: 60,
    backgroundColor: "rgba(0,245,212,0.5)",
    borderRadius: 2,
  },
  legLeft: {
    left: 52,
    transform: [{ rotate: "6deg" }],
  },
  legRight: {
    right: 52,
    transform: [{ rotate: "-6deg" }],
  },
  legLineLower: {
    position: "absolute",
    top: 214,
    width: 3,
    height: 48,
    backgroundColor: "rgba(0,245,212,0.5)",
    borderRadius: 2,
  },
  legLowerLeft: {
    left: 49,
    transform: [{ rotate: "-4deg" }],
  },
  legLowerRight: {
    right: 49,
    transform: [{ rotate: "4deg" }],
  },
  jointDot: {
    position: "absolute",
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 6,
      },
    }),
  },
  riskLabelKnee: {
    position: "absolute",
    bottom: 56,
    right: 16,
  },
  riskLabelSpine: {
    position: "absolute",
    top: 100,
    right: 16,
  },
  riskLabelText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  cornerDeco: {
    position: "absolute",
    width: 14,
    height: 14,
    borderColor: COLORS.primary,
    opacity: 0.5,
  },
  cornerTL: { top: 8, left: 8, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: 8, right: 8, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: 8, left: 8, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: 8, right: 8, borderBottomWidth: 2, borderRightWidth: 2 },
  aiScanLabel: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  aiScanDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  aiScanText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    opacity: 0.7,
  },

  // ─ Issue Card ─
  issueCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  issueCardGradient: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  issueCardAccent: {
    width: 3,
  },
  issueCardContent: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  issueCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  issueCardTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  issueSeverityPill: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  issueSeverityText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  issueCardDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  issueBodyPartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  issueBodyPartDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  issueBodyPartText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  // ─ Injury Risk ─
  injuryRisksCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 18,
  },
  injuryRow: {
    gap: 5,
  },
  injuryRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  injuryName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  injuryPercent: {
    fontSize: 13,
    fontWeight: "800",
  },
  injuryArea: {
    color: COLORS.textSecondary,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  injuryBarTrack: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 2,
  },
  injuryBarFill: {
    height: "100%",
    borderRadius: 2,
  },

  // ─ Recommendations ─
  recommendationsCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 14,
  },
  recAIBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  recAIDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  recAIText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
  },
  recRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  recIndexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  recIndex: {
    fontSize: 11,
    fontWeight: "800",
  },
  recText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },

  // ─ Corrective Exercises ─
  correctiveCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    padding: 14,
    marginBottom: 10,
    gap: 8,
    backgroundColor: COLORS.card,
  },
  correctiveHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  correctiveIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  correctiveIcon: {
    fontSize: 18,
    fontWeight: "900",
  },
  correctiveTitleWrap: {
    flex: 1,
    gap: 2,
  },
  correctiveName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  correctiveCategory: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  correctiveMetaPill: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  correctiveMetaText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  correctiveDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
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