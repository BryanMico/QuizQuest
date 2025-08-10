import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import ErrorModal from "../../../components/ErrorModal";
import LoadingScreen from "../../../components/LoadingScreen";
import { removeReward } from "../../../../services/rewardService";

export default function RemoveRewardModal({ 
  visible, 
  onClose, 
  onSubmit, 
  rewardTitle, 
  rewardId 
}) {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRemoveReward = async () => {
    setLoading(true); // Start loading
    try {
      if (!rewardId) {
        throw new Error("Reward ID is missing.");
      }

      await removeReward(rewardId);
      Alert.alert("Success", "Reward removed successfully.");
      onSubmit?.();  // Ensures this only runs if `onSubmit` is provided
      onClose();     // Close modal after successful deletion
    } catch (error) {
      const errorMsg = error.message || "Failed to remove the reward.";
      setErrorMessage(errorMsg);
      setErrorVisible(true);
    } finally {
      setLoading(false);  // Stop loading in all cases
    }
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Confirm Removal">
      <LoadingScreen visible={loading} />

      <ErrorModal
        visible={errorVisible}
        title="Reward Removal Failed"
        message={errorMessage}
        onTryAgain={() => {
          setErrorVisible(false);
          handleRemoveReward();
        }}
        onCancel={() => setErrorVisible(false)}
      />

      <Text style={styles.confirmText}>
        Are you sure you want to remove <Text style={styles.rewardTitle}>{rewardTitle}</Text>?
      </Text>

      <TouchableOpacity style={styles.removeButton} onPress={handleRemoveReward}>
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
  rewardTitle: {
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
