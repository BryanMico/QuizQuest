import React, { useState } from "react";
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Adminstyles } from "../../styles/Adminstyles";
import QuestImg from "../../assets/quest.png";
import CreateQuestModal from "./modals/questCRUD/CreateQuestModal";
import EditQuestModal from "./modals/questCRUD/EditQuestModal";
import RemoveQuestModal from "./modals/questCRUD/DeleteQuestModal";
import ViewQuestModal from "./modals/questCRUD/ViewQuestModal";

const QuestScreen = () => {
  const [quests, setQuests] = useState([
    { id: "1", quest: "Complete 5 quizzes", type: "complete_quizzes", requirement: "5 quizzes", points: "100", image: QuestImg },
    { id: "2", quest: "Score 80% on a quiz", type: "score_percentage", requirement: "80% score", points: "200", image: QuestImg },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [viewQuestModalVisible, setViewQuestModalVisible] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);

  const handleEditQuest = (updatedQuest) => {
    setQuests((prev) => prev.map((q) => (q.id === updatedQuest.id ? { ...q, ...updatedQuest } : q)));
    setEditModalVisible(false);
  };

  const handleRemoveQuest = (questId) => {
    setQuests((prev) => prev.filter((q) => q.id !== questId));
    setRemoveModalVisible(false);
  };

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
                setSelectedQuest(item);
                setEditModalVisible(true);
              }}
            >
              <MaterialIcons name="edit" size={24} color="#386641" />
            </TouchableOpacity>

            <TouchableOpacity
              style={Adminstyles.viewButton}
              onPress={() => {
                setSelectedQuest(item);
                setRemoveModalVisible(true);
              }}
            >
              <MaterialIcons name="delete" size={24} color="#bc4749" />
            </TouchableOpacity>

            <TouchableOpacity
              style={Adminstyles.viewButton}
              onPress={() => {
                setSelectedQuest(item);
                setViewQuestModalVisible(true);
              }}
            >
              <MaterialIcons name="view-list" size={24} color="#184e77" />
            </TouchableOpacity>
          </View>
        )}
      />

      <CreateQuestModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <EditQuestModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleEditQuest}
        questData={selectedQuest}
      />

      <RemoveQuestModal
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        onConfirm={() => handleRemoveQuest(selectedQuest?.id)}
        questTitle={selectedQuest?.quest}
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