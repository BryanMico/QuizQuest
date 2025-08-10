import React, { useEffect, useState } from "react"; 
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getTeacherStudentsPurchasedRewards, fulfillReward } from "../../../../services/rewardService";

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
        purchase => purchase.rewardId && purchase.rewardId._id === reward._id
      );
      
      // Group purchases by student
      const purchasesByStudent = {};
      
      rewardPurchases.forEach(purchase => {
        const studentId = purchase.studentId?._id || "unknown";
        
        if (!purchasesByStudent[studentId]) {
          purchasesByStudent[studentId] = {
            id: studentId,
            name: purchase.studentId?.name || "Unknown Student",
            studentId: studentId,
            totalPointsSpent: 0,
            quantity: 0,
            purchases: [],
            latestPurchaseDate: null,
            allFulfilled: true
          };
        }
        
        // Add this purchase to the student's record
        purchasesByStudent[studentId].purchases.push({
          id: purchase._id,
          pointsCost: purchase.pointsCost,
          datePurchased: new Date(purchase.createdAt),
          fulfilled: purchase.fulfilled
        });
        
        // Update total points spent
        purchasesByStudent[studentId].totalPointsSpent += purchase.pointsCost;
        
        // Increment quantity
        purchasesByStudent[studentId].quantity += 1;
        
        // Update latest purchase date
        const purchaseDate = new Date(purchase.createdAt);
        if (!purchasesByStudent[studentId].latestPurchaseDate || 
            purchaseDate > purchasesByStudent[studentId].latestPurchaseDate) {
          purchasesByStudent[studentId].latestPurchaseDate = purchaseDate;
        }
        
        // Check if all purchases are fulfilled
        if (!purchase.fulfilled) {
          purchasesByStudent[studentId].allFulfilled = false;
        }
      });
      
      // Convert to array and format dates
      const formattedPurchases = Object.values(purchasesByStudent).map(student => ({
        ...student,
        latestPurchaseDate: student.latestPurchaseDate ? 
          student.latestPurchaseDate.toLocaleDateString() : 'Unknown date'
      }));
      
      setPurchases(formattedPurchases);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setError("Failed to load student purchases.");
    } finally {
      setLoading(false);
    }
  };

  const handleFulfillAll = async (studentData) => {
    try {
      console.log("Attempting to fulfill and delete purchases for student:", studentData.name);
      
      // Get unfulfilled purchases for this student
      const unfulfilledPurchases = studentData.purchases.filter(p => !p.fulfilled);
      
      // Create an array of promises for fulfilling each purchase
      const fulfillPromises = unfulfilledPurchases.map(purchase => 
        fulfillReward(purchase.id)
      );
      
      // Wait for all fulfillment operations to complete
      await Promise.all(fulfillPromises);
      
      // After fulfillment (which now includes deletion), remove this student from the purchases list
      // if they have no remaining unfulfilled purchases
      setPurchases(purchases.filter(student => student.id !== studentData.id));
      
      // Refresh parent component data if needed
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Error fulfilling and deleting rewards:", err);
      setError("Failed to mark rewards as fulfilled and delete them.");
    }
  };
  const renderItem = ({ item }) => (
    <View style={[
      styles.studentCard, 
      item.allFulfilled && styles.fulfilledCard
    ]}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.points}>{item.totalPointsSpent} points</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.info}>
          <FontAwesome5 name="shopping-bag" size={12} color="#555" /> <Text>{item.quantity} purchased</Text>
        </Text>
        <Text style={styles.info}>
          <AntDesign name="calendar" size={12} color="#555" /> <Text>Last: {item.latestPurchaseDate}</Text>
        </Text>
      </View>
      {!item.allFulfilled && (
        <TouchableOpacity 
          style={styles.fulfillButton}
          onPress={() => {
            console.log("Button pressed for student:", item.id);
            handleFulfillAll(item);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Mark All as Fulfilled</Text>
        </TouchableOpacity>
      )}
      {item.allFulfilled && (
        <View style={styles.fulfilledBadge}>
          <Text style={styles.fulfilledText}>All Fulfilled</Text>
        </View>
      )}
    </View>
  );

  return (
    <ReusableModal visible={visible} onClose={onClose} title={`${reward?.rewardName || 'Reward'} - Student Purchases`}>
      <View style={styles.container}>        
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
    width: '100%',
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
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
    minHeight: 44,
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