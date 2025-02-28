import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ReusableModal from "../../../components/ModalScreen";

export default function AddStudentModal({ visible, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAddStudent = () => {
    if (!name || !studentID || !username || !password) return;
    onSubmit({ name, studentID, username, password });
    setName("");
    setStudentID("");
    setUsername("");
    setPassword("");
    onClose();
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Add a Student">
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Student ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter student ID"
          value={studentID}
          onChangeText={setStudentID}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#386641" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddStudent}>
        <Text style={styles.buttonText}>Add Student</Text>
      </TouchableOpacity>
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
  addButton: {
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
