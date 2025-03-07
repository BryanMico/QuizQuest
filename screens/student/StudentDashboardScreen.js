import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, Image, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const StudentDashboardScreen = () => {
  const student = {
    id: "6",
    name: "Bry (Me)",
    studentID: "102099",
    username: "bry_me",
    grade: "5th Grade",
    pointsEarned: 600,
    pointsSpent: 100,
    image: require('../../assets/student.png'),
  };

  const [students, setStudents] = useState([
    { id: '1', fullName: 'John Doe', points: 500 },
    { id: '2', fullName: 'Jane Smith', points: 700 },
    { id: '3', fullName: 'Bob Johnson', points: 450 },
    { id: '4', fullName: 'Alice Brown', points: 800 },
    { id: '5', fullName: 'Charlie White', points: 650 },
    student,
  ]);

  const sortedStudents = students.sort((a, b) => b.pointsEarned - a.pointsEarned);

  const [quizzes, setQuizzes] = useState([
    { id: "1", title: "Counting Adventure", subject: "Mathematics", professor: "Prof. Anderson", points: "100", image: require('../../assets/question.png'), date: "Feb 27, 2025" },
    { id: "2", title: "Adding Adventure", subject: "Mathematics", professor: "Prof. Williams", points: "100", image: require('../../assets/question.png'), date: "Feb 26, 2025" },
  ]);;


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCard}>
        <Image source={student.image} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileTitle}>{student.name}</Text>
          <Text style={styles.profileSubtitle}>ID: {student.studentID} | {student.grade}</Text>
        </View>
      </View>

      <View style={styles.leaderboardContainer}>
        <Text style={styles.leaderboardTitle}><AntDesign name="Trophy" size={22} color="#f2e8cf" /> Student Leaderboard</Text>

        <FlatList
          data={sortedStudents}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={[styles.card2, item.id === student.id && styles.myCard]}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.cardTitle2}>{item.name || item.fullName}</Text>
              <Text style={styles.cardSubtitle2}>{item.pointsEarned || item.points} <AntDesign name="star" size={24} color="#f5cb5c" /></Text>
            </View>
          )}
        />
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}> <MaterialIcons name="quiz" size={22} color="#f2e8cf" /> Current Quiz</Text>
        </View>
        <FlatList
          data={quizzes}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.points} <AntDesign name="star" size={7} color="#f5cb5c" /></Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subject} - {item.professor}</Text>
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