import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Adminstyles } from "../../styles/Adminstyles";
import QuestImg from "../../assets/quest.png";
import CreateQuestModal from "./modals/questCRUD/CreateQuestModal";
import EditQuestModal from "./modals/questCRUD/EditQuestModal";
import RemoveQuestModal from "./modals/questCRUD/DeleteQuestModal";
import ViewQuestModal from "./modals/questCRUD/ViewQuestModal";
import { getTeacherQuests, deleteQuest } from "../../services/questService";

const QuestScreen = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [viewQuestModalVisible, setViewQuestModalVisible] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      setLoading(true);

      // Get teacherId from AsyncStorage
      const teacherId = await AsyncStorage.getItem('teacherId');

      if (!teacherId) {
        throw new Error('Teacher ID not found');
      }

      // Pass the teacherId to your service function
      const response = await getTeacherQuests(teacherId);

      // Check if the response has the expected structure
      if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
        throw new Error('Unexpected response format');
      }

      // Transform the response data - note the access to response.data.data
      const formattedQuests = response.data.data.map(quest => ({
        id: quest._id,
        quest: quest.title,
        type: quest.questType,
        requirement: formatRequirement(quest.questType, quest.targetValue),
        points: quest.points.toString(),
        description: quest.description,
        image: QuestImg,
        targetValue: quest.targetValue,
        expiresAt: quest.expiresAt
      }));

      setQuests(formattedQuests);
      setError(null);
    } catch (err) {
      console.error('Error fetching quests:', err);
      setError('Failed to load quests');
      Alert.alert('Error', 'Failed to load quests');
    } finally {
      setLoading(false);
    }
  };

  const formatRequirement = (questType, targetValue) => {
    switch (questType) {
      case "complete_quizzes":
        return `${targetValue} quizzes`;
      case "score_percentage":
        return `${targetValue}% score`;
      case "earn_points":
        return `${targetValue} points`;
      default:
        return `${targetValue}`;
    }
  };



  const openRemoveModal = (quest) => {
    setSelectedQuest(quest);
    setRemoveModalVisible(true);
  };

  const handleCreateQuest = (newQuest) => {
    // Refresh the quest list after creating a new quest
    fetchQuests();
  };

  const handleEditQuest = (updatedQuest) => {
    // Refresh the quest list after editing
    fetchQuests();
    setEditModalVisible(false);
  };





  if (loading && quests.length === 0) {
    return (
      <SafeAreaView style={[Adminstyles.container, Adminstyles.centerContent]}>
        <ActivityIndicator size="large" color="#386641" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Adminstyles.container}>
      <TouchableOpacity style={Adminstyles.button} onPress={() => setModalVisible(true)}>
        <Text style={Adminstyles.buttonText}>Create a Quest</Text>
      </TouchableOpacity>

        <FlatList
          data={quests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={Adminstyles.list}
          renderItem={({ item }) => (
            <View style={Adminstyles.card}>
              <Image source={item.image} style={Adminstyles.cardImage} />
              <View style={Adminstyles.cardInfo}>
                <Text style={Adminstyles.cardTitle}>{item.quest}</Text>
                <Text style={Adminstyles.cardSubtitle}>Requirement: {item.requirement}</Text>
                <Text style={Adminstyles.cardSubtitle}>Points: {item.points}</Text>
              </View>
              <TouchableOpacity
                style={Adminstyles.viewButton}
                onPress={() => {
                  openRemoveModal(item)
                }}
              >
                <MaterialIcons name="delete" size={24} color="#bc4749" />
              </TouchableOpacity>
            </View>
          )}
          refreshing={loading}
          onRefresh={fetchQuests}
        />
      
      <CreateQuestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={handleCreateQuest}
      />

      <EditQuestModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleEditQuest}
        questData={selectedQuest}
      />

      <RemoveQuestModal
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        questTitle={selectedQuest?.quest}
        questId={selectedQuest?.id}   // Corrected reference for questId
        onConfirm={fetchQuests}       // Refresh quests after deletion
      />
      <ViewQuestModal
        visible={viewQuestModalVisible}
        onClose={() => setViewQuestModalVisible(false)}
        quest={selectedQuest}
      />
    </SafeAreaView>
  );
};

export default QuestScreen;