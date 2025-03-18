import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from "@expo/vector-icons";
import { Adminstyles } from "../../styles/Adminstyles";
import snackImg from "../../assets/snacks.png";
import beverageImg from "../../assets/drinks.png";
import fruitImg from "../../assets/fruit.png";
import toysImg from "../../assets/toys.png";
import CreateRewardModal from "./modals/rewardCRUD/CreateRewardModal";
import EditRewardModal from "./modals/rewardCRUD/EditRewardModal";
import RemoveRewardModal from "./modals/rewardCRUD/RemoveRewardModal";
import ViewRewardModal from "./modals/rewardCRUD/ViewRewardModal";
import LoadingScreen from "../components/LoadingScreen";
import ErrorModal from "../components/ErrorModal";
import { getAllRewards } from "../../services/rewardService";

const RewardScreen = () => {
  const [selectedReward, setSelectedReward] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [teacherId, setTeacherId] = useState(null);

  const [showCreateRewardModal, setShowCreateRewardModal] = useState(false);
  const [showEditRewardModal, setShowEditRewardModal] = useState(false);
  const [showRemoveRewardModal, setShowRemoveRewardModal] = useState(false);
  const [showViewRewardModal, setShowViewRewardModal] = useState(false);

  // Helper function to get the image based on image reference or category
  const getImageFromReference = (imageRef, category) => {
    // First try to use the image reference
    if (imageRef) {
      // Check the image reference string and return the corresponding image
      if (imageRef.includes("snack") || imageRef === "Snacks") return snackImg;
      if (imageRef.includes("drink") || imageRef.includes("beverage") || imageRef === "Beverages") return beverageImg;
      if (imageRef.includes("fruit") || imageRef === "Fruits") return fruitImg;
      if (imageRef.includes("toy") || imageRef === "Toys") return toysImg;
    }

    // Fallback to category if no image reference or unknown format
    if (category) {
      if (category === "Snacks") return snackImg;
      if (category === "Beverages") return beverageImg;
      if (category === "Fruits") return fruitImg;
      if (category === "Toys") return toysImg;
    }

    // Default image if nothing matches
    return snackImg;
  };

  useEffect(() => {
    const getTeacherId = async () => {
      const id = await AsyncStorage.getItem('teacherId');
      setTeacherId(id);
    };
    
    getTeacherId();
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const id = await AsyncStorage.getItem('teacherId');
      if (!id) {
        throw new Error("Teacher ID is missing.");
      }

      // Store teacher ID in state for use in other components
      setTeacherId(id);
      
      const data = await getAllRewards(id);

      // Just set rewards to empty array if no data returned
      // No error modal needed for this case
      if (!data || data.length === 0) {
        setRewards([]);
        setLoading(false);
        return;
      }

      const rewardData = data.map((reward) => {
        return {
          ...reward,
          imageObject: getImageFromReference(reward.image, reward.category),
          reward: reward.rewardName || reward.reward
        };
      });

      setRewards(rewardData);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      setErrorMessage(error.message || "Failed to fetch rewards.");
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to remove the reward from the local state
  const handleRewardRemoval = (rewardId) => {
    // First close the modal
    setShowRemoveRewardModal(false);
    
    // Then update the local state by filtering out the deleted reward
    setRewards(currentRewards => 
      currentRewards.filter(reward => reward._id !== rewardId)
    );
    
    // Reset the selected reward
    setSelectedReward(null);
    
    // Optionally, fetch the updated list from the server
    // This ensures the UI is in sync with the database
    fetchRewards();
  };

  return (
    <SafeAreaView style={Adminstyles.container}>
      <LoadingScreen visible={loading} />

      <ErrorModal
        visible={errorVisible}
        title="Failed to Load Rewards"
        message={errorMessage}
        onTryAgain={() => {
          fetchRewards();
          setErrorVisible(false);
        }}
        onCancel={() => setErrorVisible(false)}
      />

      <TouchableOpacity style={Adminstyles.button} onPress={() => setShowCreateRewardModal(true)}>
        <Text style={Adminstyles.buttonText}>Create a Reward</Text>
      </TouchableOpacity>

      <FlatList
        data={rewards}
        keyExtractor={(item, index) => (item?._id ?? item?.id ?? index).toString()}
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

            {/* Use the processed imageObject instead of the string reference */}
            <Image source={item.imageObject} style={Adminstyles.cardImage} />
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
        onSubmit={fetchRewards}
      />
      <EditRewardModal
        visible={showEditRewardModal}
        onClose={() => setShowEditRewardModal(false)}
        reward={selectedReward}
        onSubmit={fetchRewards}
      />
      <RemoveRewardModal
        visible={showRemoveRewardModal}
        onClose={() => setShowRemoveRewardModal(false)}
        onSubmit={() => handleRewardRemoval(selectedReward?._id)}
        rewardTitle={selectedReward?.reward}
        rewardId={selectedReward?._id}
      />
      <ViewRewardModal 
        visible={showViewRewardModal}
        onClose={() => setShowViewRewardModal(false)}
        reward={selectedReward}
        teacherId={teacherId}
        onRefresh={fetchRewards}
      />
    </SafeAreaView>
  );
};

export default RewardScreen;