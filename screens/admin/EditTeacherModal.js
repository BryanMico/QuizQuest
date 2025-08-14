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
            placeholder="Leave blank to keep current"
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
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#184e77",
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "transparent",
    paddingLeft: 5,
  },
  buttonContainer: {
    width: "100%",
  },
  updateButton: {
    width: "100%",
    backgroundColor: "#184e77",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#f2e8cf",
    fontSize: 18,
    fontWeight: "600",
  },
});