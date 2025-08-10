import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import ReusableModal from "../../../components/ModalScreen";

export default function EditQuestModal({ visible, onClose, onSubmit, questData }) {
  const [questType, setQuestType] = useState(questData?.type || "complete_quizzes");
  const [value, setValue] = useState(questData?.requirement || 1);
  const [points, setPoints] = useState(questData?.points || 100);

  const questOptions = [
    { label: "Complete a certain number of quizzes", value: "complete_quizzes" },
    { label: "Achieve a specific score percentage on a quiz", value: "score_percentage" },
    { label: "Reach a total number of points earned", value: "earn_points" },
  ];

  const handleUpdateQuest = () => {
    if (!value || !points) return;
    onSubmit({ id: questData.id, questType, value, points });
    onClose();
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Edit Quest">
      <Text style={styles.label}>What type of quest do you want to create?</Text>
      <Picker selectedValue={questType} onValueChange={setQuestType} style={styles.picker}>
        {questOptions.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>

      <Text style={styles.label}>What must the user achieve to complete the quest?</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(value)}
        onChangeText={(text) => setValue(Number(text))}
      />

      <Text style={styles.label}>How many points should be rewarded?</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(points)}
        onChangeText={(text) => setPoints(Number(text))}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdateQuest}>
        <Text style={styles.buttonText}>Update Quest</Text>
      </TouchableOpacity>
    </ReusableModal>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  picker: { width: "100%", backgroundColor: "#f1faee", borderRadius: 5, marginBottom: 10, height: 30 },
  input: { width: "100%", backgroundColor: "#f1faee", padding: 10, borderRadius: 5, marginBottom: 10 },
  saveButton: { backgroundColor: "#386641", padding: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#f2e8cf", fontSize: 16 },
});
