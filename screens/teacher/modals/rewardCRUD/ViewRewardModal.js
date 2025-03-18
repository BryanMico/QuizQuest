import React, { useEffect, useState } from "react"; 
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getTeacherStudentsPurchasedRewards, fulfillReward } from "../../../../services/rewardService";
import { TouchableOpacity } from "react-native-gesture-handler";

const ViewRewardModal = ({ visible, onClose, reward, teacherId, onRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible && reward && teacherId) {
      fetchPurchases();
    }
  }, [visible, reward, teacherId]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const data = await getTeacherStudentsPurchasedRewards(teacherId);
      
      // Filter purchases for the current reward only
      const rewardPurchases = data.filter(
        purchase => purchase.rewardId._id === reward._id
      );
      
      // Format the data for display
      const formattedPurchases = rewardPurchases.map(purchase => ({
        id: purchase._id,
        name: purchase.studentId.name,
        studentId: purchase.studentId._id,
        pointsSpent: purchase.pointsCost,
        quantity: purchase.quantity,
        datePurchased: new Date(purchase.createdAt).toLocaleDateString(),
        fulfilled: purchase.fulfilled
      }));
      
      setPurchases(formattedPurchases);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setError("Failed to load student purchases.");
    } finally {
      setLoading(false);
    }
  };

  const handleFulfill = async (purchaseId) => {
    try {
      await fulfillReward(purchaseId);
      // Update the local state
      setPurchases(
        purchases.map(purchase => 
          purchase.id === purchaseId ? { ...purchase, fulfilled: true } : purchase
        )
      );
      // Refresh parent component data if needed
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Error fulfilling reward:", err);
      setError("Failed to mark reward as fulfilled.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.studentCard, 
      item.fulfilled && styles.fulfilledCard
    ]}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.points}>{item.pointsSpent} points</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.info}>
          <FontAwesome5 name="shopping-bag" size={12} color="#555" /> {item.quantity} purchased
        </Text>
        <Text style={styles.info}>
          <AntDesign name="calendar" size={12} color="#555" /> {item.datePurchased}
        </Text>
      </View>
      {!item.fulfilled && (
        <TouchableOpacity 
          style={styles.fulfillButton}
          onPress={() => handleFulfill(item.id)}
        >
          <Text style={styles.buttonText}>Mark as Fulfilled</Text>
        </TouchableOpacity>
      )}
      {item.fulfilled && (
        <View style={styles.fulfilledBadge}>
          <Text style={styles.fulfilledText}>Fulfilled</Text>
        </View>
      )}
    </View>
  );

  return (
    <ReusableModal visible={visible} onClose={onClose} title={`${reward?.rewardName || 'Reward'} - Student Purchases`}>
      <View style={styles.container}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        {loading ? (
          <ActivityIndicator size="large" color="#386641" />
        ) : purchases.length > 0 ? (
          <>
            <Text style={styles.header}>Students Who Purchased</Text>
            <FlatList
              data={purchases}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
            />
          </>
        ) : (
          <Text style={styles.emptyText}>No students have purchased this reward yet.</Text>
        )}
      </View>
    </ReusableModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  studentCard: {
    backgroundColor: "#f1faee",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderColor: "#386641",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fulfilledCard: {
    borderColor: "#6c757d",
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  points: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#386641",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  info: {
    fontSize: 14,
    color: "#555",
  },
  fulfillButton: {
    backgroundColor: "#386641",
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  fulfilledBadge: {
    backgroundColor: "#6c757d",
    padding: 6,
    borderRadius: 4,
    marginTop: 10,
    alignItems: "center",
  },
  fulfilledText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  listContainer: {
    paddingBottom: 20
  },
  errorText: {
    color: "#d62828",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 40,
  }
});

export default ViewRewardModal;