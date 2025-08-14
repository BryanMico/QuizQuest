import { StyleSheet } from "react-native";

export const Modalstyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // dark overlay for contrast
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#ffffff", // white modal background
    borderRadius: 20,
    padding: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000000", // black title
  },
  modalContent: {
    marginBottom: 20,
    color: "#555",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFD83D", // yellow close button
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999, // pill shape
  },
  buttonText: {
    color: "#000000", // black text on yellow
    fontWeight: "bold",
  },
});
