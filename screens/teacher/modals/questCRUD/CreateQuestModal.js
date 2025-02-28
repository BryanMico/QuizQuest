import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import ReusableModal from "../../../components/ModalScreen";

export default function CreateQuestModal({ visible, onClose, onSubmit }) {
  const [questType, setQuestType] = useState("complete_quizzes");
  const [value, setValue] = useState("");
  const [points, setPoints] = useState("");

  const questOptions = [
    { label: "Complete a certain number of quizzes", value: "complete_quizzes" },
    { label: "Achieve a specific score percentage on a quiz", value: "score_percentage" },
    { label: "Reach a total number of points earned", value: "earn_points" },
  ];

  const getPlaceholderText = () => {
    switch (questType) {
      case "complete_quizzes":
        return "Enter the number of quizzes to complete (e.g., 5)";
      case "score_percentage":
        return "Enter the required quiz score percentage (e.g., 80 for 80%)";
      case "earn_points":
        return "Enter the total points to earn (e.g., 500)";
      default:
        return "";
    }
  };

  const handleCreateQuest = () => {
    if (!value || !points || isNaN(value) || isNaN(points)) return;
    onSubmit({ questType, value: Number(value), points: Number(points) });
    setValue("");
    setPoints("");
    onClose();
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Create a Quest">

      <Text style={styles.label}>What type of quest do you want to create?</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={questType}
          onValueChange={(itemValue) => setQuestType(itemValue)}
          style={styles.picker}
        >
          {questOptions.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>What must the user achieve to complete the quest?</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
        placeholder={getPlaceholderText()}
      />

      <Text style={styles.label}>How many points should be rewarded?</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={points}
        onChangeText={setPoints}
        placeholder="Enter the number of reward points (e.g., 100)"
      />

      <TouchableOpacity
        style={[styles.createButton, (!value || !points)]}
        onPress={handleCreateQuest}
      >
        <Text style={styles.buttonText}>Create Quest</Text>
      </TouchableOpacity>
    </ReusableModal>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#386641",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#f1faee",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#386641",
    marginBottom: 10,
    height: 30
  },
  input: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "#f1faee",
    borderColor: "#386641",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: "#386641",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#f2e8cf",
    fontSize: 16,
    fontWeight: "bold",
  },
});
