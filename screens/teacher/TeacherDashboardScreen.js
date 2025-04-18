import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, Image, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTeacherInfo, getAllStudents } from '../../services/teacherService';
import LoadingScreen from '../components/LoadingScreen';

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

        // Fetch teacher info
        const teacherData = await getTeacherInfo(teacherId);
        setTeacher(teacherData);

        // Fetch leaderboard
        const studentsData = await getAllStudents(teacherId);

        // Ensure studentsData is an array even if no students are found
        const sortedStudents = (studentsData || []).sort((a, b) => b.points - a.points);
        setStudents(sortedStudents);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherAndStudents();
  }, []);

  const refreshStudentData = async () => {
    try {

      const teacherId = await AsyncStorage.getItem('teacherId');
      if (!teacherId) return;

      // Fetch teacher info
      const teacherData = await getTeacherInfo(teacherId);
      setTeacher(teacherData);

      // Fetch leaderboard
      const studentsData = await getAllStudents(teacherId);

      // Ensure studentsData is an array even if no students are found
      const sortedStudents = (studentsData || []).sort((a, b) => b.points - a.points);
      setStudents(sortedStudents);
    } catch (error) {
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <LoadingScreen visible={loading} />

      <View style={styles.profileCard}>
        <Image source={require('../../assets/teacher.png')} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileTitle}>{teacher.name || 'Teacher'}</Text>
          <Text style={styles.profileSubtitle}>{teacher.subject || 'Subject'}</Text>
        </View>
        <TouchableOpacity onPress={refreshStudentData} style={styles.refreshButton}>
          <AntDesign name="reload1" size={20} color="#386641" />
        </TouchableOpacity>
      </View>

      <View style={styles.leaderboardContainer}>
        <Text style={styles.leaderboardTitle}>
          <AntDesign name="Trophy" size={24} color="#f2e8cf" /> Student Leaderboard
        </Text>

        <FlatList
          data={students}
          keyExtractor={(item, index) => (item?.id ?? index).toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>
                {item.points} <AntDesign name="star" size={24} color="#f5cb5c" />
              </Text>
            </View>
          )}
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#a7c957',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#f2e8cf',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
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
  },
  profileSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
  leaderboardContainer: {
    backgroundColor: '#6a994e',
    padding: 15,
    borderRadius: 8,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f2e8cf',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f2e8cf',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#386641',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#386641',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#f2e8cf',
    marginTop: 20,
  },

});

export default TeacherDashboardScreen;