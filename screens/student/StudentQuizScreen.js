import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text, FlatList, View, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ConfirmationModal from './modals/confirmationModal';
import LoadingScreen from '../components/LoadingScreen';
import { getStudentInfo } from "../../services/studentService";
import { getTeacherInfo } from "../../services/teacherService";
import { getQuizzesStatus, getAllCurrentQuizzes } from "../../services/quizService";

const SAMPLE_QUIZ = {
  _id: 'sample-quiz-frontend',
  title: 'Sample Mixed Quiz',
  introduction: 'A quiz with all types for demo.',
  questions: [
    {
      type: 'identification',
      text: 'What is the capital of Japan?',
      correctAnswer: 'Tokyo',
      points: 10
    },
    {
      type: 'matching',
      text: 'Match the countries to their flags! 🇮🇹🇩🇪🇪🇸',
      pairs: [
        { left: '🇮🇹', right: 'Italy' },
        { left: '🇩🇪', right: 'Germany' },
        { left: '🇪🇸', right: 'Spain' }
      ],
      points: 15
    },
    {
      type: 'dragdrop',
      text: 'Arrange the colors of the rainbow in order! 🌈',
      items: [
        '🔴 Red',
        '🟠 Orange',
        '🟡 Yellow',
        '🟢 Green',
        '🔵 Blue',
        '🟣 Indigo',
        '🟪 Violet'
      ],
      correctOrder: [
        '🔴 Red',
        '🟠 Orange',
        '🟡 Yellow',
        '🟢 Green',
        '🔵 Blue',
        '🟣 Indigo',
        '🟪 Violet'
      ],
      points: 20
    },
    {
      type: 'multiple',
      text: 'Which planet is known as the Red Planet?',
      choices: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      correctAnswer: 'Mars',
      points: 10
    }
  ],
  totalPoints: 55,
  status: 'Current',
  studentAnswers: []
};

const MORE_TYPES_QUIZ = {
  _id: 'more-types-quiz-frontend',
  title: 'More Types Quiz',
  introduction: 'A quiz with even more question types!',
  questions: [
    {
      type: 'identification',
      text: 'What is the largest planet in our solar system?',
      correctAnswer: 'Jupiter',
      points: 10
    },
    {
      type: 'matching',
      text: 'Match the animals to their sounds! 🐶🐱🐮',
      pairs: [
        { left: '🐶', right: 'Bark' },
        { left: '🐱', right: 'Meow' },
        { left: '🐮', right: 'Moo' }
      ],
      points: 15
    },
    {
      type: 'dragdrop',
      text: 'Arrange the seasons in order! 🌱☀️🍂❄️',
      items: ['🌱 Spring', '☀️ Summer', '🍂 Autumn', '❄️ Winter'],
      correctOrder: ['🌱 Spring', '☀️ Summer', '🍂 Autumn', '❄️ Winter'],
      points: 20
    },
    {
      type: 'multiple',
      text: 'Which is the fastest land animal?',
      choices: ['Cheetah', 'Lion', 'Tiger', 'Leopard'],
      correctAnswer: 'Cheetah',
      points: 10
    }
  ],
  totalPoints: 55,
  status: 'Current',
  studentAnswers: []
};

