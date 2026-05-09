import React, { useState, useRef, useEffect } from "react";
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

const ANGLES = [
  {
    id: "front",
    label: "Front Angle",
    description: "Face the camera directly",
    icon: "◉",
    color: COLORS.primary,
  },
  {
    id: "side",
    label: "Side Angle",
    description: "Position camera to your right",
    icon: "◈",
    color: COLORS.accent,
  },
  {
    id: "rear",
    label: "Rear Angle",
    description: "Camera behind you",
    icon: "◎",
    color: "#FF9F43",
  },
];

type VideoEntry = { id: string; name: string };
type UploadMap = Record<string, VideoEntry[]>;

function PulseRing({ color }: { color: string }) {
  const pulse = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.4,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.pulseRing,
        {
          borderColor: color,
          transform: [{ scale: pulse }],
          opacity,
        },
      ]}
    />
  );
}

function VideoThumb({
  video,
  onRemove,
}: {
  video: VideoEntry;
  onRemove: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 4 }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.thumb, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
    >
      <LinearGradient
        colors={["#1F2937", "#121826"]}
        style={styles.thumbGradient}
      >
        <Text style={styles.thumbPlayIcon}>▶</Text>
        <View style={styles.thumbInfo}>
          <Text style={styles.thumbLabel} numberOfLines={1}>
            {video.name}
          </Text>
          <View style={styles.thumbBadge}>
            <View style={styles.thumbBadgeDot} />
            <Text style={styles.thumbBadgeText}>Ready</Text>
          </View>
        </View>
        <Pressable onPress={onRemove} style={styles.thumbRemove}>
          <Text style={styles.thumbRemoveIcon}>✕</Text>
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
}

