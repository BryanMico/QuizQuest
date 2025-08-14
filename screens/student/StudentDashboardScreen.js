import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, FlatList, View, Image, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LoadingScreen from '../components/LoadingScreen';
import ErrorModal from '../components/ErrorModal';
import { getStudentInfo } from "../../services/studentService";
import { getAllStudents } from "../../services/teacherService";
import { getTeacherInfo } from "../../services/teacherService";
import { getQuizzesStatus } from "../../services/quizService";
import { Adminstyles } from '../../styles/Adminstyles';
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
  ...Adminstyles, 
  profileCard: {
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
    color: '#264653',
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#264653',
  },

  // keep student-specific stuff
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#264653',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    elevation: 2,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#f2e8cf',
    textAlign: 'center',
  },
    sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft:5,
  },
});


export default StudentDashboardScreen;