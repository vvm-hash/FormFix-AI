import React, { useRef, useEffect } from "react";
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
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

interface ExerciseCardProps {
  title: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function ExerciseCard({ title, icon, selected, onPress, style }: ExerciseCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const selectedAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(selectedAnim, {
      toValue: selected ? 1 : 0,
      duration: 240,
      useNativeDriver: false,
    }).start();
  }, [selected]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.94, useNativeDriver: true, speed: 50, bounciness: 4 }),
      Animated.timing(glowAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }),
      Animated.timing(glowAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const borderColor = selectedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  const shadowOpacity = selectedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        style,
        {
          transform: [{ scale: scaleAnim }],
          borderColor,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity,
          shadowRadius: 12,
          elevation: selected ? 8 : 0,
        },
      ]}
    >
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {selected ? (
          <LinearGradient
            colors={["#00F5D418", "#7B61FF10"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.inner}
          >
            <CardContent icon={icon} title={title} selected={selected} />
          </LinearGradient>
        ) : (
          <Animated.View style={styles.inner}>
            <CardContent icon={icon} title={title} selected={selected} />
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function CardContent({ icon, title, selected }: { icon: string; title: string; selected: boolean }) {
  return (
    <>
      <Animated.View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
        <Text style={styles.icon}>{icon}</Text>
      </Animated.View>
      <Text style={[styles.title, selected && styles.titleSelected]} numberOfLines={2}>
        {title}
      </Text>
      {selected && <View style={styles.dot} />}
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { View } from "react-native";

function View2({ style, children }: { style?: ViewStyle; children?: React.ReactNode }) {
  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: COLORS.card,
    overflow: "hidden",
  },
  inner: {
    padding: 16,
    minHeight: 110,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#1F293780",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  iconWrapSelected: {
    backgroundColor: "#00F5D418",
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.2,
    flex: 1,
  },
  titleSelected: {
    color: COLORS.primary,
  },
  dot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
});