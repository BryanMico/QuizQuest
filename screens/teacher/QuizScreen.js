import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RemoveQuizModal from './modals/quizCRUD/RemoveQuizModal';
import QuizCreatorModal from './modals/quizCRUD/CreateQuizModal';
import QuizViewModal from './modals/quizCRUD/VIewQuizModal';
import { Adminstyles } from '../../styles/Adminstyles';
import QuizImg from "../../assets/question.png";
import { MaterialIcons } from "@expo/vector-icons";
import ErrorModal from '../components/ErrorModal';
import LoadingScreen from '../components/LoadingScreen';
import { getQuizzesByTeacher } from "../../services/quizService";

const QuizScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const teacherId = await AsyncStorage.getItem('teacherId');
      if (!teacherId) throw new Error("Teacher ID is missing.");

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
    
    // Try to parse the date
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.log('Invalid date:', dateString); // Log the invalid date for debugging
      return 'Invalid Date';
    }
    
    // Format the date
    return date.toLocaleDateString('en-US', { 
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
        keyExtractor={(item, index) => item?._id?.toString() ?? index.toString()}
        numColumns={1}
        contentContainerStyle={Adminstyles.list}
        renderItem={({ item }) => (
          <View style={Adminstyles.card}>
            <Image source={item.image} style={Adminstyles.cardImage} />
            <View style={Adminstyles.cardInfo}>
              <Text style={Adminstyles.cardTitle}>{item.title}</Text>
              <Text style={Adminstyles.cardSubtitle}>Points: {item.totalPoints}</Text>
              <Text style={Adminstyles.cardSubtitle}>Date: {formatDate(item.createdAt) || 'Not available'}
            </Text>
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
          fetchQuizzes();
        }}
      />

      <RemoveQuizModal
        visible={isRemoveModalVisible}
        onClose={() => setIsRemoveModalVisible(false)}
        onConfirm={fetchQuizzes}
        quizTitle={selectedQuiz?.title}
        quiz={selectedQuiz}
      />

      <QuizViewModal
        visible={isViewModalVisible}
        onClose={() => setIsViewModalVisible(false)}
        quiz={selectedQuiz}  // Pass the full quiz object
        />
    </SafeAreaView>
  );
};

export default QuizScreen;