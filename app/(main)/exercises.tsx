import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2;

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

const EXERCISES = [
  { id: "running", label: "Running", icon: "⚡", tag: "Cardio" },
  { id: "squat", label: "Squat", icon: "🔻", tag: "Strength" },
  { id: "deadlift", label: "Deadlift", icon: "🏋", tag: "Strength" },
  { id: "pushup", label: "Push-Up", icon: "💪", tag: "Calisthenics" },
  { id: "jumpshot", label: "Jump Shot", icon: "🏀", tag: "Sport" },
  { id: "bowling", label: "Bowling Action", icon: "🎳", tag: "Sport" },
  { id: "tennis", label: "Tennis Serve", icon: "🎾", tag: "Sport" },
  { id: "custom", label: "Custom Exercise", icon: "+", tag: "Custom" },
];

function ExerciseCard({
  exercise,
  selected,
  onPress,
  index,
}: {
  exercise: (typeof EXERCISES)[0];
  selected: boolean;
  onPress: () => void;
  index: number;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: index * 60,
        useNativeDriver: true,
        speed: 14,
        bounciness: 4,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const isCustom = exercise.id === "custom";

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }, { translateY }],
        width: CARD_WIDTH,
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {selected ? (
          <LinearGradient
            colors={["#00F5D418", "#7B61FF14"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, styles.cardSelected]}
          >
            <CardInner exercise={exercise} selected={selected} />
          </LinearGradient>
        ) : (
          <View style={styles.card}>
            <CardInner exercise={exercise} selected={selected} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function CardInner({
  exercise,
  selected,
}: {
  exercise: (typeof EXERCISES)[0];
  selected: boolean;
}) {
  const isCustom = exercise.id === "custom";
  return (
    <>
      <View
        style={[
          styles.iconContainer,
          selected && styles.iconContainerSelected,
          isCustom && styles.iconContainerCustom,
        ]}
      >
        <Text style={styles.icon}>{exercise.icon}</Text>
      </View>
      <Text style={[styles.cardLabel, selected && styles.cardLabelSelected]}>
        {exercise.label}
      </Text>
      <View
        style={[styles.tagPill, selected && styles.tagPillSelected]}
      >
        <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
          {exercise.tag}
        </Text>
      </View>
      {selected && <View style={styles.selectedIndicator} />}
    </>
  );
}

export default function ExercisesScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [customName, setCustomName] = useState("");
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(16)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const customInputHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (selected) {
      Animated.parallel([
        Animated.timing(buttonFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(buttonSlide, {
          toValue: 0,
          useNativeDriver: true,
          speed: 16,
          bounciness: 4,
        }),
      ]).start();
    }

    Animated.timing(customInputHeight, {
      toValue: selected === "custom" ? 1 : 0,
      duration: 260,
      useNativeDriver: false,
    }).start();
  }, [selected]);

  const filtered = EXERCISES.filter((e) =>
    e.label.toLowerCase().includes(search.toLowerCase())
  );

  const customInputMaxHeight = customInputHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 72],
  });

  const customInputOpacity = customInputHeight.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[styles.header, { opacity: headerFade }]}>
          <View style={styles.stepRow}>
            <View style={styles.stepActive} />
            <View style={styles.stepInactive} />
            <View style={styles.stepInactive} />
            <View style={styles.stepInactive} />
          </View>
          <Text style={styles.title}>Select Movement</Text>
          <Text style={styles.subtitle}>
            Choose the exercise to analyze
          </Text>
        </Animated.View>

        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor={COLORS.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.gridRow}>
            {filtered.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                selected={selected === exercise.id}
                onPress={() => setSelected(exercise.id)}
                index={index}
              />
            ))}
          </View>

          <Animated.View
            style={{
              maxHeight: customInputMaxHeight,
              opacity: customInputOpacity,
              overflow: "hidden",
              marginTop: 4,
            }}
          >
            <View style={styles.customInputWrapper}>
              <LinearGradient
                colors={["#7B61FF20", "#00F5D410"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.customInputGradient}
              >
                <TextInput
                  style={styles.customInput}
                  placeholder="Enter exercise name..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={customName}
                  onChangeText={setCustomName}
                />
              </LinearGradient>
            </View>
          </Animated.View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {selected && (
          <Animated.View
            style={[
              styles.bottomBar,
              {
                opacity: buttonFade,
                transform: [{ translateY: buttonSlide }],
              },
            ]}
          >
            <LinearGradient
              colors={["#0B0F1A00", "#0B0F1Aee", "#0B0F1A"]}
              style={styles.bottomGradient}
            >
              <Pressable
                onPress={() => router.push("/(main)/session")}
                style={({ pressed }) => [
                  styles.continueBtn,
                  pressed && { opacity: 0.88 },
                ]}
              >
                <LinearGradient
                  colors={["#00F5D4", "#00C4AA", "#7B61FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.continueBtnGradient}
                >
                  <Text style={styles.continueBtnText}>Continue</Text>
                  <Text style={styles.continueBtnArrow}>→</Text>
                </LinearGradient>
              </Pressable>
            </LinearGradient>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
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
    paddingBottom: 20,
  },
  stepRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 20,
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
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  searchWrapper: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    gap: 10,
  },
  searchIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
    marginTop: -2,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    letterSpacing: 0.2,
  },
  grid: {
    paddingHorizontal: 24,
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    minHeight: 130,
    width: CARD_WIDTH,
    justifyContent: "space-between",
  },
  cardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1F293780",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  iconContainerSelected: {
    backgroundColor: "#00F5D418",
  },
  iconContainerCustom: {
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderStyle: "dashed",
  },
  icon: {
    fontSize: 22,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  cardLabelSelected: {
    color: COLORS.primary,
  },
  tagPill: {
    alignSelf: "flex-start",
    backgroundColor: "#1F2937",
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagPillSelected: {
    backgroundColor: "#00F5D412",
  },
  tagText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  tagTextSelected: {
    color: COLORS.primary,
  },
  selectedIndicator: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  customInputWrapper: {
    marginTop: 8,
    borderRadius: 14,
    overflow: "hidden",
  },
  customInputGradient: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.accent,
    padding: 1,
  },
  customInput: {
    backgroundColor: COLORS.card,
    borderRadius: 13,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: COLORS.textPrimary,
    fontSize: 14,
    letterSpacing: 0.3,
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
  },
  continueBtn: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  continueBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  continueBtnText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  continueBtnArrow: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "800",
  },
});