import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image,Modal,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QuizStyles from '../Styles/QuizStyles'; // Adjust path based on your file structure
import DashboardStyles from '../Styles/DashboardStyles';
import TeacherSidebar from '../components/TeacherSidebar';
const Quiz = ({ route, navigation }) => {
  const { subject } = route.params;

  const descriptions = {
    English: 'English is all about learning the structure and art of language.',
    Math: 'Math helps us understand numbers, patterns, and logic.',
    History: 'History explores the events and stories of the past.',
    Science: 'Science is about discovering how the world works.',
  };

  const [quizzes, setQuizzes] = useState([{ name: 'Quiz 1', status: 'Completed' }]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newQuizName, setNewQuizName] = useState('');
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null); // State for selected quiz index
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar open/closed
  };

  const handleAddQuiz = () => {
    setModalVisible(true);
  };

  const handleSaveQuiz = () => {
    if (newQuizName.trim() !== '') {
      setQuizzes([...quizzes, { name: newQuizName, status: 'Pending' }]);
      setNewQuizName('');
      setModalVisible(false);
    }
  };

  const handleEditQuiz = (index) => {
    setSelectedQuizIndex(index);
    setNewQuizName(quizzes[index].name); // Set the current quiz name to edit
    setEditModalVisible(true); // Show the edit modal
  };

  const handleSaveEditedQuiz = () => {
    if (newQuizName.trim() !== '') {
      const updatedQuizzes = [...quizzes];
      updatedQuizzes[selectedQuizIndex].name = newQuizName; // Update the quiz name
      setQuizzes(updatedQuizzes);
      setNewQuizName('');
      setEditModalVisible(false); // Close the edit modal
    }
  };

  const handleDeleteQuiz = (quizIndex) => {
    setQuizzes(quizzes.filter((_, index) => index !== quizIndex));
  };




  const renderQuizItem = ({ item, index }) => (
    <View style={QuizStyles.quizContainer}>
      <View>
        <Text style={QuizStyles.quizText}>{item.name}</Text>
        <Text style={QuizStyles.completedText}>{item.status}</Text>
      </View>
      <View style={QuizStyles.iconContainer}>
        <TouchableOpacity onPress={() => handleEditQuiz(index)} style={QuizStyles.iconButton}>
          <Icon name="edit" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteQuiz(index)} style={QuizStyles.iconButton}>
          <Icon name="delete" size={24} color="#ff0000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#A8D98A',}}> {/* Set background color to green */}
     <TeacherSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} navigation={navigation} />
      <View style={QuizStyles.container}>
        <Text style={QuizStyles.title}>{subject}</Text>
        <Text style={QuizStyles.description}>{descriptions[subject]}</Text>

        <FlatList
          data={quizzes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderQuizItem}
          style={QuizStyles.quizList}
        />

        
<TouchableOpacity onPress={handleAddQuiz} style={QuizStyles.addButton}>
          <Text style={QuizStyles.actionText}>Add Quiz</Text>
        </TouchableOpacity>

        {/* Add Quiz Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={QuizStyles.modalContainer}>
            <View style={QuizStyles.modalContent}>
              <Text style={QuizStyles.modalTitle}>Add New Quiz</Text>
              <TextInput
                style={QuizStyles.input}
                placeholder="Enter quiz name"
                value={newQuizName}
                onChangeText={setNewQuizName}
              />
              <View style={QuizStyles.modalActions}>
                <TouchableOpacity onPress={handleSaveQuiz} style={QuizStyles.saveButton}>
                  <Text style={QuizStyles.saveText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={QuizStyles.cancelButton}>
                  <Text style={QuizStyles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Quiz Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={QuizStyles.modalContainer}>
            <View style={QuizStyles.modalContent}>
              <Text style={QuizStyles.modalTitle}>Edit Quiz</Text>
              <TextInput
                style={QuizStyles.input}
                placeholder="Enter quiz name"
                value={newQuizName}
                onChangeText={setNewQuizName}
              />
              <View style={QuizStyles.modalActions}>
                <TouchableOpacity onPress={handleSaveEditedQuiz} style={QuizStyles.saveButton}>
                  <Text style={QuizStyles.saveText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditModalVisible(false)} style={QuizStyles.cancelButton}>
                  <Text style={QuizStyles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>



      </View>
    </View>
  );
};

export default Quiz;
