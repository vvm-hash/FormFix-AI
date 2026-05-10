import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  StatusBar,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  useSignIn,
  useSignUp,
  useAuth,
} from "@clerk/expo";

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

type AuthMode = "signin" | "signup";

function AuthButton({
  label,
  icon,
  onPress,
  variant,
  loading,
}: {
  label: string;
  icon: string;
  onPress: () => void;
  variant: "primary" | "outline";
  loading?: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();

  return (
    <Animated.View
      style={[styles.authBtnWrapper, { transform: [{ scale: scaleAnim }] }]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading}
      >
        {variant === "primary" ? (
          <LinearGradient
            colors={["#FFFFFF", "#F0F0F0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.authBtnPrimary}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.background} size="small" />
            ) : (
              <>
                <Text style={styles.authBtnPrimaryIcon}>{icon}</Text>
                <Text style={styles.authBtnPrimaryLabel}>{label}</Text>
              </>
            )}
          </LinearGradient>
        ) : (
          <View style={styles.authBtnOutline}>
            <Text style={styles.authBtnOutlineIcon}>{icon}</Text>
            <Text style={styles.authBtnOutlineLabel}>{label}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function InputField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
  focused,
  onFocus,
  onBlur,
}: {
  label: string;
  icon: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "email-address" | "default" | "number-pad";
  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputField, focused && styles.inputFieldFocused]}>
        <Text style={styles.inputIcon}>{icon}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={`${COLORS.textSecondary}50`}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType ?? "default"}
          returnKeyType={returnKeyType ?? "done"}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={COLORS.primary}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>
    </View>
  );
}

function ModeToggle({
  mode,
  onSwitch,
  opacity,
}: {
  mode: AuthMode;
  onSwitch: (m: AuthMode) => void;
  opacity: Animated.Value;
}) {
  const slideAnim = useRef(
    new Animated.Value(mode === "signin" ? 0 : 1)
  ).current;

  const handleSwitch = (next: AuthMode) => {
    Animated.spring(slideAnim, {
      toValue: next === "signin" ? 0 : 1,
      useNativeDriver: false,
      speed: 20,
      bounciness: 4,
    }).start();
    onSwitch(next);
  };

  const indicatorLeft = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["2%", "50%"],
  });

  return (
    <Animated.View style={[styles.modeToggleWrapper, { opacity }]}>
      <View style={styles.modeToggle}>
        <Animated.View style={[styles.modeIndicator, { left: indicatorLeft }]}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modeIndicatorGradient}
          />
        </Animated.View>

        <Pressable style={styles.modeBtn} onPress={() => handleSwitch("signin")}>
          <Text
            style={[
              styles.modeBtnText,
              mode === "signin" && styles.modeBtnTextActive,
            ]}
          >
            Sign In
          </Text>
        </Pressable>

        <Pressable style={styles.modeBtn} onPress={() => handleSwitch("signup")}>
          <Text
            style={[
              styles.modeBtnText,
              mode === "signup" && styles.modeBtnTextActive,
            ]}
          >
            Sign Up
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}



