import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import { deleteQuest } from "../../../../services/questService";

export default function RemoveQuestModal({ 
  visible, 
  onClose, 
  onConfirm, 
  questTitle, 
  questId 
}) {
  
  const handleConfirm = async () => {
    try {
      const response = await deleteQuest(questId);
      Alert.alert("Success", response.message || "Quest removed successfully");
      onConfirm();  // Refresh data or perform actions after deletion
      onClose();     // Close modal after success
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete quest");
    }
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Confirm Removal">
      <Text style={styles.confirmText}>
        Are you sure you want to remove <Text style={styles.questTitle}>{questTitle}</Text>?
      </Text>
      <TouchableOpacity style={styles.removeButton} onPress={handleConfirm}>
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
