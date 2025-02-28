import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ReusableModal from "../../../components/ModalScreen";

export default function ViewStudentModal({ visible, onClose, student }) {
  if (!student) return null;

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Student Details">
      <View style={styles.infoContainer}>
        <View style={styles.column}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{student.name}</Text>

          <Text style={styles.label}>Student ID</Text>
          <Text style={styles.value}>{student.studentID}</Text>

          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{student.username}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Points Earned</Text>
          <Text style={styles.value}>{student.pointsEarned}</Text>

          <Text style={styles.label}>Points Spent</Text>
          <Text style={styles.value}>{student.pointsSpent}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quizzes Taken</Text>
      <FlatList
        data={student.quizzes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.quizItem}>
            <View style={styles.quizHeader}>
              <Text style={styles.quizTitle}>{item.title}</Text>
              <Text style={styles.quizPoints}>{item.points} <AntDesign name="star" size={16} color="#f5cb5c" /></Text>
            </View>
            <Text style={styles.quizDate}>Date: {item.date}</Text>
          </View>
        )}
      />
    </ReusableModal>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    width: "48%",
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  quizItem: {
    backgroundColor: "#f1faee",
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
    borderLeftWidth: 4,
    borderColor: "#386641",
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quizTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  quizPoints: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#386641",
  },
  quizDate: {
    fontSize: 12,
    color: "#555",
  },
});
