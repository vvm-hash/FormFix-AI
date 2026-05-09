import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { RiskCard } from "../../components/RiskCard";

const { width } = Dimensions.get("window");

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

const RECENT_ANALYSES = [
  { id: "1", exercise: "Squat", date: "Today, 9:14 AM", score: 84, trend: "up" },
  { id: "2", exercise: "Deadlift", date: "Yesterday", score: 71, trend: "down" },
  { id: "3", exercise: "Running", date: "2 days ago", score: 92, trend: "up" },
];

const INSIGHTS = [
  { icon: "🦵", text: "Knee valgus detected in squat. Strengthen glutes and improve ankle mobility." },
  { icon: "🔄", text: "Hip hinge pattern improving — 12% better lumbar alignment vs last week." },
  { icon: "⚡", text: "Explosive power output in jump shot is above average for your profile." },
];

function ScoreRing({ score }: { score: number }) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const color = score >= 85 ? COLORS.primary : score >= 65 ? "#FF9F43" : COLORS.danger;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: score / 100,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [score]);

  return (
    <View style={styles.scoreRingWrapper}>
      <View style={[styles.scoreRingBg, { borderColor: `${color}25` }]}>
        <View style={[styles.scoreRingInner, { borderColor: `${color}80` }]}>
          <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
          <Text style={styles.scoreLabel}>score</Text>
        </View>
      </View>
    </View>
  );
}

