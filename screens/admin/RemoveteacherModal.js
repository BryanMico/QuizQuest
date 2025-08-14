import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import ReusableModal from "../components/ModalScreen";
import ErrorModal from "../components/ErrorModal";
import LoadingScreen from "../components/LoadingScreen";
import { removeTeacher } from "../../services/adminService";

export default function RemoveTeacherModal({ visible, onClose, onConfirm, teacher, teacherName }) {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRemoveTeacher = async () => {
    setLoading(true);

    try {
        await removeTeacher(teacher._id);
        Alert.alert("Success", "Teacher removed successfully.");
        onConfirm();
        onClose();
    } catch (error) {
        const errorMsg = error.message || "Failed to remove teacher.";
        setErrorMessage(errorMsg);
        setErrorVisible(true);
    } finally {
        setLoading(false);
    }
};

  return (
    <>
      <ReusableModal visible={visible} onClose={onClose} title="Confirm Removal">
        {loading && <LoadingScreen />}

        <ErrorModal
          visible={errorVisible}
          title="Removal Failed"
          message={errorMessage}
          onTryAgain={handleRemoveTeacher}
          onCancel={() => setErrorVisible(false)}
        />

        <Text style={styles.confirmText}>
          Are you sure you want to remove <Text style={styles.teacherName}>{teacherName}</Text>?
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveTeacher}>
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </ReusableModal>
    </>
  );
}

const styles = StyleSheet.create({
    confirmText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#184e77",
  },
  teacherName: {
    fontWeight: "bold",
    color: "#d62828", // Keeping red for emphasis
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  removeButton: {
    backgroundColor: "#184e77",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#f2e8cf",
    fontSize: 16,
    fontWeight: "600",
  },
});
