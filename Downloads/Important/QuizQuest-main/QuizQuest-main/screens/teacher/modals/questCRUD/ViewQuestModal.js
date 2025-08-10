import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import AntDesign from '@expo/vector-icons/AntDesign';

const ViewQuestModal = ({ visible, onClose, quest }) => {
  const sampleStudents = [
    { id: "1", name: "Alice Johnson", points: 100, dateCompleted: "Feb 25, 2025" },
    { id: "2", name: "Bryan Mico", points: 200, dateCompleted: "Feb 26, 2025" },
    { id: "3", name: "Charlie Kim", points: 250, dateCompleted: "Feb 27, 2025" },
    { id: "4", name: "Diana Cruz", points: 350, dateCompleted: "Feb 28, 2025" },
  ];

  return (
    <ReusableModal visible={visible} onClose={onClose} title={quest?.quest || "Quest Details"}>
      <View style={styles.container}>
        <Text style={styles.header}>Students Who Completed</Text>
        <FlatList
          data={sampleStudents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.points}>{item.points} <AntDesign name="star" size={18} color="#f5cb5c" /></Text>
              </View>
              <Text style={styles.info}>Completed: {item.dateCompleted}</Text>
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

export default ViewQuestModal;
