import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/colors";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function GradientButton({ title, onPress, style }: GradientButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 6,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.75],
  });

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 28],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Animated.View
        style={[
          styles.glowWrapper,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
              shadowRadius: glowRadius,
            },
          ]}
        />
        <LinearGradient
          colors={["#00F5D4", "#00C4AA", "#7B61FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.inner}>
            <Text style={styles.label}>{title}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glowWrapper: {
    position: "relative",
    borderRadius: 16,
    alignSelf: "stretch",
  },
  glow: {
    position: "absolute",
    top: 4,
    left: 8,
    right: 8,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    elevation: 16,
  },
  gradient: {
    borderRadius: 16,
    overflow: "hidden",
  },
  inner: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
});