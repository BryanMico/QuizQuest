import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import EditQuizModal from './modals/quizCRUD/EditQuizModal'; 
import RemoveQuizModal from './modals/quizCRUD/RemoveQuizModal';
import QuizCreatorModal from './modals/quizCRUD/CreateQuizModal';
import QuizViewModal from './modals/quizCRUD/VIewQuizModal'; 
import { Adminstyles } from '../../styles/Adminstyles';
import QuizImg from "../../assets/question.png"; // Ensure this path is correct
import { MaterialIcons } from "@expo/vector-icons";

const QuizScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([
    { id: "1", title: "Counting Adventure", points: "100", image: QuizImg, date: "Feb 27, 2025"  },
    { id: "2", title: "Adding Adventure", points: "100", image: QuizImg, date: "Feb 26, 2025"  },
  ]);

  // Function to handle adding a new quiz
  const handleAddQuiz = (newQuiz) => {
    setQuizzes([...quizzes, { ...newQuiz, id: (quizzes.length + 1).toString(), image: QuizImg }]);
    setIsModalVisible(false);
  };

  // Function to handle editing a quiz
  const handleEditQuiz = (updatedQuiz) => {
    setQuizzes(quizzes.map((quiz) => (quiz.id === updatedQuiz.id ? updatedQuiz : quiz)));
    setIsEditModalVisible(false);
  };

  // Function to handle removing a quiz
  const handleRemoveQuiz = () => {
    setQuizzes(quizzes.filter((quiz) => quiz.id !== selectedQuiz.id));
    setIsRemoveModalVisible(false);
  };

  return (
    <SafeAreaView style={Adminstyles.container}>
      <TouchableOpacity style={Adminstyles.button} onPress={() => setIsModalVisible(true)}>
        <Text style={Adminstyles.buttonText}>Create a Quiz</Text>
      </TouchableOpacity>

      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={Adminstyles.list}
        renderItem={({ item }) => (
          <View style={Adminstyles.card}>
            <Image source={item.image} style={Adminstyles.cardImage} />
            <View style={Adminstyles.cardInfo}>
              <Text style={Adminstyles.cardTitle}>{item.title}</Text>
              <Text style={Adminstyles.cardSubtitle}>Points: {item.points}</Text>
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
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddQuiz}
      />

      <EditQuizModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        quiz={selectedQuiz}
        onSubmit={handleEditQuiz}
      />

      <RemoveQuizModal
        visible={isRemoveModalVisible}
        onClose={() => setIsRemoveModalVisible(false)}
        onConfirm={handleRemoveQuiz}
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
