import React, { useState } from "react";
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Adminstyles } from "../../styles/Adminstyles";
import snackImg from "../../assets/snacks.png";
import beverageImg from "../../assets/drinks.png";
import CreateRewardModal from "./modals/rewardCRUD/CreateRewardModal";
import EditRewardModal from "./modals/rewardCRUD/EditRewardModal";
import RemoveRewardModal from "./modals/rewardCRUD/RemoveRewardModal";
import ViewRewardModal from "./modals/rewardCRUD/ViewRewardModal";

const RewardScreen = () => {
  const [selectedReward, setSelectedReward] = useState(null);
  const [rewards, setRewards] = useState([
    {
      id: "1",
      reward: "Piatos",
      stocks: "10",
      points: "10",
      image: snackImg,
      category: "Snacks",
      description: "A crispy and tasty potato snack for students.",
    },
    {
      id: "2",
      reward: "Chuckie",
      stocks: "10",
      points: "20",
      image: beverageImg,
      category: "Beverages",
      description: "A delicious chocolate milk drink packed with energy.",
    },
  ]);

  const [showCreateRewardModal, setShowCreateRewardModal] = useState(false);
  const [showEditRewardModal, setShowEditRewardModal] = useState(false);
  const [showRemoveRewardModal, setShowRemoveRewardModal] = useState(false);
  const [showViewRewardModal, setShowViewRewardModal] = useState(false);

  // Function to add a new reward
  const handleCreateReward = (newReward) => {
    setRewards([...rewards, { id: (rewards.length + 1).toString(), ...newReward }]);
    setShowCreateRewardModal(false);
  };

  return (
    <SafeAreaView style={Adminstyles.container}>
      <TouchableOpacity style={Adminstyles.button} onPress={() => setShowCreateRewardModal(true)}>
        <Text style={Adminstyles.buttonText}>Create a Reward</Text>
      </TouchableOpacity>

      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={Adminstyles.list}
        renderItem={({ item }) => (
          <View style={Adminstyles.card}>
            <View style={Adminstyles.badgeContainer}>
              <View style={Adminstyles.pointsBadge}>
                <Text style={Adminstyles.pointsText}>{item.points} pts</Text>
              </View>
              <View style={Adminstyles.pointsBadge2}>
                <Text style={Adminstyles.pointsText}>{item.stocks} in stock</Text>
              </View>
            </View>

            <Image source={item.image} style={Adminstyles.cardImage} />
            <View style={Adminstyles.cardInfo}>
              <Text style={Adminstyles.cardTitle}>{item.reward}</Text>
              <Text style={Adminstyles.cardSubtitle}>Category: {item.category}</Text>
              <Text style={Adminstyles.cardSubtitle}>{item.description}</Text>
            </View>

            <TouchableOpacity
              style={Adminstyles.viewButton}
              onPress={() => {
                setSelectedReward(item);
                setShowEditRewardModal(true);
              }}
            >
              <MaterialIcons name="edit" size={24} color="#386641" />
            </TouchableOpacity>

            <TouchableOpacity
              style={Adminstyles.viewButton}
              onPress={() => {
                setSelectedReward(item);
                setShowRemoveRewardModal(true);
              }}
            >
              <MaterialIcons name="delete" size={24} color="#bc4749" />
            </TouchableOpacity>

            <TouchableOpacity
              style={Adminstyles.viewButton}
              onPress={() => {
                setSelectedReward(item);
                setShowViewRewardModal(true);
              }}
            >
              <MaterialIcons name="view-list" size={24} color="#184e77" />
            </TouchableOpacity>
          </View>
        )}
      />

      <CreateRewardModal
        visible={showCreateRewardModal}
        onClose={() => setShowCreateRewardModal(false)}
        onSubmit={handleCreateReward}
      />
      <EditRewardModal
        visible={showEditRewardModal}
        onClose={() => setShowEditRewardModal(false)}
        reward={selectedReward}
      />
      <RemoveRewardModal
        visible={showRemoveRewardModal}
        onClose={() => setShowRemoveRewardModal(false)}
        rewardTitle={selectedReward?.reward}
      />
      <ViewRewardModal
        visible={showViewRewardModal}
        onClose={() => setShowViewRewardModal(false)}
        reward={selectedReward}
      />
    </SafeAreaView>
  );
};

export default RewardScreen;