export default function StudentsQuiz() {
    const [modalVisible, setModalVisible] = useState(false);
    const [student, setStudent] = useState({});
    const [teacher, setTeacher] = useState({});
    const [currentQuizzes, setCurrentQuizzes] = useState([]);
    const [completedQuizzes, setCompletedQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);
    const navigation = useNavigation();
    const [confirmLoading, setConfirmLoading] = useState(false);

    const fetchQuizData = async () => {
        try {
            const studentId = await AsyncStorage.getItem('studentId');
            if (!studentId) {
                setErrorMessage('Student ID not found.');
                setErrorVisible(true);
                return;
            }

            // Fetch student info
            const studentInfo = await getStudentInfo(studentId);
            setStudent(studentInfo);

            // Fetch all current quizzes for all students
            const allCurrentQuizzes = await getAllCurrentQuizzes();
            // Append the sample quizzes
            const allQuizzesWithSample = [...allCurrentQuizzes, SAMPLE_QUIZ, MORE_TYPES_QUIZ];
            // Filter completed quizzes for this student
            const completed = allQuizzesWithSample.filter(q => q.studentAnswers && q.studentAnswers.some(sa => sa.studentId?.toString() === studentId && sa.status === 'Completed'));
            const current = allQuizzesWithSample.filter(q => !q.studentAnswers || !q.studentAnswers.some(sa => sa.studentId?.toString() === studentId && sa.status === 'Completed'));
            setCurrentQuizzes(current);
            setCompletedQuizzes(completed);
            // Optionally, set teacher info to blank or generic
            setTeacher({ name: 'All', subject: 'All Subjects' });
            return true;
        } catch (error) {
            setErrorMessage(error.message || 'Failed to fetch data.');
            setErrorVisible(true);
            return false;
        }
    };

    // Initial data fetch
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await fetchQuizData();
            setLoading(false);
        };
        
        loadInitialData();
    }, []);

    // Real-time updates using polling
    useEffect(() => {
        const pollingInterval = setInterval(() => {
            fetchQuizData();
        }, 30000); // Poll every 30 seconds
        
        return () => clearInterval(pollingInterval);
    }, []);

    // Refresh when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            fetchQuizData();
            return () => {};
        }, [])
    );

    // Pull-to-refresh functionality
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchQuizData();
        setRefreshing(false);
    };

    const handleConfirm = async () => {
        try {
            setConfirmLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setConfirmLoading(false);
            setModalVisible(false);
            // Either pass the entire quiz object or just the ID
            navigation.navigate("Game", {
                quizId: selectedQuizId,
                quizData: selectedQuiz // Pass the entire quiz if you have it
            });
        } catch (error) {
            setConfirmLoading(false);
            console.error("Error in handleConfirm:", error);
        }
    };
    
    const handleCancel = () => {
        setModalVisible(false);
        console.log("Cancelled!");
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date not available';
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? 'Invalid Date'
            : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <LoadingScreen visible={loading} />

            <View style={styles.subjectCard}>
                <Image source={require('../../assets/books.png')} style={styles.subjectImage} />
                <View style={styles.subjectInfo}>
                    <Text style={styles.subjectTitle}>{teacher.subject}</Text>
                    <Text style={styles.subjectSubtitle}>Teacher: {teacher.name}</Text>
                </View>
            </View>

            <View style={styles.quizSection}>
                <Text style={styles.sectionTitle}>Current Quiz</Text>
                <FlatList
                    data={currentQuizzes}
                    keyExtractor={(item, index) => (item?._id ?? index).toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={({ item }) => (
                        <View style={styles.quizCard}>
                            <Image source={require('../../assets/question.png')} style={styles.quizImage} />
                            <View style={styles.quizInfo}>
                                <Text style={styles.quizTitle}>{item.title}</Text>
                                <Text style={styles.quizDetails}>Points: {item.totalPoints}</Text>
                                <Text style={styles.quizDetails}>Date: {formatDate(item.createdAt)}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.takeQuizButton}
                                onPress={() => {
                                    setSelectedQuizId(item._id);
                                    setSelectedQuiz(item);
                                    setModalVisible(true);
                                }}>
                                <MaterialCommunityIcons name="sword" size={20} color="#f2e8cf" />
                                <Text style={styles.takeQuizText}>Take Quiz</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyStateContainer}>
                            <Text style={styles.emptyStateText}>No current quizzes available</Text>
                        </View>
                    }
                />
            </View>

            <View style={styles.quizSection}>
                <Text style={styles.sectionTitle}>Completed Quizzes</Text>
                <FlatList
                    data={completedQuizzes}
                    keyExtractor={(item, index) => (item?._id ?? index).toString()}
                    renderItem={({ item }) => (
                        <View style={styles.quizCard}>
                            <Image source={require('../../assets/question.png')} style={styles.quizImage} />
                            <View style={styles.quizInfo}>
                                <Text style={styles.quizTitle}>{item.title}</Text>
                                <Text style={styles.quizDetails}>Points: {item.totalPoints}</Text>
                                <Text style={styles.quizDetails}>Date: {formatDate(item.createdAt)}</Text>
                            </View>
                            <Text style={styles.accumulatedPoints}>
                                +{item.studentAnswers.find(sa => sa.studentId.toString() === student._id?.toString())?.totalScore || 0}
                                <AntDesign name="star" size={24} color="#264653" />
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyStateContainer}>
                            <Text style={styles.emptyStateText}>No completed quizzes yet</Text>
                        </View>
                    }
                />
            </View>

            <ConfirmationModal
                visible={modalVisible}
                title="Start Quiz"
                message="Are you sure you're ready to begin this quiz?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                loading={confirmLoading}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#27AE60', // same green as admin container
  },

  // Subject card
  subjectCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    width: '95%',           // responsive width
    maxWidth: 1450,         // limit for big screens
    alignSelf: 'center',
  },
  subjectImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 15,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  subjectSubtitle: {
    fontSize: 14,
    color: '#555',
  },

  // Section headers
  quizSection: {
    marginTop: 15,
    width: '95%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 10,
  },

  // Quiz card
  quizCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  quizImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 15,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  quizDetails: {
    fontSize: 14,
    color: '#555',
  },

  // Take quiz button (accent style)
  takeQuizButton: {
    flexDirection: 'row',
    backgroundColor: '#FFD83D',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  takeQuizText: {
    color: '#000000',
    fontWeight: 'bold',
    marginLeft: 6,
  },

  // Points badge
  accumulatedPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#FFD83D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    elevation: 4,
  },

  // Empty state
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d3d3d3',
  },
  emptyStateText: {
    color: '#555',
    fontSize: 16,
  },
});