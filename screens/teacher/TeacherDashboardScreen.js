import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';


const TeacherDashboardScreen = () => {
  const [students, setStudents] = useState([
    { id: '1', fullName: 'John Doe', points: 500 },
    { id: '2', fullName: 'Jane Smith', points: 700 },
    { id: '3', fullName: 'Bob Johnson', points: 450 },
    { id: '4', fullName: 'Alice Brown', points: 800 },
    { id: '5', fullName: 'Charlie White', points: 650 },
  ]);

  // Sort students by points in descending order
  const sortedStudents = students.sort((a, b) => b.points - a.points);

  return (
    <SafeAreaView style={styles.container}>
      {/* Teacher Profile Card */}
      <View style={styles.profileCard}>
      <Image source={require('../../assets/teacher.png')} style={styles.profileImage} />
      <View style={styles.profileInfo}>
          <Text style={styles.profileTitle}>Mr. Alex Johnson</Text>
          <Text style={styles.profileSubtitle}>Mathematics Teacher</Text>
        </View>
      </View>

      {/* Leaderboard Section */}
      <View style={styles.leaderboardContainer}>
        <Text style={styles.leaderboardTitle}><AntDesign name="Trophy" size={24} color="#f2e8cf" /> Student Leaderboard</Text>

        <FlatList
          data={sortedStudents}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.cardTitle}>{item.fullName}</Text>
              <Text style={styles.cardSubtitle}>{item.points} <AntDesign name="star" size={24} color="#f5cb5c" /></Text>
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
    marginHorizontal: 10, // Added margin on left and right
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
});

export default TeacherDashboardScreen;
