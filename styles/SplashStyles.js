import { StyleSheet } from "react-native";

const SplashStyles = StyleSheet.create({
  splashcontainer: {
    flex: 1,
    backgroundColor: "#27AE60", // green background
    justifyContent: "center",
    alignItems: "center",
  },
  splash: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    tintColor: "#000000", // black tint for logo/image
  },
});

export default SplashStyles;
