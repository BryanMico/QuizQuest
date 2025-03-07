import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text, FlatList, View, Image, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ConfirmationModal from './modals/confirmationModal';
import mathImage from '../../assets/math.png';

export default function StudentsQuiz() {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const subject = {
        id: '1', name: 'Mathematics', teacher: 'Mr. Smith', students: 25, image: mathImage
    };

    const [quizzes, setQuizzes] = useState([
        { id: "1", title: "Counting Adventure", points: "100", image: require('../../assets/question.png'), date: "Feb 27, 2025", completed: false },
        { id: "2", title: "Adding Adventure", points: "100", image: require('../../assets/question.png'), date: "Feb 26, 2025", completed: true },
        { id: "3", title: "Subtracting Adventure", points: "120", image: require('../../assets/question.png'), date: "Feb 26, 2025", completed: true },

    ]);

    const handleConfirm = async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setModalVisible(false);
        navigation.navigate("Game");

    };

    const handleCancel = () => {
        setModalVisible(false);
        console.log("Cancelled!");
    };

    const currentQuiz = quizzes.find(quiz => !quiz.completed);
    const completedQuizzes = quizzes.filter(quiz => quiz.completed);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subjectCard}>
                <Image source={subject.image} style={styles.subjectImage} />
                <View style={styles.subjectInfo}>
                    <Text style={styles.subjectTitle}>{subject.name}</Text>
                    <Text style={styles.subjectSubtitle}>Teacher: {subject.teacher}</Text>
                    <Text style={styles.subjectSubtitle}>Students: {subject.students}</Text>
                </View>
            </View>

            {currentQuiz && (
                <View style={styles.quizSection}>
                    <Text style={styles.sectionTitle}>Current Quiz</Text>
                    <View style={styles.quizCard}>
                        <Image source={currentQuiz.image} style={styles.quizImage} />
                        <View style={styles.quizInfo}>
                            <Text style={styles.quizTitle}>{currentQuiz.title}</Text>
                            <Text style={styles.quizDetails}>Points: {currentQuiz.points}</Text>
                            <Text style={styles.quizDetails}>Date: {currentQuiz.date}</Text>
                        </View>
                        <TouchableOpacity style={styles.takeQuizButton} onPress={() => setModalVisible(true)}>
                            <MaterialCommunityIcons name="sword" size={20} color="#f2e8cf" />
                            <Text style={styles.takeQuizText}>Take Quiz</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {completedQuizzes.length > 0 && (
                <View style={styles.quizSection}>
                    <Text style={styles.sectionTitle}>Completed Quizzes</Text>
                    <FlatList
                        data={completedQuizzes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.quizCard}>
                                <Image source={item.image} style={styles.quizImage} />
                                <View style={styles.quizInfo}>
                                    <Text style={styles.quizTitle}>{item.title}</Text>
                                    <Text style={styles.quizDetails}>Points: {item.points}</Text>
                                    <Text style={styles.quizDetails}>Date: {item.date}</Text>
                                </View>
                                <Text style={styles.accumulatedPoints}>+{item.points} <AntDesign name="star" size={24} color="#f5cb5c" /></Text>
                            </View>
                        )}
                    />
                </View>
            )}
            <ConfirmationModal
                visible={modalVisible}
                title="Start Quiz"
                message="Are you sure you’re ready to begin this quiz?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
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

