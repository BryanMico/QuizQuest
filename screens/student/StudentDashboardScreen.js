import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, FlatList, View, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LoadingScreen from '../components/LoadingScreen';
import ErrorModal from '../components/ErrorModal';
import { getStudentInfo } from "../../services/studentService";
import { getAllStudents } from "../../services/teacherService";
import { getTeacherInfo } from "../../services/teacherService";
import { getQuizzesStatus } from "../../services/quizService";

const StudentDashboardScreen = () => {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState({});
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState({});
  const [currentQuizzes, setCurrentQuizzes] = useState([]);
  

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

        // Fetch leaderboard data
        const studentsData = await getAllStudents(teacherId);
        const teacherData = await getTeacherInfo(teacherId);
        const teacherQuizzesCurrent = await getQuizzesStatus('Current', teacherId, studentId);
        setTeacher(teacherData);
        setCurrentQuizzes(teacherQuizzesCurrent);
        // Ensure studentsData is an array even if no students are found
        const sortedStudents = (studentsData || []).sort((a, b) => b.points - a.points);
        setStudents(sortedStudents);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to fetch data.');
        setErrorVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherAndStudents();
  }, []);

  const sortedStudents = students.sort((a, b) => b.points - a.points);
  // Add this to StudentDashboardScreen.js
  const refreshStudentData = async () => {
    try {
      const studentId = await AsyncStorage.getItem('studentId');

      if (!studentId) {
        setErrorMessage('Student ID not found.');
        setErrorVisible(true);
        return;
      }

      // Fetch updated student info
      const studentInfo = await getStudentInfo(studentId);
      setStudent(studentInfo);

      // Also refresh other data if needed
      const teacherId = studentInfo.teacherId;
      const teacherQuizzesCurrent = await getQuizzesStatus('Current', teacherId, studentId);
      setCurrentQuizzes(teacherQuizzesCurrent);

      // Update leaderboard
      const studentsData = await getAllStudents(teacherId);
      const sortedStudents = (studentsData || []).sort((a, b) => b.points - a.points);
      setStudents(sortedStudents);
    } catch (error) {
      console.error('Error refreshing student data:', error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <LoadingScreen visible={loading} />
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onTryAgain={() => {
          setErrorVisible(false);
        }}
        onCancel={() => setErrorVisible(false)}
      />
      <View style={styles.profileCard}>
        <Image source={require('../../assets/student.png')} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileTitle}>{student.name}</Text>
          <Text style={styles.profileSubtitle}>ID: {student.studentID} | {teacher.subject} {student.role}</Text>
        </View>
        <TouchableOpacity onPress={refreshStudentData} style={styles.refreshButton}>
          <AntDesign name="reload1" size={20} color="#386641" />
        </TouchableOpacity>
      </View>

      <View style={styles.leaderboardContainer}>
        <Text style={styles.leaderboardTitle}><AntDesign name="Trophy" size={22} color="#f2e8cf" /> Student Leaderboard</Text>

        <FlatList
          data={sortedStudents || []} // Ensure it's always an array
          keyExtractor={(item, index) => (item?.id ?? index).toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.card2, item._id === student._id && styles.myCard]}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.cardTitle2}>{item.name}</Text>
              <Text style={styles.cardSubtitle2}>
                {item.pointsEarned || item.points}
                <AntDesign name="star" size={24} color="#f5cb5c" />
              </Text>
            </View>
          )}
        />
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}> <MaterialIcons name="quiz" size={22} color="#f2e8cf" /> Current Quiz</Text>
        </View>
        <FlatList
          data={currentQuizzes}
          horizontal
          keyExtractor={(item, index) => (item?.id ?? index).toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={require('../../assets/question.png')} style={styles.cardImage} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.totalPoints} <AntDesign name="star" size={7} color="#f5cb5c" /></Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{teacher.subject} - {teacher.name}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#a7c957',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#6a994e',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    elevation: 2,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#fff', // Dark green for contrast
    textAlign: 'center',
  },

  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#f2e8cf',
    padding: 15,
    borderRadius: 10,
    marginBottom: 7,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#386641',
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#6a994e',
  },
  sectionContainer: {
    backgroundColor: '#6a994e',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f2e8cf',
  },
  viewAll: {
    fontSize: 14,
    color: '#f5cb5c',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f2e8cf',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    width: 110,
    borderWidth: 1,
    borderColor: '#386641',
  },
  cardImage: {
    width: 30,
    height: 30,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#386641',
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#6a994e',
    textAlign: 'center',
  },
  leaderboardContainer: {
    backgroundColor: '#6a994e',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 7
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f2e8cf',
    marginBottom: 10,
  },
  card2: {
    backgroundColor: '#f2e8cf',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myCard: {
    backgroundColor: '#f5cb5c',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#386641',
  },
  cardTitle2: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#386641',
  },
  cardSubtitle2: {
    fontSize: 14,
    color: '#6a994e',
  },
  cardSubject: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6a994e',
    textAlign: 'center',
    marginBottom: 2,
  },
  cardProfessor: {
    fontSize: 8,
    fontStyle: 'italic',
    color: '#386641',
    textAlign: 'center',
    marginBottom: 2,
  }
});

export default StudentDashboardScreen;