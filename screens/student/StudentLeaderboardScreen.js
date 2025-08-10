import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

import { getStudentInfo } from '../../services/studentService';
import { getAllStudents } from '../../services/teacherService';

const StudentLeaderboardScreen = () => {
  const [student, setStudent] = useState({});
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const studentId = await AsyncStorage.getItem('studentId');
        const studentInfo = await getStudentInfo(studentId);
        setStudent(studentInfo);

        const teacherId = studentInfo.teacherId;
        const studentList = await getAllStudents(teacherId);
        const sorted = (studentList || []).sort((a, b) => b.points - a.points);
        setStudents(sorted);
      } catch (error) {
        console.error("Leaderboard fetch error:", error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.leaderboardContainer}>
        <Text style={styles.leaderboardTitle}>
          <AntDesign name="Trophy" size={22} color="#f2e8cf" /> Student Leaderboard
        </Text>

        <FlatList
          data={students}
          keyExtractor={(item, index) => (item?.id ?? index).toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.card2, item._id === student._id && styles.myCard]}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.cardTitle2}>{item.name}</Text>
              <Text style={styles.cardSubtitle2}>
                {item.points}
                <AntDesign name="star" size={16} color="#f5cb5c" />
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
    backgroundColor: '#a7c957',
    padding: 10,
  },
 leaderboardContainer: {
    backgroundColor: '#6a994e',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    marginTop: 10,        // Add top margin
    marginHorizontal: 5,  // Add side spacing
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
});

export default StudentLeaderboardScreen;
