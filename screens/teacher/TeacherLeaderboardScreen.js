import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

import { getAllStudents } from '../../services/teacherService';

const TeacherLeaderboardScreen = () => {
  const [students, setStudents] = useState([]);
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const storedTeacherId = await AsyncStorage.getItem('teacherId');
        if (!storedTeacherId) return;
        setTeacherId(storedTeacherId);

        const studentList = await getAllStudents(storedTeacherId);
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
          <AntDesign name="Trophy" size={22} color="#f2e8cf" /> Teacher Leaderboard
        </Text>

        <FlatList
          data={students}
          keyExtractor={(item, index) => (item?._id ?? index).toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>
                {item.points}
                <AntDesign name="star" size={16} color="#f5cb5c" />
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noDataText}>No students found</Text>
          }
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
    marginVertical: 10,
    marginHorizontal: 5,
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f2e8cf',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f2e8cf',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#386641',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#386641',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6a994e',
    flexDirection: 'row',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#f2e8cf',
    marginTop: 20,
  },
});

export default TeacherLeaderboardScreen;
