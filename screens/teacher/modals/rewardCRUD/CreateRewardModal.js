import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import ReusableModal from "../../../components/ModalScreen";
import snackImg from "../../../../assets/snacks.png";
import beverageImg from "../../../../assets/drinks.png";
import fruitImg from "../../../../assets/fruit.png"
import toysImg from "../../../../assets/toys.png"
import ErrorModal from "../../../components/ErrorModal";
import LoadingScreen from "../../../components/LoadingScreen";
import { createReward } from "../../../../services/rewardService";


export default function CreateRewardModal({ visible, onClose, onSubmit }) {
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [rewardName, setRewardName] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [stocks, setStocks] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);

    const categoryImages = {
      "Snacks": snackImg,
      "Beverages": beverageImg,
      "Fruits": fruitImg,
      "Toys": toysImg
    };

    setImage(categoryImages[selectedCategory] || null);
  };
  const handleCreateReward = async () => {
    if (!rewardName || !points || !stocks || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const teacherId = await AsyncStorage.getItem('teacherId');
      if (!teacherId) {
        setErrorMessage('Teacher ID is missing.');
        setErrorVisible(true);
        setLoading(false);
        return;
      }

      let imageReference = null;
      switch (category) {
        case "Snacks":
          imageReference = "snacks.png";
          break;
        case "Beverages":
          imageReference = "drinks.png";
          break;
        case "Fruits":
          imageReference = "fruit.png";
          break;
        case "Toys":
          imageReference = "toys.png";
          break;
        default:
          imageReference = null;
      }

      const rewardData = {
        rewardName,
        description,
        points: parseInt(points),
        stocks: parseInt(stocks),
        category,
        image: imageReference,  // Use the string reference instead of the image object
        teacherId,
        createdBy: teacherId,
      };


      const result = await createReward(rewardData);

      if (result && result.reward) {
        alert(result.message || "Reward successfully created!");
        onSubmit(result.reward);  // Pass the created reward from the response
        resetForm();
        onClose();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error in handleCreateReward:", error);
      setErrorMessage(error.message || "Failed to create reward.");
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategory("");
    setImage(null);
    setRewardName("");
    setDescription("");
    setPoints("");
    setStocks("");
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Create a Reward">
      <LoadingScreen visible={loading} />

      <ErrorModal
        visible={errorVisible}
        title="Reward Creation Failed"
        message={errorMessage}
        onTryAgain={() => {
          setErrorVisible(false);
          handleCreateReward();
        }}
        onCancel={() => setErrorVisible(false)}
      />

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
          <Picker.Item label="Fruits" value="Fruits" />
          <Picker.Item label="Toys" value="Toys" />
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