function AngleSection({
  angle,
  uploads,
  onUpload,
  onRecord,
  onRemove,
  index,
}: {
  angle: (typeof ANGLES)[0];
  uploads: VideoEntry[];
  onUpload: () => void;
  onRecord: () => void;
  onRemove: (id: string) => void;
  index: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const hasUploads = uploads.length > 0;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 100,
        useNativeDriver: true,
        speed: 14,
        bounciness: 4,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.angleCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <LinearGradient
        colors={[`${angle.color}10`, "#12182600"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.angleCardGradient}
      >
        <View style={styles.angleHeader}>
          <View style={[styles.angleIconWrap, { borderColor: `${angle.color}40` }]}>
            {hasUploads && <PulseRing color={angle.color} />}
            <Text style={[styles.angleIcon, { color: angle.color }]}>
              {angle.icon}
            </Text>
          </View>
          <View style={styles.angleInfo}>
            <Text style={styles.angleLabel}>{angle.label}</Text>
            <Text style={styles.angleDesc}>{angle.description}</Text>
          </View>
          <View style={[styles.angleBadge, hasUploads && { backgroundColor: `${angle.color}18`, borderColor: `${angle.color}40` }]}>
            <Text style={[styles.angleBadgeText, hasUploads && { color: angle.color }]}>
              {uploads.length} clip{uploads.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {uploads.map((v) => (
          <VideoThumb key={v.id} video={v} onRemove={() => onRemove(v.id)} />
        ))}

        <View style={styles.actionRow}>
          <Pressable
            onPress={onUpload}
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.8 }]}
          >
            <LinearGradient
              colors={[`${angle.color}20`, `${angle.color}08`]}
              style={styles.actionBtnGradient}
            >
              <Text style={[styles.actionBtnIcon, { color: angle.color }]}>↑</Text>
              <Text style={[styles.actionBtnText, { color: angle.color }]}>Upload</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={onRecord}
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.8 }]}
          >
            <View style={styles.actionBtnOutline}>
              <Text style={styles.actionBtnIcon}>⬤</Text>
              <Text style={styles.actionBtnText}>Record</Text>
            </View>
          </Pressable>

          {uploads.length > 0 && (
            <Pressable
              onPress={onUpload}
              style={({ pressed }) => [styles.actionBtnSmall, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.actionBtnSmallText}>+ Add More</Text>
            </Pressable>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

let _videoCounter = 1;

export default function SessionScreen() {
  const router = useRouter();
  const [uploads, setUploads] = useState<UploadMap>({
    front: [],
    side: [],
    rear: [],
  });
  const headerFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;

  const totalVideos = Object.values(uploads).reduce((a, b) => a + b.length, 0);

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (totalVideos > 0) {
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [totalVideos]);

  const handleUpload = (angleId: string) => {
    const newVideo: VideoEntry = {
      id: `${angleId}_${Date.now()}`,
      name: `Clip_${String(_videoCounter++).padStart(3, "0")}.mp4`,
    };
    setUploads((prev) => ({
      ...prev,
      [angleId]: [...prev[angleId], newVideo],
    }));
  };

  const handleRemove = (angleId: string, videoId: string) => {
    setUploads((prev) => ({
      ...prev,
      [angleId]: prev[angleId].filter((v) => v.id !== videoId),
    }));
  };

  const canProceed = totalVideos >= 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
        <View style={styles.stepRow}>
          <View style={styles.stepDone} />
          <View style={styles.stepActive} />
          <View style={styles.stepInactive} />
          <View style={styles.stepInactive} />
        </View>
        <Text style={styles.title}>Upload Movement Videos</Text>
        <Text style={styles.subtitle}>
          Add videos from multiple angles for accurate biomechanical analysis
        </Text>

        <View style={styles.sessionBadge}>
          <LinearGradient
            colors={["#00F5D415", "#7B61FF10"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sessionBadgeGradient}
          >
            <View style={styles.sessionBadgeDot} />
            <Text style={styles.sessionBadgeExercise}>Squat</Text>
            <View style={styles.sessionBadgeSep} />
            <Text style={styles.sessionBadgeCount}>
              {totalVideos} video{totalVideos !== 1 ? "s" : ""} this session
            </Text>
          </LinearGradient>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tipRow}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            Upload all videos of the{" "}
            <Text style={styles.tipHighlight}>same repetition</Text> for best results
          </Text>
        </View>

        {ANGLES.map((angle, index) => (
          <AngleSection
            key={angle.id}
            angle={angle}
            uploads={uploads[angle.id]}
            onUpload={() => handleUpload(angle.id)}
            onRecord={() => handleUpload(angle.id)}
            onRemove={(videoId) => handleRemove(angle.id, videoId)}
            index={index}
          />
        ))}

        <View style={{ height: 140 }} />
      </ScrollView>

      <Animated.View
        style={[styles.bottomBar, { opacity: canProceed ? 1 : 0.4 }]}
      >
        <LinearGradient
          colors={["#0B0F1A00", "#0B0F1Aee", "#0B0F1A"]}
          style={styles.bottomGradient}
        >
          <Pressable
            onPress={() => canProceed && router.push("/(main)/processing")}
            style={({ pressed }) => [
              styles.analyzeBtn,
              pressed && { opacity: 0.88 },
            ]}
          >
            <LinearGradient
              colors={["#00F5D4", "#00BAA0", "#7B61FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.analyzeBtnGradient}
            >
              <Text style={styles.analyzeBtnText}>Start AI Analysis</Text>
              <Text style={styles.analyzeBtnIcon}>⚡</Text>
            </LinearGradient>
          </Pressable>
          {!canProceed && (
            <Text style={styles.requireHint}>Upload at least 1 video to continue</Text>
          )}
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backBtn: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  backBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  stepRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 20,
  },
  stepDone: {
    height: 3,
    width: 20,
    borderRadius: 2,
    backgroundColor: `${COLORS.primary}60`,
  },
  stepActive: {
    height: 3,
    width: 28,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  stepInactive: {
    height: 3,
    width: 14,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    letterSpacing: 0.2,
    marginBottom: 16,
  },
  sessionBadge: {
    borderRadius: 12,
    overflow: "hidden",
  },
  sessionBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
    borderRadius: 12,
    gap: 10,
  },
  sessionBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  sessionBadgeExercise: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  sessionBadgeSep: {
    width: 1,
    height: 14,
    backgroundColor: `${COLORS.primary}40`,
  },
  sessionBadgeCount: {
    color: COLORS.textSecondary,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F293750",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    gap: 10,
  },
  tipIcon: {
    fontSize: 16,
  },
  tipText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  tipHighlight: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  angleCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginBottom: 16,
  },
  angleCardGradient: {
    padding: 18,
  },
  angleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  angleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: "#1F293760",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  pulseRing: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  angleIcon: {
    fontSize: 22,
  },
  angleInfo: {
    flex: 1,
  },
  angleLabel: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  angleDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  angleBadge: {
    backgroundColor: COLORS.border,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  angleBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  thumb: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  thumbGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
  },
  thumbPlayIcon: {
    fontSize: 18,
    color: COLORS.primary,
  },
  thumbInfo: {
    flex: 1,
    gap: 4,
  },
  thumbLabel: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  thumbBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  thumbBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
  },
  thumbBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  thumbRemove: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: `${COLORS.danger}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbRemoveIcon: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  actionBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
    borderRadius: 12,
  },
  actionBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: "#1F293730",
  },
  actionBtnIcon: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  actionBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  actionBtnSmall: {
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
  },
  actionBtnSmallText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomGradient: {
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 24,
    gap: 10,
  },
  analyzeBtn: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  analyzeBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 12,
  },
  analyzeBtnText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  analyzeBtnIcon: {
    fontSize: 16,
  },
  requireHint: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 12,
    letterSpacing: 0.3,
  },
});