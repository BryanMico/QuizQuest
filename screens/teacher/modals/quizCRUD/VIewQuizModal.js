import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import AntDesign from '@expo/vector-icons/AntDesign';


const QuizViewModal = ({ visible, onClose, quizTitle }) => {
  const sampleStudents = [
    { id: "1", name: "Alice Johnson", score: 85, points: 170, timeTaken: "12m", date: "Feb 25, 2025" },
    { id: "2", name: "Bryan Mico", score: 92, points: 184, timeTaken: "9m", date: "Feb 26, 2025" },
    { id: "3", name: "Charlie Kim", score: 78, points: 156, timeTaken: "15m", date: "Feb 27, 2025" },
    { id: "4", name: "Diana Cruz", score: 88, points: 176, timeTaken: "11m", date: "Feb 28, 2025" },
  ];

  return (
    <ReusableModal visible={visible} onClose={onClose} title={quizTitle}>
      <View style={styles.container}>
        <Text style={styles.header}>Results</Text>
        <FlatList
          data={sampleStudents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.points}>{item.points} <AntDesign name="star" size={24} color="#f5cb5c" /></Text>
              </View>
              <Text style={styles.info}>Score: {item.score}%</Text>
              <Text style={styles.info}>Time: {item.timeTaken}</Text>
              <Text style={styles.info}>Completed: {item.date}</Text>
            </View>
          )}
        />
      </View>
    </ReusableModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  studentCard: {
    backgroundColor: "#f1faee",
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
    borderLeftWidth: 4,
    borderColor: "#386641",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  points: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#386641",
  },
  info: {
    fontSize: 12,
    color: "#555",
  },
});

export default QuizViewModal;
