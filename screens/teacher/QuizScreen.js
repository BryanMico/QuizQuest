import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from '@react-navigation/native';

import RemoveQuizModal from './modals/quizCRUD/RemoveQuizModal';
import QuizCreatorModal from './modals/quizCRUD/CreateQuizModal';
import QuizViewModal from './modals/quizCRUD/VIewQuizModal';
import ErrorModal from '../components/ErrorModal';
import LoadingScreen from '../components/LoadingScreen';
import { Adminstyles } from '../../styles/Adminstyles';
import QuizImg from "../../assets/question.png";
import { getQuizzesByTeacher } from "../../services/quizService";
import { getTeacherQuests } from "../../services/questService";

const QuizScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [hasQuest, setHasQuest] = useState(false); // Checks if teacher has at least one quest
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  // Fetch data when the screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchInitialData();
    }
  }, [isFocused]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const teacherId = await AsyncStorage.getItem('teacherId');
      if (!teacherId) throw new Error("Teacher ID is missing.");

      // Fetch quizzes
      const quizData = await getQuizzesByTeacher(teacherId);
      const formattedQuizzes = quizData.map((quiz) => ({
        ...quiz,
        image: QuizImg,
      }));
      setQuizzes(formattedQuizzes);

      // Fetch quests to check whether the teacher has created any quest
      const questResponse = await getTeacherQuests(teacherId);
      // Fixed: Check the correct structure based on your API response
      const hasAnyQuests = questResponse && 
                           questResponse.data && 
                           questResponse.data.data && 
                           Array.isArray(questResponse.data.data) && 
                           questResponse.data.data.length > 0;
      
      setHasQuest(hasAnyQuests);
      console.log("Has quests:", hasAnyQuests);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage(error.message || "Failed to fetch data.");
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const openRemoveModal = (quiz) => {
    setSelectedQuiz(quiz);
    setIsRemoveModalVisible(true);
  };

  const openViewModal = (quiz) => {
    setSelectedQuiz(quiz);
    setIsViewModalVisible(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={Adminstyles.container}>
      <LoadingScreen visible={loading} />

      <ErrorModal
        visible={errorVisible}
        title="Failed to Load"
        message={errorMessage}
        onTryAgain={fetchInitialData}
        onCancel={() => setErrorVisible(false)}
      />

      <TouchableOpacity
        style={[Adminstyles.button, !hasQuest && { backgroundColor: '#ccc' }]}
        disabled={!hasQuest}
        onPress={() => {
          if (!hasQuest) {
            Alert.alert("Quests Required", "You need to create at least 1 quest before creating a quiz.");
            return;
          }
          setIsModalVisible(true);
        }}
      >
        <Text style={Adminstyles.buttonText}>Create a Quiz</Text>
      </TouchableOpacity>

      {!hasQuest && (
        <Text style={styles.questWarning}>
          You need to create at least 1 quest before creating a quiz.
        </Text>
      )}

      <FlatList
        data={quizzes}
        keyExtractor={(item, index) => item?._id?.toString() ?? index.toString()}
        numColumns={1}
        contentContainerStyle={Adminstyles.list}
        renderItem={({ item }) => (
          <View style={Adminstyles.card}>
            <Image source={item.image} style={Adminstyles.cardImage} />
            <View style={Adminstyles.cardInfo}>
              <Text style={Adminstyles.cardTitle}>{item.title}</Text>
              <Text style={Adminstyles.cardSubtitle}>Points: {item.totalPoints}</Text>
              <Text style={Adminstyles.cardSubtitle}>Date: {formatDate(item.createdAt)}</Text>
            </View>
            <TouchableOpacity style={Adminstyles.viewButton} onPress={() => openRemoveModal(item)}>
              <MaterialIcons name="delete" size={24} color="#bc4749" />
            </TouchableOpacity>
            <TouchableOpacity style={Adminstyles.viewButton} onPress={() => openViewModal(item)}>
              <MaterialIcons name="view-list" size={24} color="#184e77" />
            </TouchableOpacity>
          </View>
        )}
      />

      <QuizCreatorModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          fetchInitialData();
        }}
      />

      <RemoveQuizModal
        visible={isRemoveModalVisible}
        onClose={() => setIsRemoveModalVisible(false)}
        onConfirm={fetchInitialData}
        quizTitle={selectedQuiz?.title}
        quiz={selectedQuiz}
      />

      <QuizViewModal
        visible={isViewModalVisible}
        onClose={() => setIsViewModalVisible(false)}
        quiz={selectedQuiz}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  questWarning: {
    marginTop: 10,
    fontSize: 14,
    color: "#bc4749",
    textAlign: "center"
  }
});

export default QuizScreen;