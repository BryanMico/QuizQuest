import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { getAllStudents } from '../../services/teacherService';
import { Leaderboardstyles } from '../../styles/Leaderboardstyles';

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
    <SafeAreaView style={Leaderboardstyles.container}>
      <View style={Leaderboardstyles.leaderboardContainer}>
        <Text style={Leaderboardstyles.leaderboardTitle}>
          <AntDesign name="Trophy" size={22} color="#f2e8cf" /> Student Leaderboard
        </Text>
        <FlatList
          data={students}
          keyExtractor={(item, index) => (item?._id ?? index).toString()}
          renderItem={({ item, index }) => (
            <View style={Leaderboardstyles.card}>
              {/* Left side: Rank + Name */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={Leaderboardstyles.rank}>#{index + 1}</Text>
                <Text style={Leaderboardstyles.cardTitle}>{item.name}</Text>
              </View>

              {/* Right side: Points + Star */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={Leaderboardstyles.cardSubtitle}>{item.points}</Text>
                <AntDesign name="star" size={16} color="#f5cb5c" style={{ marginLeft: 4 }} />
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={Leaderboardstyles.noDataText}>No students found</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};



export default TeacherLeaderboardScreen;
