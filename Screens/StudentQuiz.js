import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QuizStyles from '../Styles/QuizStyles'; // Adjust path based on your file structure
import DashboardStyles from '../Styles/DashboardStyles';

const StudentQuiz = ({ route, navigation }) => {
  const { subject } = route.params;

  const descriptions = {
    English: 'English is all about learning the structure and art of language.',
    Math: 'Math helps us understand numbers, patterns, and logic.',
    History: 'History explores the events and stories of the past.',
    Science: 'Science is about discovering how the world works.',
  };

  const [quizzes, setQuizzes] = useState([{ name: 'Quiz 1', status: 'Completed' }]);
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar open/closed
  };

  const renderQuizItem = ({ item, index }) => (
    <View style={QuizStyles.quizContainer}>
      <View>
        <Text style={QuizStyles.quizText}>{item.name}</Text>
        <Text style={QuizStyles.completedText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#A8D98A',}}> {/* Set background color to green */}
      {/* Hamburger icon to toggle sidebar */}
      <View style={{ zIndex: 20 }}>
        <TouchableOpacity onPress={toggleSidebar} style={{ padding: 10 }}>
          <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Sidebar */}
      {isOpen && (
        <View
          style={[
            DashboardStyles.sidebar,
            { position: 'absolute', top: 0, left: 0, height: '100%', zIndex: 10 },
          ]}
        >
          <Image
            source={{ uri: 'https://example.com/student-image.jpg' }} // Replace with your image URL
            style={DashboardStyles.image}
          />
          <Text style={DashboardStyles.teacherName}>Student Name</Text>
          
          <TouchableOpacity style={DashboardStyles.menuItem}>
            <Text style={DashboardStyles.menuText}><Icon name="book" size={20} color="#333" />Subjects</Text>
          </TouchableOpacity>
          <TouchableOpacity style={DashboardStyles.menuItem}>
            <Text style={DashboardStyles.menuText}><Icon name="emoji-events" size={20} color="#333" />Rewards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={DashboardStyles.logoutButton}>
            <Text style={DashboardStyles.menuText}><Icon name="logout" size={20} color="#333" />Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={QuizStyles.container}>
        <Text style={QuizStyles.title}>{subject}</Text>
        <Text style={QuizStyles.description}>{descriptions[subject]}</Text>

        <FlatList
          data={quizzes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderQuizItem}
          style={QuizStyles.quizList}
        />
      </View>
    </View>
  );
};

export default StudentQuiz;
