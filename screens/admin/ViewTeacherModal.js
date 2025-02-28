import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ReusableModal from "../components/ModalScreen";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const ViewTeacherModal = ({ visible, onClose, teacher }) => {
  const sampleStudents = [
    { id: "1", name: "Alice Johnson", studentID: "S12345", username: "alicej", dateAdded: "Feb 10, 2025" },
    { id: "2", name: "Bryan Mico", studentID: "S67890", username: "brymico", dateAdded: "Feb 12, 2025" },
    { id: "3", name: "Charlie Kim", studentID: "S54321", username: "charliek", dateAdded: "Feb 14, 2025" },
    { id: "4", name: "Diana Cruz", studentID: "S98765", username: "dianac", dateAdded: "Feb 16, 2025" },
  ];

  return (
    <ReusableModal visible={visible} onClose={onClose} title={teacher?.name || "Teacher Details"}>
      <View style={styles.container}>
        <Text style={styles.header}>Students Added</Text>
        <FlatList
          data={sampleStudents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.dateAdded}>Added: {item.dateAdded}</Text>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.info}>Student ID: {item.studentID}</Text>
                <Text style={styles.info}>Username: {item.username}</Text>
              </View>
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
  dateAdded: {
    fontSize: 12,
    color: "#555",
  },
  cardDetails: {
    marginTop: 4,
  },
  info: {
    fontSize: 12,
    color: "#555",
  },
});

export default ViewTeacherModal;