export default function LoginScreen() {
  const router = useRouter();
  const auth = useAuth();

  const signInHook = useSignIn();
  const signUpHook = useSignUp();

  const [mode, setMode] = useState<AuthMode>("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [focusConfirm, setFocusConfirm] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoSlide = useRef(new Animated.Value(-30)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(30)).current;
  const buttonsFade = useRef(new Animated.Value(0)).current;
  const orb1 = useRef(new Animated.Value(0.8)).current;
  const orb2 = useRef(new Animated.Value(0.9)).current;
  const scanLine = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(logoSlide, {
          toValue: 0,
          useNativeDriver: true,
          speed: 12,
          bounciness: 4,
        }),
      ]),
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(cardSlide, {
          toValue: 0,
          useNativeDriver: true,
          speed: 12,
          bounciness: 4,
        }),
      ]),
      Animated.timing(buttonsFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1, { toValue: 1.1, duration: 3500, useNativeDriver: true }),
        Animated.timing(orb1, { toValue: 0.8, duration: 3500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orb2, { toValue: 1.12, duration: 2800, useNativeDriver: true }),
        Animated.timing(orb2, { toValue: 0.88, duration: 2800, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(800),
      ])
    ).start();
  }, []);

  const scanTranslate = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [-height * 0.4, height * 0.4],
  });

  const extractClerkError = (err: unknown, fallback: string): string => {
    if (
      err &&
      typeof err === "object" &&
      "errors" in err &&
      Array.isArray((err as { errors: unknown[] }).errors)
    ) {
      const clerkErr = err as {
        errors: Array<{ longMessage?: string; message?: string }>;
      };
      return (
        clerkErr.errors[0]?.longMessage ??
        clerkErr.errors[0]?.message ??
        fallback
      );
    }
    return fallback;
  };

  const crossfade = (callback: () => void) => {
    Animated.timing(contentFade, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setError("");

  };

  const handleModeSwitch = (next: AuthMode) => {
    crossfade(() => {
      setMode(next);
      clearForm();
    });
  };

  const handleSignIn = async () => {
    if (!signInHook.signIn) return;

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res: any = await signInHook.signIn.create({
        identifier: email.trim(),
        password,
      });

      console.log("FULL SIGNIN RESPONSE:");
      console.log(JSON.stringify(res, null, 2));

      if (!res?.error) {
        router.replace("/(main)/home");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err: any) {
      console.log("SIGNIN ERROR:", err);

      if (err?.errors?.[0]?.code === "session_exists") {
        router.replace("/(main)/home");
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signUpHook.signUp) return;

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signUpHook.signUp.create({
        emailAddress: email.trim(),
        password,
      });

      console.log("SIGNUP CREATED");

      router.replace("/(main)/home");
    } catch (err: unknown) {
      setError(
        extractClerkError(err, "Could not create account.")
      );
    } finally {
      setLoading(false);
    }
  };





  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <Animated.View style={[styles.orb1, { transform: [{ scale: orb1 }] }]}>
        <LinearGradient
          colors={["#00F5D412", "#7B61FF06"]}
          style={styles.orbGradient}
        />
      </Animated.View>
      <Animated.View style={[styles.orb2, { transform: [{ scale: orb2 }] }]}>
        <LinearGradient
          colors={["#7B61FF14", "#00F5D408"]}
          style={styles.orbGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.scanLineWrapper,
          { transform: [{ translateY: scanTranslate }] },
        ]}
      >
        <LinearGradient
          colors={["transparent", `${COLORS.primary}10`, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.scanLineGradient}
        />
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          <Animated.View
            style={[
              styles.logoSection,
              { opacity: fadeAnim, transform: [{ translateY: logoSlide }] },
            ]}
          >
            <View style={styles.logoBadge}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoBadgeGradient}
              >
                <Text style={styles.logoBadgeIcon}>⚡</Text>
              </LinearGradient>
            </View>
            <View style={styles.wordmarkRow}>
              <Text style={styles.wordmarkForm}>FORM</Text>
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.wordmarkFixPill}
              >
                <Text style={styles.wordmarkFix}>FIX</Text>
              </LinearGradient>
              <Text style={styles.wordmarkAI}> AI</Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[styles.subtitleBlock, { opacity: subtitleFade }]}
          >
            <Text style={styles.subtitle}>
              AI-Powered Sports Injury Prevention
            </Text>
            <View style={styles.tagRow}>
              {["Biomechanics", "Real-time", "Precision"].map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              { opacity: cardFade, transform: [{ translateY: cardSlide }] },
            ]}
          >
            <LinearGradient
              colors={["#1C2333", "#121826"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderDot} />
                <Text style={styles.cardHeaderText}>
                  {mode === "signin"
                    ? "Athlete Login"
                    : "Create Account"}
                </Text>
              </View>
              <View style={styles.featureRow}>
                {[
                  { icon: "🎯", label: "Injury Detection" },
                  { icon: "📊", label: "Form Analysis" },
                  { icon: "⚡", label: "AI Insights" },
                ].map((feat) => (
                  <View key={feat.label} style={styles.featureItem}>
                    <Text style={styles.featureIcon}>{feat.icon}</Text>
                    <Text style={styles.featureLabel}>{feat.label}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>

          <ModeToggle
            mode={mode}
            onSwitch={handleModeSwitch}
            opacity={buttonsFade}
          />

          <Animated.View style={{ opacity: contentFade, gap: 24 }}>
            <>
              <View style={styles.inputBlock}>
                <InputField
                  label="EMAIL"
                  icon="◎"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (error) setError("");
                  }}
                  placeholder="athlete@example.com"
                  keyboardType="email-address"
                  returnKeyType="next"
                  focused={focusEmail}
                  onFocus={() => setFocusEmail(true)}
                  onBlur={() => setFocusEmail(false)}
                />

                <InputField
                  label="PASSWORD"
                  icon="⊛"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (error) setError("");
                  }}
                  placeholder="Enter your password"
                  secureTextEntry
                  returnKeyType={mode === "signup" ? "next" : "done"}
                  onSubmitEditing={
                    mode === "signin" ? handleSignIn : undefined
                  }
                  focused={focusPassword}
                  onFocus={() => setFocusPassword(true)}
                  onBlur={() => setFocusPassword(false)}
                />

                {mode === "signup" && (
                  <InputField
                    label="CONFIRM PASSWORD"
                    icon="⊛"
                    value={confirmPassword}
                    onChangeText={(t) => {
                      setConfirmPassword(t);
                      if (error) setError("");
                    }}
                    placeholder="Re-enter your password"
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleSignUp}
                    focused={focusConfirm}
                    onFocus={() => setFocusConfirm(true)}
                    onBlur={() => setFocusConfirm(false)}
                  />
                )}

                {!!error && (
                  <View style={styles.errorRow}>
                    <Text style={styles.errorIcon}>⚠</Text>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}
              </View>

              <View style={styles.buttons}>
                <AuthButton
                  label={mode === "signin" ? "Sign In" : "Create Account"}
                  icon="→"
                  onPress={mode === "signin" ? handleSignIn : handleSignUp}
                  variant="primary"
                  loading={loading}
                />
                <AuthButton
                  label="Continue as Guest"
                  icon="◎"
                  onPress={() => router.replace("/(main)/home")}
                  variant="outline"
                />
              </View>
            </>
          </Animated.View>

          <Text style={styles.legal}>
            By continuing, you agree to our{" "}
            <Text style={styles.legalLink}>Terms of Service</Text> &{" "}
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  scrollContent: {
    flexGrow: 1,
  },
  orb1: {
    position: "absolute",
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    overflow: "hidden",
  },
  orb2: {
    position: "absolute",
    bottom: height * 0.05,
    left: -width * 0.25,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    overflow: "hidden",
  },
  orbGradient: { flex: 1, borderRadius: width * 0.425 },
  scanLineWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 60,
    top: 0,
    pointerEvents: "none",
  },
  scanLineGradient: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 36,
    gap: 24,
  },
  logoSection: {
    alignItems: "center",
    gap: 14,
  },
  logoBadge: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  logoBadgeGradient: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  logoBadgeIcon: { fontSize: 28 },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  wordmarkForm: {
    fontSize: 40,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  wordmarkFixPill: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  wordmarkFix: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.background,
    letterSpacing: -0.5,
  },
  wordmarkAI: {
    fontSize: 40,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  subtitleBlock: {
    alignItems: "center",
    gap: 12,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    letterSpacing: 0.3,
    fontWeight: "500",
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    backgroundColor: "#1F2937",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardGradient: {
    padding: 20,
    gap: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardHeaderDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  cardHeaderText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featureItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#0B0F1A60",
  },
  featureIcon: { fontSize: 20 },
  featureLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  modeToggleWrapper: {
    marginBottom: -8,
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    position: "relative",
    overflow: "hidden",
  },
  modeIndicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    width: "48%",
    borderRadius: 10,
    overflow: "hidden",
  },
  modeIndicatorGradient: {
    flex: 1,
    opacity: 0.22,
  },
  modeBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 10,
    zIndex: 1,
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.4,
  },
  modeBtnTextActive: {
    color: COLORS.primary,
  },
  inputBlock: {
    gap: 12,
  },
  inputWrapper: {
    gap: 6,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginLeft: 2,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    gap: 10,
    height: 52,
  },
  inputFieldFocused: {
    borderColor: `${COLORS.primary}60`,
    backgroundColor: `${COLORS.primary}06`,
  },
  inputIcon: {
    fontSize: 14,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "500",
    paddingVertical: 0,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: `${COLORS.danger}12`,
    borderWidth: 1,
    borderColor: `${COLORS.danger}30`,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  errorIcon: {
    color: COLORS.danger,
    fontSize: 13,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    lineHeight: 17,
  },
  buttons: {
    gap: 12,
  },
  authBtnWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  authBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    gap: 10,
    borderRadius: 16,
  },
  authBtnPrimaryIcon: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.background,
  },
  authBtnPrimaryLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.background,
    letterSpacing: 0.3,
  },
  authBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    gap: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  authBtnOutlineIcon: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  authBtnOutlineLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  legal: {
    textAlign: "center",
    color: `${COLORS.textSecondary}70`,
    fontSize: 11,
    lineHeight: 18,
  },
  legalLink: {
    color: COLORS.textSecondary,
    textDecorationLine: "underline",
  },

});