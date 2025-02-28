import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import MaterialIcons
import ReusableModal from "../components/ModalScreen";

export default function AddTeacherModal({ visible, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const handleAddTeacher = () => {
    if (!name || !subject || !username || !password) return;
    onSubmit({ name, subject, username, password });
    setName("");
    setSubject("");
    setUsername("");
    setPassword("");
    onClose();
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Add a Teacher">
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Fullname"
        value={name}
        onChangeText={setName}
      />
            <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
            <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} 
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#386641" />
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Subject</Text>
      <TextInput
        style={styles.input}
        placeholder="Subject (e.g., Math)"
        value={subject}
        onChangeText={setSubject}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTeacher}>
          <Text style={styles.buttonText}>Add Teacher</Text>
        </TouchableOpacity>
      </View>
    </ReusableModal>
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
