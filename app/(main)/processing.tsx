import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
    Easing,
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

const STAGES = [
    {
        id: "joints",
        label: "Detecting body joints",
        detail: "Mapping 33 skeletal landmarks",
        icon: "◈",
        color: COLORS.primary,
        duration: 2200,
    },
    {
        id: "posture",
        label: "Tracking posture",
        detail: "Analyzing spine alignment",
        icon: "◉",
        color: COLORS.accent,
        duration: 2000,
    },
    {
        id: "angles",
        label: "Calculating movement angles",
        detail: "Computing joint flexion & extension",
        icon: "⟳",
        color: "#FF9F43",
        duration: 2400,
    },
    {
        id: "injury",
        label: "Detecting injury risks",
        detail: "Cross-referencing biomechanical thresholds",
        icon: "⚠",
        color: COLORS.danger,
        duration: 2000,
    },
    {
        id: "feedback",
        label: "Generating corrective feedback",
        detail: "Compiling personalized recommendations",
        icon: "✦",
        color: COLORS.primary,
        duration: 1800,
    },
];

const TOTAL_DURATION = STAGES.reduce((s, st) => s + st.duration, 0);

const JOINTS = [
    { x: 0.5, y: 0.06 },
    { x: 0.5, y: 0.16 },
    { x: 0.36, y: 0.2 },
    { x: 0.64, y: 0.2 },
    { x: 0.28, y: 0.3 },
    { x: 0.72, y: 0.3 },
    { x: 0.24, y: 0.42 },
    { x: 0.76, y: 0.42 },
    { x: 0.5, y: 0.28 },
    { x: 0.5, y: 0.46 },
    { x: 0.42, y: 0.5 },
    { x: 0.58, y: 0.5 },
    { x: 0.4, y: 0.66 },
    { x: 0.6, y: 0.66 },
    { x: 0.38, y: 0.82 },
    { x: 0.62, y: 0.82 },
    { x: 0.38, y: 0.97 },
    { x: 0.62, y: 0.97 },
];

const BONES = [
    [0, 1],
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 6],
    [5, 7],
    [1, 8],
    [8, 9],
    [9, 10],
    [9, 11],
    [10, 12],
    [11, 13],
    [12, 14],
    [13, 15],
    [14, 16],
    [15, 17],
];

const SKEL_W = 160;
const SKEL_H = 280;

