import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const ViewRewardModal = ({ visible, onClose, reward }) => {
  const samplePurchases = [
    { id: "1", name: "Alice Johnson", quantity: 2, pointsSpent: 20, datePurchased: "Feb 25, 2025" },
    { id: "2", name: "Bryan Mico", quantity: 1, pointsSpent: 10, datePurchased: "Feb 26, 2025" },
    { id: "3", name: "Charlie Kim", quantity: 3, pointsSpent: 30, datePurchased: "Feb 27, 2025" },
    { id: "4", name: "Diana Cruz", quantity: 5, pointsSpent: 50, datePurchased: "Feb 28, 2025" },
  ];

  return (
    <ReusableModal visible={visible} onClose={onClose} title={reward?.rewardName || "Reward Details"}>
      <View style={styles.container}>
        <Text style={styles.header}>Students Who Purchased</Text>
        <FlatList
          data={samplePurchases}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.points}>
                  {item.pointsSpent} <AntDesign name="star" size={18} color="#f5cb5c" />
                </Text>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.info}>
                  <FontAwesome5 name="shopping-cart" size={14} color="#386641" /> {item.quantity} bought
                </Text>
                <Text style={styles.info}>Date: {item.datePurchased}</Text>
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
  points: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#386641",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  info: {
    fontSize: 12,
    color: "#555",
  },
});

export default ViewRewardModal;
