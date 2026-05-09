import { View, Text } from "react-native";

export default function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0F1A",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
        Splash Screen
      </Text>
    </View>
  );
}