function AnalysisRow({ item, index }: { item: (typeof RECENT_ANALYSES)[0]; index: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const color = item.score >= 85 ? COLORS.primary : item.score >= 65 ? "#FF9F43" : COLORS.danger;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: index * 80, useNativeDriver: true, speed: 14, bounciness: 3 }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.analysisRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <LinearGradient
        colors={["#1C2333", "#121826"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.analysisRowGradient}
      >
        <View style={styles.analysisLeft}>
          <View style={[styles.analysisIconWrap, { backgroundColor: `${color}15`, borderColor: `${color}30` }]}>
            <Text style={[styles.analysisIcon, { color }]}>◈</Text>
          </View>
          <View>
            <Text style={styles.analysisExercise}>{item.exercise}</Text>
            <Text style={styles.analysisDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.analysisRight}>
          <Text style={[styles.analysisScore, { color }]}>{item.score}</Text>
          <Text style={[styles.analysisTrend, { color: item.trend === "up" ? COLORS.primary : COLORS.danger }]}>
            {item.trend === "up" ? "↑" : "↓"}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function InsightCard({ insight, index }: { insight: (typeof INSIGHTS)[0]; index: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.insightCard, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={["#7B61FF0C", "#00F5D406"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.insightGradient}
      >
        <Text style={styles.insightIcon}>{insight.icon}</Text>
        <Text style={styles.insightText}>{insight.text}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const headerFade = useRef(new Animated.Value(0)).current;
  const readinessPulse = useRef(new Animated.Value(1)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const [readiness] = useState(78);

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 700, useNativeDriver: true }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(readinessPulse, { toValue: 1.04, duration: 2000, useNativeDriver: true }),
        Animated.timing(readinessPulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <LinearGradient
        colors={["#00F5D408", "#0B0F1A"]}
        style={styles.topGlow}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.headerSection, { opacity: headerFade }]}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greetingSmall}>Good morning,</Text>
              <Text style={styles.greetingName}>Athlete 👋</Text>
            </View>
            <Pressable style={styles.avatarBtn} onPress={() => router.push("/(main)/profile")}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>A</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            {[
              { label: "Sessions", value: "12" },
              { label: "Avg Score", value: "82" },
              { label: "Risks Found", value: "3" },
            ].map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.section}>
          <Animated.View style={[styles.readinessCard, { transform: [{ scale: readinessPulse }] }]}>
            <LinearGradient
              colors={["#1C2A3A", "#121826"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.readinessGradient}
            >
              <View style={styles.readinessLeft}>
                <View style={styles.readinessBadge}>
                  <View style={styles.readinessBadgeDot} />
                  <Text style={styles.readinessBadgeText}>AI READINESS</Text>
                </View>
                <Text style={styles.readinessTitle}>Movement{"\n"}Score</Text>
                <Text style={styles.readinessSubtitle}>
                  Based on 3 recent{"\n"}sessions
                </Text>
                <View style={styles.readinessBarBg}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.accent]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.readinessBarFill, { width: `${readiness}%` }]}
                  />
                </View>
              </View>
              <ScoreRing score={readiness} />
            </LinearGradient>
          </Animated.View>
        </View>

        <View style={styles.section}>
          <Pressable
            onPressIn={() =>
              Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 4 }).start()
            }
            onPressOut={() =>
              Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start()
            }
            onPress={() => router.push("/(main)/exercises")}
          >
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <LinearGradient
                colors={[COLORS.primary, "#00BFAB", COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.newAnalysisBtn}
              >
                <View style={styles.newAnalysisBtnInner}>
                  <Text style={styles.newAnalysisBtnIcon}>⚡</Text>
                  <View>
                    <Text style={styles.newAnalysisBtnTitle}>Start New Analysis</Text>
                    <Text style={styles.newAnalysisBtnSub}>Upload video · AI powered · Real-time</Text>
                  </View>
                </View>
                <Text style={styles.newAnalysisBtnArrow}>→</Text>
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Analyses</Text>
            <Pressable>
              <Text style={styles.sectionAction}>View all →</Text>
            </Pressable>
          </View>
          <View style={styles.analysisList}>
            {RECENT_ANALYSES.map((item, index) => (
              <AnalysisRow key={item.id} item={item} index={index} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Risk Summary</Text>
            <View style={styles.riskCountBadge}>
              <Text style={styles.riskCountText}>3 active</Text>
            </View>
          </View>
          <View style={styles.riskList}>
            <RiskCard
              title="Knee Valgus"
              severity="high"
              description="Inward knee collapse detected during squat descent. High injury risk to ACL and meniscus."
            />
            <RiskCard
              title="Lumbar Flexion"
              severity="medium"
              description="Mild lower back rounding at the bottom of deadlift. Monitor and cue neutral spine."
            />
            <RiskCard
              title="Shoulder Asymmetry"
              severity="low"
              description="Slight left-right shoulder imbalance in tennis serve. Within acceptable range."
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Insights</Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>✦ Live</Text>
            </View>
          </View>
          <View style={styles.insightsList}>
            {INSIGHTS.map((insight, index) => (
              <InsightCard key={index} insight={insight} index={index} />
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    pointerEvents: "none",
  },
  scrollContent: {
    paddingTop: 60,
  },
  headerSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 20,
  },
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greetingSmall: {
    color: COLORS.textSecondary,
    fontSize: 13,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  greetingName: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  avatarBtn: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  avatarText: {
    color: COLORS.background,
    fontSize: 17,
    fontWeight: "900",
  },
  statsRow: {
    flexDirection: "row",
    gap: 0,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  sectionAction: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  readinessCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: `${COLORS.primary}25`,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
  readinessGradient: {
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  readinessLeft: {
    flex: 1,
    gap: 10,
  },
  readinessBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readinessBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  readinessBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  readinessTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  readinessSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  readinessBarBg: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: "hidden",
    width: "80%",
  },
  readinessBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  scoreRingWrapper: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreRingBg: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreRingInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B0F1A80",
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  scoreLabel: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: -2,
  },
  newAnalysisBtn: {
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingVertical: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  newAnalysisBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  newAnalysisBtnIcon: {
    fontSize: 24,
  },
  newAnalysisBtnTitle: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  newAnalysisBtnSub: {
    color: `${COLORS.background}99`,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  newAnalysisBtnArrow: {
    color: COLORS.background,
    fontSize: 22,
    fontWeight: "700",
  },
  analysisList: {
    gap: 10,
  },
  analysisRow: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  analysisRowGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  analysisLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  analysisIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  analysisIcon: {
    fontSize: 16,
  },
  analysisExercise: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  analysisDate: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  analysisRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  analysisScore: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  analysisTrend: {
    fontSize: 16,
    fontWeight: "800",
  },
  riskCountBadge: {
    backgroundColor: `${COLORS.danger}18`,
    borderWidth: 1,
    borderColor: `${COLORS.danger}35`,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  riskCountText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  riskList: {
    gap: 12,
  },
  aiBadge: {
    backgroundColor: `${COLORS.accent}15`,
    borderWidth: 1,
    borderColor: `${COLORS.accent}35`,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  aiBadgeText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  insightsList: {
    gap: 10,
  },
  insightCard: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: `${COLORS.accent}20`,
  },
  insightGradient: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 12,
  },
  insightIcon: {
    fontSize: 20,
    marginTop: 1,
  },
  insightText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
});