import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ReusableModal from "../components/ModalScreen";
import ErrorModal from "../components/ErrorModal";
import LoadingScreen from "../components/LoadingScreen";
import { updateTeacher } from "../../services/adminService";

export default function EditTeacherModal({ visible, onClose, teacher, onUpdate }) {
  const [name, setName] = useState(teacher?.name || "");
  const [subject, setSubject] = useState(teacher?.subject || "");
  const [username, setUsername] = useState(teacher?.username || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateTeacher = async () => {
    if (
      name === teacher?.name &&
      subject === teacher?.subject &&
      username === teacher?.username &&
      !password
    ) {
      setErrorMessage('Please update at least one field.');
      setErrorVisible(true);
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        name: name || teacher.name,
        subject: subject || teacher.subject,
        username: username || teacher.username,
        password: password || teacher.password,
      };

      await updateTeacher(teacher._id, updatedData);
      Alert.alert("Success", "Teacher updated successfully.");
      onUpdate(updatedData);
      setName('');
      setUsername('');
      setPassword('');
      setSubject('');
      onClose();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update teacher.";
      setErrorMessage(errorMsg);
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ReusableModal visible={visible} onClose={onClose} title="Edit Teacher">
        {loading && <LoadingScreen />}

        <ErrorModal
          visible={errorVisible}
          title="Teacher Update Failed"
          message={errorMessage}
          onTryAgain={() => {
            setErrorVisible(false);
            handleUpdateTeacher();
          }}
          onCancel={() => setErrorVisible(false)}
        />

        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} placeholder={`${teacher?.name || ""}`}
          value={name} onChangeText={setName} />

        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} placeholder={`${teacher?.username || ""}`}
          value={username} onChangeText={setUsername} />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="New Password (optional)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={{ padding: 5 }} onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#386641" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Subject</Text>
        <TextInput style={styles.input} placeholder={`${teacher?.subject || ""}`}
          value={subject} onChangeText={setSubject} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateTeacher}>
            <Text style={styles.buttonText}>Update Teacher</Text>
          </TouchableOpacity>
        </View>
      </ReusableModal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "#f1faee",
    borderColor: "#386641",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#386641",
    marginBottom: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#f1faee",
    borderColor: "#386641",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  buttonContainer: {
    width: "100%",
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