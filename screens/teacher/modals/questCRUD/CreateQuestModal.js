import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import ReusableModal from "../../../components/ModalScreen";
import { createQuest } from "../../../../services/questService";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function CreateQuestModal({ visible, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questType, setQuestType] = useState("complete_quizzes");
  const [targetValue, setTargetValue] = useState("");
  const [points, setPoints] = useState("");
  const [loading, setLoading] = useState(false);

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

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setQuestType("complete_quizzes");
    setTargetValue("");
    setPoints("");
  };

  const handleCreateQuest = async () => {
    // Validate input
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a quest title");
      return;
    }
    
    if (!targetValue || isNaN(targetValue)) {
      Alert.alert("Error", "Please enter a valid target value");
      return;
    }
    
    if (!points || isNaN(points)) {
      Alert.alert("Error", "Please enter valid reward points");
      return;
    }
    
    setLoading(true);
    
    try {
      // Get teacherId from AsyncStorage
      const teacherId = await AsyncStorage.getItem('teacherId');
      
      if (!teacherId) {
        throw new Error('Teacher ID not found');
      }
      
      // Prepare data for API
      const questData = {
        title,
        description,
        questType,
        targetValue: Number(targetValue),
        points: Number(points),
        teacherId
      };
      
      // Call API to create quest
      const response = await createQuest(questData);
      
      // Handle success
      Alert.alert("Success", "Quest created successfully");
      
      // Reset form and close modal
      resetForm();
      
      // If there's a success callback, call it with the new quest data
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      onClose();
    } catch (error) {
      // Handle error
      Alert.alert("Error", error.message || "Failed to create quest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Create a Quest">
      <Text style={styles.label}>Quest Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter a title for your quest"
      />

      <Text style={styles.label}>Quest Description (Optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter a description for your quest"
        multiline={true}
        numberOfLines={3}
      />

      <Text style={styles.label}>What type of quest do you want to create?</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={questType}
          onValueChange={setQuestType}
          style={styles.picker}
        >
          {questOptions.map((option) => (
            <Picker.Item
              style={styles.labelPicker}
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>What must the user achieve to complete the quest?</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={targetValue}
        onChangeText={setTargetValue}
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
        style={[
          styles.createButton,
          (loading || !title || !targetValue || !points) && styles.disabledButton
        ]}
        onPress={handleCreateQuest}
        disabled={loading || !title || !targetValue || !points}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Quest"}
        </Text>
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
  labelPicker: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  pickerContainer: {
    marginBottom: 10,
  },
  picker: {
    backgroundColor: "#f1faee",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#386641",
    marginBottom: 10,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: "#386641",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
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