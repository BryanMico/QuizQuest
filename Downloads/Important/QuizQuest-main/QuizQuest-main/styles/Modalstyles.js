import { StyleSheet } from "react-native";

export const Modalstyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    position: "relative", // Ensures absolute positioning works
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalContent: {
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#bc4749",
    padding: 5,
    borderRadius: 5
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
})