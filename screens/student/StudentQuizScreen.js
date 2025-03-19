import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text, FlatList, View, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ConfirmationModal from './modals/confirmationModal';
import LoadingScreen from '../components/LoadingScreen';
import { getStudentInfo } from "../../services/studentService";
import { getTeacherInfo } from "../../services/teacherService";
import { getQuizzesStatus } from "../../services/quizService";

export default function StudentsQuiz() {
    const [modalVisible, setModalVisible] = useState(false);
    const [student, setStudent] = useState({});
    const [teacher, setTeacher] = useState({});
    const [currentQuizzes, setCurrentQuizzes] = useState([]);
    const [completedQuizzes, setCompletedQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const navigation = useNavigation();
    const [confirmLoading, setConfirmLoading] = useState(false);


    useEffect(() => {
        const fetchTeacherAndStudents = async () => {
            try {
                setLoading(true);

                const studentId = await AsyncStorage.getItem('studentId');
                if (!studentId) {
                    setErrorMessage('Student ID not found.');
                    setErrorVisible(true);
                    return;
                }

                // Fetch student info
                const studentInfo = await getStudentInfo(studentId);
                setStudent(studentInfo);

                // Extract teacherId from studentInfo
                const teacherId = studentInfo.teacherId;
                if (!teacherId) {
                    setErrorMessage('Teacher ID not found in student info.');
                    setErrorVisible(true);
                    return;
                }


                const teacherData = await getTeacherInfo(teacherId);
                const teacherQuizzesCurrent = await getQuizzesStatus('Current', teacherId, studentId);
                const teacherQuizzesCompleted = await getQuizzesStatus('Completed', teacherId, studentId);
                setTeacher(teacherData);
                setCurrentQuizzes(teacherQuizzesCurrent);
                setCompletedQuizzes(teacherQuizzesCompleted)

            } catch (error) {
                setErrorMessage(error.message || 'Failed to fetch data.');
                setErrorVisible(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherAndStudents();
    }, []);

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
                    keyExtractor={(item, index) => (item?.id ?? index).toString()}
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
                />
            </View>



            <View style={styles.quizSection}>
                <Text style={styles.sectionTitle}>Completed Quizzes</Text>
                <FlatList
                    data={completedQuizzes}
                    keyExtractor={(item, index) => (item?.id ?? index).toString()}
                    renderItem={({ item }) => (
                        <View style={styles.quizCard}>
                            <Image source={require('../../assets/question.png')} style={styles.quizImage} />
                            <View style={styles.quizInfo}>
                                <Text style={styles.quizTitle}>{item.title}</Text>
                                <Text style={styles.quizDetails}>Points: {item.totalPoints}</Text>
                                <Text style={styles.quizDetails}>Date: {formatDate(item.createdAt)}</Text>
                            </View>
                            <Text style={styles.accumulatedPoints}>
                                +{item.studentAnswers.find(sa => sa.studentId.toString() === student._id.toString())?.totalScore || 0}
                                <AntDesign name="star" size={24} color="#f5cb5c" />
                            </Text>
                        </View>
                    )}
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
        padding: 5,
        backgroundColor: '#a7c957',
    },
    subjectCard: {
        flexDirection: 'row',
        backgroundColor: '#f2e8cf',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    subjectImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
    },
    subjectInfo: {
        flex: 1,
    },
    subjectTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#386641',
    },
    subjectSubtitle: {
        fontSize: 14,
        color: '#6a994e',
    },
    quizSection: {
        marginTop: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f2e8cf',
        backgroundColor: "#6a994e",
        padding: 5,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#386641",
    },
    quizCard: {
        flexDirection: 'row',
        backgroundColor: '#fefae0',
        padding: 10,
        marginBottom: 7,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#386641",
    },
    quizImage: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginRight: 10,
    },
    quizInfo: {
        flex: 1,
    },
    quizTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#386641',
    },
    quizDetails: {
        fontSize: 14,
        color: '#6a994e',
    },
    takeQuizButton: {
        flexDirection: 'row',
        backgroundColor: '#386641',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    takeQuizText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    accumulatedPoints: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#386641',
    },
});

