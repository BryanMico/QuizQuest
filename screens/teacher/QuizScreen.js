import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditQuizModal from './modals/quizCRUD/EditQuizModal';
import RemoveQuizModal from './modals/quizCRUD/RemoveQuizModal';
import QuizCreatorModal from './modals/quizCRUD/CreateQuizModal';
import QuizViewModal from './modals/quizCRUD/VIewQuizModal';
import { Adminstyles } from '../../styles/Adminstyles';
import QuizImg from "../../assets/question.png"; // Ensure this path is correct
import { MaterialIcons } from "@expo/vector-icons";
import ErrorModal from '../components/ErrorModal';
import LoadingScreen from '../components/LoadingScreen';
import { getQuizzesByTeacher } from "../../services/quizService";

const QuizScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuizzes();;
  }, []);

  // Fetch students from backend
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const teacherId = await AsyncStorage.getItem('teacherId');
      if (!teacherId) {
        throw new Error("Teacher ID is missing.");
      }

      const data = await getQuizzesByTeacher(teacherId);
      const quizData = data.map((quiz) => ({
        ...quiz,
        image: QuizImg,
      }));

      setQuizzes(quizData);
    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch Quizzes.");
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={Adminstyles.container}>
      <LoadingScreen visible={loading} />

      <ErrorModal
        visible={errorVisible}
        title="Failed to Load Quizzes"
        message={errorMessage}
        onTryAgain={fetchQuizzes}
        onCancel={() => setErrorVisible(false)}
      />
      <TouchableOpacity style={Adminstyles.button} onPress={() => setIsModalVisible(true)}>
        <Text style={Adminstyles.buttonText}>Create a Quiz</Text>
      </TouchableOpacity>

      <FlatList
        data={quizzes}
        keyExtractor={(item, index) => (item?.id ?? index).toString()}
        numColumns={1}
        contentContainerStyle={Adminstyles.list}
        renderItem={({ item }) => (
          <View style={Adminstyles.card}>
            <Image source={item.image} style={Adminstyles.cardImage} />
            <View style={Adminstyles.cardInfo}>
              <Text style={Adminstyles.cardTitle}>{item.title}</Text>
              <Text style={Adminstyles.cardSubtitle}>Points: {item.totalPoints}</Text>
              <Text style={Adminstyles.cardSubtitle}>{item.date}</Text>
            </View>
            <TouchableOpacity
              style={Adminstyles.viewButton}
              onPress={() => {
                setSelectedQuiz(item);
                setIsEditModalVisible(true);
              }}
            >
              <MaterialIcons name="edit" size={24} color="#386641" />
            </TouchableOpacity>
            <TouchableOpacity
              style={Adminstyles.viewButton}
              onPress={() => {
                setSelectedQuiz(item);
                setIsRemoveModalVisible(true);
              }}
            >
              <MaterialIcons name="delete" size={24} color="#bc4749" />
            </TouchableOpacity>
            <TouchableOpacity
              style={Adminstyles.viewButton}
              onPress={() => {
                setSelectedQuiz(item);
                setIsViewModalVisible(true);
              }}
            >
              <MaterialIcons name="view-list" size={24} color="#184e77" />
            </TouchableOpacity>
          </View>
        )}
      />

      <QuizCreatorModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          fetchQuizzes(); // Added fetchQuizzes here
        }}
      />


      <EditQuizModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        quiz={selectedQuiz}
        onSubmit={fetchQuizzes}
      />

      <RemoveQuizModal
        visible={isRemoveModalVisible}
        onClose={() => setIsRemoveModalVisible(false)}
        onConfirm={fetchQuizzes}
        quizTitle={selectedQuiz?.title}
      />

      <QuizViewModal
        visible={isViewModalVisible}
        onClose={() => setIsViewModalVisible(false)}
        quizTitle={selectedQuiz?.title}
      />
    </SafeAreaView>
  );
};

export default QuizScreen;
