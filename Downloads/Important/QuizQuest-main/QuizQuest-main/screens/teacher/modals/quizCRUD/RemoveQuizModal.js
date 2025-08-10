import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Added for Teacher ID retrieval
import ReusableModal from "../../../components/ModalScreen";
import ErrorModal from "../../../components/ErrorModal";
import LoadingScreen from "../../../components/LoadingScreen";
import { deleteQuiz } from "../../../../services/quizService";

export default function RemoveQuizModal({ visible, onClose, onConfirm, quizTitle, quiz }) {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRemoveQuiz = async () => {
    setLoading(true);
    try {
      const teacherId = await AsyncStorage.getItem('teacherId');
      if (!teacherId) {
        throw new Error("Teacher ID is missing.");
      }

      await deleteQuiz(quiz._id, teacherId);  // Passing both Quiz ID and Teacher ID
      Alert.alert("Success", "Quiz removed successfully.");
      onConfirm();
      onClose();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to remove Quiz.";
      setErrorMessage(errorMsg);
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Confirm Removal">
      {loading && <LoadingScreen />}

      <ErrorModal
        visible={errorVisible}
        title="Removal Failed"
        message={errorMessage}
        onTryAgain={handleRemoveQuiz}
        onCancel={() => setErrorVisible(false)}
      />

      <Text style={styles.confirmText}>
        Are you sure you want to remove <Text style={styles.quizTitle}>{quizTitle}</Text>?
      </Text>
      <TouchableOpacity style={styles.removeButton} onPress={handleRemoveQuiz}>
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
  quizTitle: {
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
