import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ReusableModal from "../../../components/ModalScreen";

export default function RemoveQuestModal({ visible, onClose, onConfirm, questTitle }) {
  return (
    <ReusableModal visible={visible} onClose={onClose} title="Confirm Removal">
      <Text style={styles.confirmText}>
        Are you sure you want to remove <Text style={styles.questTitle}>{questTitle}</Text>?
      </Text>
      <TouchableOpacity style={styles.removeButton} onPress={onConfirm}>
        <Text style={styles.buttonText}>Remove</Text>
      </TouchableOpacity>
    </ReusableModal>
  );
}

const styles = StyleSheet.create({
  confirmText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  questTitle: {
    fontWeight: "bold",
    color: "#d62828",
  },
  removeButton: {
    backgroundColor: "#bc4749",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
