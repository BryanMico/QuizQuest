import React,{useState} from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import RewardsStyles from '../Styles/RewardsStyles';
import StudentSidebar from '../components/StudentSidebar';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation


export default function StudentRewards() {
  const rewards = [
    {
      name: 'Pepsi',
      points: 100,
      multiplier: 3,
      image: 'https://example.com/pepsi.png', // Replace with actual image URL
    },
    {
      name: 'Potato Chips',
      points: 60,
      multiplier: 2,
      image: 'https://example.com/chips.png', // Replace with actual image URL
    },
  ];

    const navigation = useNavigation(); // Get the navigation object
    const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
  const toggleSidebar = () => {
      setIsOpen(!isOpen); // Toggle the sidebar open/closed
    };

  const handleRedeem = (rewardName) => {
    console.log(`${rewardName} redeemed!`);
  };

  return (
    <View style={RewardsStyles.container}>
        <StudentSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} navigation={navigation} />
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
    </View>
  );
}
