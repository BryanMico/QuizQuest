import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Picker } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import snackImg from "../../../../assets/snacks.png";
import beverageImg from "../../../../assets/drinks.png";

export default function EditRewardModal({ visible, onClose, onSubmit, rewardData }) {
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [rewardName, setRewardName] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [stocks, setStocks] = useState("");

  useEffect(() => {
    if (rewardData) {
      setCategory(rewardData.category || "");
      setImage(rewardData.category === "Snacks" ? snackImg : beverageImg);
      setRewardName(rewardData.rewardName || "");
      setDescription(rewardData.description || "");
      setPoints(rewardData.points?.toString() || "");
      setStocks(rewardData.stocks?.toString() || "");
    }
  }, [rewardData]);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    setImage(selectedCategory === "Snacks" ? snackImg : beverageImg);
  };

  const handleUpdateReward = () => {
    if (!rewardName || !points || !stocks || !category) return;
    onSubmit({ ...rewardData, rewardName, description, points, stocks, category, image });
    onClose();
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Edit Reward">
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

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateReward}>
        <Text style={styles.buttonText}>Update Reward</Text>
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
    height: 40,
    borderWidth: 1,
    backgroundColor: "#f1faee",
    borderColor: "#386641",
    borderRadius: 5,
  },
  updateButton: {
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
