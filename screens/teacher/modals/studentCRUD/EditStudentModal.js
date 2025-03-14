import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ReusableModal from "../../../components/ModalScreen";
import { updateStudent } from "../../../../services/teacherService";
import ErrorModal from "../../../components/ErrorModal";
import LoadingScreen from "../../../components/LoadingScreen";

export default function EditStudentModal({ visible, onClose, student, onUpdate }) {
  const [name, setName] = useState(student?.name || "");
  const [studentID, setStudentID] = useState(student?.studentID || "");
  const [username, setUsername] = useState(student?.username || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateStudent = async () => {
    if (
      name === student?.name &&
      studentID === student?.studentID &&
      username === student?.username &&
      !password
    ) {
      setErrorMessage('Please update at least one field.');
      setErrorVisible(true);
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        name: name || student.name,
        studentID: studentID || student.studentID,
        username: username || student.username,
        password: password || student.password,
      };

      await updateStudent(student._id, updatedData);
      Alert.alert("Success", "Student updated successfully.");
      onUpdate(updatedData);
      setName('');
      setUsername('');
      setPassword('');
      setStudentID('');
      onClose();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update Student.";
      setErrorMessage(errorMsg);
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Edit Student">
      {loading && <LoadingScreen />}

      <ErrorModal
        visible={errorVisible}
        title="Student Update Failed"
        message={errorMessage}
        onTryAgain={() => {
          setErrorVisible(false);
          handleUpdateStudent();
        }}
        onCancel={() => setErrorVisible(false)}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder={`${student?.name || ""}`}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Student ID</Text>
        <TextInput
          style={styles.input}
          placeholder={`${student?.studentID || ""}`}
          value={studentID}
          onChangeText={setStudentID}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder={`${student?.username || ""}`}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Leave blank to keep current"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#386641" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateStudent}>
          <Text style={styles.buttonText}>Update Student</Text>
        </TouchableOpacity>
      </View>
    </ReusableModal>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#386641",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "#f1faee",
    borderColor: "#386641",
    padding: 10,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#f1faee",
    borderColor: "#386641",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  updateButton: {
    backgroundColor: "#386641",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#f2e8cf",
    fontSize: 16,
  },
});
