import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import ReusableModal from "../../../components/ModalScreen";
import snackImg from "../../../../assets/snacks.png";
import beverageImg from "../../../../assets/drinks.png";

export default function CreateRewardModal({ visible, onClose, onSubmit }) {
  const [category, setCategory] = useState(""); // Empty to show "Categories" first
  const [image, setImage] = useState(null);
  const [rewardName, setRewardName] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [stocks, setStocks] = useState("");

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    setImage(selectedCategory === "Snacks" ? snackImg : beverageImg);
  };

  const handleCreateReward = () => {
    if (!rewardName || !points || !stocks || !category) return; // Ensure category is selected
    onSubmit({ rewardName, description, points, stocks, category, image });
    setCategory(""); // Reset to "Categories"
    setImage(null);
    setRewardName("");
    setDescription("");
    setPoints("");
    setStocks("");
    onClose();
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Create a Reward">
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Reward Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter reward name"
          value={rewardName}
          onChangeText={setRewardName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category</Text>
        <Picker selectedValue={category} onValueChange={handleCategoryChange} style={styles.picker}>
          <Picker.Item label="Select a category" value="" enabled={false} />
          <Picker.Item label="Snacks" value="Snacks" />
          <Picker.Item label="Beverages" value="Beverages" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Points</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter points required"
          keyboardType="numeric"
          value={points}
          onChangeText={setPoints}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Stocks</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter available stocks"
          keyboardType="numeric"
          value={stocks}
          onChangeText={setStocks}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleCreateReward}>
        <Text style={styles.buttonText}>Create Reward</Text>
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
  picker: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "#f1faee",
    borderColor: "#386641",
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#386641",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#f2e8cf",
    fontSize: 16,
  },
});
