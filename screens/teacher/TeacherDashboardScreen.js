import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, FlatList, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTeacherInfo, getAllStudents } from '../../services/teacherService';
import LoadingScreen from '../components/LoadingScreen';
import { Adminstyles } from '../../styles/Adminstyles';
import studentImg from '../../assets/student.png';

const TeacherDashboardScreen = () => {
  const [teacher, setTeacher] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeacherAndStudents = async () => {
      try {
        setLoading(true);
        const teacherId = await AsyncStorage.getItem('teacherId');
        if (!teacherId) return;

        const teacherData = await getTeacherInfo(teacherId);
        setTeacher(teacherData);

        const studentsData = await getAllStudents(teacherId);
        const studentDataWithImage = (studentsData || []).map((student) => ({
          ...student,
          image: studentImg,
        }));
        const sortedStudents = studentDataWithImage
          .sort((a, b) => b.points - a.points)
          .slice(0, 5);

        setStudents(sortedStudents);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherAndStudents();
  }, []);

  const refreshStudentData = async () => {
    const teacherId = await AsyncStorage.getItem('teacherId');
    if (!teacherId) return;

    const teacherData = await getTeacherInfo(teacherId);
    setTeacher(teacherData);

    const studentsData = await getAllStudents(teacherId);
    const sortedStudents = (studentsData || []).sort((a, b) => b.points - a.points);
    setStudents(sortedStudents);
  };

  return (
    <SafeAreaView style={Adminstyles.container}>
      <LoadingScreen visible={loading} />

      {/* Teacher Info Card */}
      <View style={Adminstyles.teacherCard}>
        <Image source={require('../../assets/teacher.png')} style={Adminstyles.cardImage} />
        <View style={Adminstyles.cardInfo}>
          <Text style={Adminstyles.cardTitle}>{teacher.name || 'Teacher'}</Text>
          <Text style={Adminstyles.cardSubtitle}>{teacher.subject || 'Subject'}</Text>
        </View>
        <TouchableOpacity onPress={refreshStudentData} style={Adminstyles.refreshButton}>
          <AntDesign name="reload1" size={20} color="#FFD83D" />
        </TouchableOpacity>
      </View>

      {/* Leaderboard */}
      <FlatList
        data={students}
        keyExtractor={(item, index) => (item?.id ?? index).toString()}
        numColumns={1}
        contentContainerStyle={Adminstyles.list}
        renderItem={({ item }) => (
          <View style={Adminstyles.card}>
            <Image source={item.image} style={Adminstyles.cardImage} />
            <View style={Adminstyles.cardInfo}>
              <Text style={Adminstyles.cardTitle}>{item.name}</Text>
              <Text style={Adminstyles.cardSubtitle}>ID: {item.studentID}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default TeacherDashboardScreen;
