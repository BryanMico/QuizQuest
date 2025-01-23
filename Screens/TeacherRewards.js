import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Modal, Button, ScrollView } from 'react-native';
import RewardsStyles from '../Styles/RewardsStyles';
import DashboardStyles from '../Styles/DashboardStyles';
import TeacherSidebar from '../components/TeacherSidebar';
import { useNavigation } from '@react-navigation/native';

export default function TeacherRewards() {
  const [rewards, setRewards] = useState([
    {
      name: 'Pepsi',
      points: 100,
      multiplier: 3,
      image: 'https://example.com/pepsi.png',
    },
    {
      name: 'Potato Chips',
      points: 60,
      multiplier: 2,
      image: 'https://example.com/chips.png',
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for the modal visibility
  const [newReward, setNewReward] = useState({ name: '', points: '', multiplier: '', image: '' }); // New reward form data

  const navigation = useNavigation();

  const handleRedeem = (rewardName) => {
    console.log(`${rewardName} redeemed!`);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleAddProduct = () => {
    setRewards([...rewards, newReward]); // Add the new reward to the array
    setIsModalVisible(false); // Close the modal
    setNewReward({ name: '', points: '', multiplier: '', image: '' }); // Reset the form
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#A8D98A' }}>
      <TeacherSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} navigation={navigation} />
      
      <View style={RewardsStyles.container}>
        <Text style={RewardsStyles.title}>REWARDS</Text>
        <Text style={RewardsStyles.points}>100</Text>

        {rewards.map((reward, index) => (
          <View key={index} style={RewardsStyles.rewardCard}>
            <Image source={{ uri: reward.image }} style={RewardsStyles.rewardImage} />
            <View style={RewardsStyles.rewardDetails}>
              <Text style={RewardsStyles.rewardName}>{reward.name}</Text>
              <Text style={RewardsStyles.rewardPoints}>{reward.points} PTS</Text>
              <Text style={RewardsStyles.rewardMultiplier}>{reward.multiplier}X</Text>
            </View>
            <TouchableOpacity
              style={RewardsStyles.redeemButton}
              onPress={() => handleRedeem(reward.name)}
            >
              <Text style={RewardsStyles.redeemText}>REDEEM</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Button to open the modal */}
        <TouchableOpacity 
          style={RewardsStyles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={RewardsStyles.addButtonText}>Add Product</Text>
        </TouchableOpacity>

        {/* Modal to add a new product */}
        <Modal
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
          animationType="fade"
          transparent={true}
        >
          <View style={RewardsStyles.modalContainer}>
            <View style={RewardsStyles.modalView}>
              <Text style={RewardsStyles.modalTitle}>Add New Product</Text>

              <TextInput
                style={RewardsStyles.input}
                placeholder="Product Name"
                value={newReward.name}
                onChangeText={(text) => setNewReward({ ...newReward, name: text })}
              />
              <TextInput
                style={RewardsStyles.input}
                placeholder="Points"
                value={newReward.points}
                onChangeText={(text) => setNewReward({ ...newReward, points: text })}
                keyboardType="numeric"
              />
              <TextInput
                style={RewardsStyles.input}
                placeholder="Multiplier"
                value={newReward.multiplier}
                onChangeText={(text) => setNewReward({ ...newReward, multiplier: text })}
                keyboardType="numeric"
              />
              <TextInput
                style={RewardsStyles.input}
                placeholder="Image URL"
                value={newReward.image}
                onChangeText={(text) => setNewReward({ ...newReward, image: text })}
              />

              <TouchableOpacity onPress={handleAddProduct} style={RewardsStyles.addButton}>
                <Text style={RewardsStyles.addButtonText}>Add Product</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={RewardsStyles.closeButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