function SkeletonFigure({ activeJoints }: { activeJoints: number }) {
    const jointAnims = useRef(
        JOINTS.map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
        const count = Math.min(activeJoints, JOINTS.length);
        const anims = jointAnims.slice(0, count).map((anim, i) =>
            Animated.timing(anim, {
                toValue: 1,
                duration: 300,
                delay: i * 60,
                useNativeDriver: true,
                easing: Easing.out(Easing.back(1.6)),
            })
        );
        Animated.parallel(anims).start();
    }, [activeJoints]);

    return (
        <View style={{ width: SKEL_W, height: SKEL_H }}>
            {BONES.map(([a, b], idx) => {
                const jA = JOINTS[a];
                const jB = JOINTS[b];
                const x1 = jA.x * SKEL_W;
                const y1 = jA.y * SKEL_H;
                const x2 = jB.x * SKEL_W;
                const y2 = jB.y * SKEL_H;
                const dx = x2 - x1;
                const dy = y2 - y1;
                const len = Math.sqrt(dx * dx + dy * dy);
                const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
                const opacity =
                    Math.min(a, b) < Math.floor((activeJoints / JOINTS.length) * JOINTS.length)
                        ? 0.5
                        : 0.1;
                return (
                    <View
                        key={idx}
                        style={{
                            position: "absolute",
                            left: x1,
                            top: y1,
                            width: len,
                            height: 1.5,
                            backgroundColor: COLORS.primary,
                            opacity,
                            transformOrigin: "0 50%",
                            transform: [{ rotate: `${angle}deg` }],
                        }}
                    />
                );
            })}
            {JOINTS.map((j, idx) => {
                const isActive = idx < activeJoints;
                return (
                    <Animated.View
                        key={idx}
                        style={[
                            styles.joint,
                            {
                                left: j.x * SKEL_W - 5,
                                top: j.y * SKEL_H - 5,
                                backgroundColor: isActive ? COLORS.primary : "#1F2937",
                                borderColor: isActive ? COLORS.primary : "#2D3748",
                                opacity: jointAnims[idx],
                                shadowColor: isActive ? COLORS.primary : "transparent",
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: isActive ? 0.9 : 0,
                                shadowRadius: isActive ? 6 : 0,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
}

function StageLine({
    stage,
    state,
    index,
}: {
    stage: (typeof STAGES)[0];
    state: "pending" | "active" | "done";
    index: number;
}) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(12)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const dotPulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 80,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                delay: index * 80,
                useNativeDriver: true,
                speed: 14,
                bounciness: 4,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        if (state === "active") {
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: stage.duration,
                useNativeDriver: false,
                easing: Easing.linear,
            }).start();
            Animated.loop(
                Animated.sequence([
                    Animated.timing(dotPulse, {
                        toValue: 1.4,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dotPulse, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else if (state === "done") {
            progressAnim.setValue(1);
            dotPulse.setValue(1);
        }
    }, [state]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <Animated.View
            style={[
                styles.stageLine,
                {
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                },
            ]}
        >
            <View style={styles.stageLeft}>
                <Animated.View
                    style={[
                        styles.stageDot,
                        {
                            backgroundColor:
                                state === "pending" ? COLORS.border : stage.color,
                            borderColor:
                                state === "pending" ? COLORS.border : stage.color,
                            transform: [{ scale: state === "active" ? dotPulse : new Animated.Value(1) }],
                            shadowColor: state === "active" ? stage.color : "transparent",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.9,
                            shadowRadius: 6,
                        },
                    ]}
                />
                {index < STAGES.length - 1 && (
                    <View
                        style={[
                            styles.stageConnector,
                            { backgroundColor: state === "done" ? `${stage.color}40` : COLORS.border },
                        ]}
                    />
                )}
            </View>

            <View style={styles.stageContent}>
                <View style={styles.stageTopRow}>
                    <Text
                        style={[
                            styles.stageLabel,
                            state === "pending" && { color: COLORS.textSecondary },
                            state === "active" && { color: stage.color },
                            state === "done" && { color: COLORS.textPrimary },
                        ]}
                    >
                        {stage.label}
                    </Text>
                    {state === "done" && (
                        <Text style={[styles.stageCheck, { color: stage.color }]}>✓</Text>
                    )}
                    {state === "active" && (
                        <View style={[styles.stageActiveBadge, { borderColor: `${stage.color}50`, backgroundColor: `${stage.color}12` }]}>
                            <Text style={[styles.stageActiveBadgeText, { color: stage.color }]}>
                                Analyzing
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={styles.stageDetail}>{stage.detail}</Text>

                {(state === "active" || state === "done") && (
                    <View style={styles.stageProgressBg}>
                        <Animated.View style={[styles.stageProgressFill, { width: progressWidth, backgroundColor: stage.color }]} />
                    </View>
                )}
            </View>
        </Animated.View>
    );
}

export default function ProcessingScreen() {
    const router = useRouter();
    const [currentStage, setCurrentStage] = useState(0);
    const [activeJoints, setActiveJoints] = useState(0);
    const overallProgress = useRef(new Animated.Value(0)).current;
    const orbRotate = useRef(new Animated.Value(0)).current;
    const scanLine = useRef(new Animated.Value(0)).current;
    const headerFade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(headerFade, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();

        Animated.loop(
            Animated.timing(orbRotate, {
                toValue: 1,
                duration: 6000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLine, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.sin),
                }),
                Animated.timing(scanLine, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.sin),
                }),
            ])
        ).start();

        let elapsed = 0;
        STAGES.forEach((stage, idx) => {
            setTimeout(() => {
                setCurrentStage(idx);
                const jointTarget = Math.round(((idx + 1) / STAGES.length) * JOINTS.length);
                setActiveJoints(jointTarget);
                const progressTarget = elapsed / TOTAL_DURATION;
                Animated.timing(overallProgress, {
                    toValue: progressTarget + stage.duration / TOTAL_DURATION,
                    duration: stage.duration,
                    useNativeDriver: false,
                    easing: Easing.linear,
                }).start();
            }, elapsed);
            elapsed += stage.duration;
        });

        setTimeout(() => {
            setCurrentStage(STAGES.length);
            setActiveJoints(JOINTS.length);
            overallProgress.setValue(1);
            setTimeout(() => router.push("/(main)/results" as any), 800);
        }, elapsed);
    }, []);

    const getStageState = (idx: number): "pending" | "active" | "done" => {
        if (idx < currentStage) return "done";
        if (idx === currentStage) return "active";
        return "pending";
    };

    const progressPercent = overallProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    const orbSpin = orbRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    const scanTranslate = scanLine.interpolate({
        inputRange: [0, 1],
        outputRange: [0, SKEL_H],
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            <Animated.View style={[styles.orbWrapper, { transform: [{ rotate: orbSpin }] }]}>
                <LinearGradient
                    colors={["#00F5D408", "#7B61FF05", "transparent"]}
                    style={styles.orb}
                />
            </Animated.View>

            <Animated.View style={[styles.header, { opacity: headerFade }]}>
                <View style={styles.stepRow}>
                    <View style={styles.stepDone} />
                    <View style={styles.stepDone} />
                    <View style={styles.stepActive} />
                    <View style={styles.stepInactive} />
                </View>
                <Text style={styles.title}>AI Analysis</Text>
                <Text style={styles.subtitle}>Processing your movement data</Text>
            </Animated.View>

            <View style={styles.skeletonSection}>
                <View style={styles.skeletonContainer}>
                    <LinearGradient
                        colors={["#00F5D408", "#7B61FF06", "#12182600"]}
                        style={styles.skeletonBg}
                    />
                    <View style={styles.skeletonCornerTL} />
                    <View style={styles.skeletonCornerTR} />
                    <View style={styles.skeletonCornerBL} />
                    <View style={styles.skeletonCornerBR} />

                    <Animated.View
                        style={[
                            styles.scanLine,
                            { transform: [{ translateY: scanTranslate }] },
                        ]}
                    >
                        <LinearGradient
                            colors={["transparent", `${COLORS.primary}60`, "transparent"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={{ flex: 1 }}
                        />
                    </Animated.View>

                    <SkeletonFigure activeJoints={activeJoints} />

                    <View style={styles.skeletonLabel}>
                        <View style={styles.skeletonLabelDot} />
                        <Text style={styles.skeletonLabelText}>
                            {activeJoints}/{JOINTS.length} joints mapped
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressTitle}>Overall Progress</Text>
                    <Text style={styles.progressPercent}>
                        {Math.round((currentStage / STAGES.length) * 100)}%
                    </Text>

                </View>
                <View style={styles.progressBg}>
                    <Animated.View style={[styles.progressFill, { width: progressPercent }]}>
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.accent]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.progressGlow} />
                    </Animated.View>
                </View>
            </View>

            <View style={styles.stagesSection}>
                {STAGES.map((stage, idx) => (
                    <StageLine
                        key={stage.id}
                        stage={stage}
                        state={getStageState(idx)}
                        index={idx}
                    />
                ))}
            </View>

            <View style={styles.footer}>
                <View style={styles.footerDots}>
                    {[0, 1, 2].map((i) => (
                        <Animated.View
                            key={i}
                            style={[
                                styles.footerDot,
                                {
                                    opacity: scanLine.interpolate({
                                        inputRange: [0, 0.33, 0.66, 1],
                                        outputRange:
                                            i === 0
                                                ? [1, 0.3, 0.6, 1]
                                                : i === 1
                                                    ? [0.3, 1, 0.3, 0.5]
                                                    : [0.5, 0.3, 1, 0.3],
                                    }),
                                },
                            ]}
                        />
                    ))}
                </View>
                <Text style={styles.footerText}>
                    AI biomechanical engine analyzing movement patterns...
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    orbWrapper: {
        position: "absolute",
        top: -height * 0.15,
        right: -width * 0.3,
        width: width * 0.9,
        height: width * 0.9,
    },
    orb: {
        flex: 1,
        borderRadius: width * 0.45,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 16,
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
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.textSecondary,
        letterSpacing: 0.3,
    },
    skeletonSection: {
        alignItems: "center",
        paddingVertical: 12,
    },
    skeletonContainer: {
        width: SKEL_W + 48,
        height: SKEL_H + 48,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: `${COLORS.primary}25`,
        borderRadius: 24,
        overflow: "hidden",
        position: "relative",
    },
    skeletonBg: {
        ...StyleSheet.absoluteFillObject,
    },
    skeletonCornerTL: {
        position: "absolute",
        top: 10,
        left: 10,
        width: 16,
        height: 16,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 3,
    },
    skeletonCornerTR: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 16,
        height: 16,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 3,
    },
    skeletonCornerBL: {
        position: "absolute",
        bottom: 30,
        left: 10,
        width: 16,
        height: 16,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 3,
    },
    skeletonCornerBR: {
        position: "absolute",
        bottom: 30,
        right: 10,
        width: 16,
        height: 16,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 3,
    },
    scanLine: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 24,
        top: 24,
    },
    joint: {
        position: "absolute",
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1.5,
    },
    skeletonLabel: {
        position: "absolute",
        bottom: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    skeletonLabelDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: COLORS.primary,
    },
    skeletonLabelText: {
        color: COLORS.primary,
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 0.8,
    },
    progressSection: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    progressTitle: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.8,
        textTransform: "uppercase",
    },
    progressPercent: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    progressBg: {
        height: 6,
        backgroundColor: COLORS.border,
        borderRadius: 3,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
    },
    progressGlow: {
        position: "absolute",
        right: -2,
        top: -4,
        width: 12,
        height: 14,
        backgroundColor: COLORS.primary,
        borderRadius: 6,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
    },
    stagesSection: {
        paddingHorizontal: 24,
        flex: 1,
    },
    stageLine: {
        flexDirection: "row",
        gap: 14,
        marginBottom: 4,
    },
    stageLeft: {
        alignItems: "center",
        width: 14,
    },
    stageDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1.5,
    },
    stageConnector: {
        width: 1.5,
        flex: 1,
        minHeight: 28,
    },
    stageContent: {
        flex: 1,
        paddingBottom: 16,
    },
    stageTopRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 2,
    },
    stageLabel: {
        flex: 1,
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 0.2,
    },
    stageCheck: {
        fontSize: 13,
        fontWeight: "800",
    },
    stageActiveBadge: {
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    stageActiveBadgeText: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    stageDetail: {
        color: COLORS.textSecondary,
        fontSize: 11,
        letterSpacing: 0.2,
        marginBottom: 6,
    },
    stageProgressBg: {
        height: 3,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        overflow: "hidden",
    },
    stageProgressFill: {
        height: "100%",
        borderRadius: 2,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: "center",
        gap: 10,
    },
    footerDots: {
        flexDirection: "row",
        gap: 6,
    },
    footerDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 11,
        letterSpacing: 0.4,
        textAlign: "center",
        fontStyle: "italic",
    },
});