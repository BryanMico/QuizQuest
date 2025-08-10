import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import { removeStudent } from "../../../../services/teacherService";
import ErrorModal from "../../../components/ErrorModal";
import LoadingScreen from "../../../components/LoadingScreen";

export default function RemoveStudentModal({
  visible,
  onClose,
  onConfirm,
  studentName,
  student,
}) {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRemoveStudent = async () => {
    setLoading(true);  // Start loading
    try {
      await removeStudent(student._id);
      Alert.alert("Success", "Student removed successfully.");
      onConfirm();
      onClose();
    } catch (error) {
      const errorMsg = error.message || "Failed to remove Student.";
      setErrorMessage(errorMsg);
      setErrorVisible(true)
    } finally {
      setLoading(false);  // Stop loading after success or failure
    }
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Confirm Removal">
      {loading && <LoadingScreen />}

      <ErrorModal
        visible={errorVisible}
        title="Removal Failed"
        message={errorMessage}
        onTryAgain={handleRemoveStudent}
        onCancel={() => setErrorVisible(false)}
      />
      <Text style={styles.confirmText}>
        Are you sure you want to remove <Text style={styles.studentName}> {studentName} </Text>?
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.removeButton} onPress={handleRemoveStudent}>
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </ReusableModal>
  );
}

const styles = StyleSheet.create({
  confirmText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  studentName: {
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
