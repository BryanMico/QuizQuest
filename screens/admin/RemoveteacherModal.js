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
  },
  teacherName: {
    fontWeight: "bold",
    color: "#d62828",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
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
