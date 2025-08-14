import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, FlatList, View, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import ConfirmationModal from './modals/confirmationModal';
import snackImg from "../../assets/snacks.png";
import beverageImg from "../../assets/drinks.png";
import fruitImg from "../../assets/fruit.png";
import toysImg from "../../assets/toys.png";
import LoadingScreen from '../components/LoadingScreen';
import ErrorModal from '../components/ErrorModal';
import { getStudentInfo } from "../../services/studentService";
import { getAllRewards, buyReward, getStudentPurchasedRewards } from "../../services/rewardService";
import { getTeacherInfo } from "../../services/teacherService";

export default function StudentsRewards() {
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [student, setStudent] = useState({});
    const [teacher, setTeacher] = useState({});
    const [rewards, setRewards] = useState([]);
    const [selectedReward, setSelectedReward] = useState(null);
    const [purchasedRewards, setPurchasedRewards] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);

    const getImageFromReference = (imageRef, category) => {
        // First try to use the image reference
        if (imageRef) {
            // Check the image reference string and return the corresponding image
            if (imageRef.includes("snack") || imageRef === "Snacks") return snackImg;
            if (imageRef.includes("drink") || imageRef.includes("beverage") || imageRef === "Beverages") return beverageImg;
            if (imageRef.includes("fruit") || imageRef === "Fruits") return fruitImg;
            if (imageRef.includes("toy") || imageRef === "Toys") return toysImg;
        }

        // Fallback to category if no image reference or unknown format
        if (category) {
            if (category === "Snacks") return snackImg;
            if (category === "Beverages") return beverageImg;
            if (category === "Fruits") return fruitImg;
            if (category === "Toys") return toysImg;
        }

        // Default image if nothing matches
        return snackImg;
    };

    // Format date from timestamp
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    };

    const fetchData = async () => {
        try {
            setLoading(true);

            const studentId = await AsyncStorage.getItem('studentId');
            if (!studentId) {
                setErrorMessage('Student ID not found.');
                setErrorVisible(true);
                return;
            }

            // Fetch student info
            const studentInfo = await getStudentInfo(studentId);
            setStudent(studentInfo);

            // Extract teacherId from studentInfo
            const teacherId = studentInfo.teacherId;
            if (!teacherId) {
                setErrorMessage('Teacher ID not found in student info.');
                setErrorVisible(true);
                return;
            }
            const teacherData = await getTeacherInfo(teacherId);
            setTeacher(teacherData);

            // Fetch Rewards
            const data = await getAllRewards(teacherId);

            // Just set rewards to empty array if no data returned
            // No error modal needed for this case
            if (!data || data.length === 0) {
                setRewards([]);
                setLoading(false);
                return;
            }

            const rewardData = data.map((reward) => {
                return {
                    ...reward,
                    imageObject: getImageFromReference(reward.image, reward.category),
                    reward: reward.rewardName || reward.reward,
                    formattedDate: formatDate(reward.createdAt) // Format the timestamp
                };
            });

            setRewards(rewardData);

            // Fetch student's purchased rewards
            const purchasedData = await getStudentPurchasedRewards(studentId);
            setPurchasedRewards(purchasedData || []);

        } catch (error) {
            setErrorMessage(error.message || 'Failed to fetch data.');
            setErrorVisible(true);
        } finally {
            setLoading(false);
        }
    };



    const handleConfirm = async () => {
        if (!selectedReward) return;
        
        try {
            setPurchaseLoading(true);
            
            const studentId = await AsyncStorage.getItem('studentId');
            if (!studentId) {
                setErrorMessage('Student ID not found.');
                setErrorVisible(true);
                setModalVisible(false);
                return;
            }
                if (hasPurchasedReward(selectedReward._id)) {
                setErrorMessage('You already purchased this reward.');
                setErrorVisible(true);
                setModalVisible(false);
                return;
            }
            // Check if student has enough points for the total purchase
            const totalCost = selectedReward.points;
            if (student.points < totalCost) {
                setErrorMessage(`You don't have enough points. You need ${totalCost} points but only have ${student.points}.`);
                setErrorVisible(true);
                setModalVisible(false);
                return;
            }
            
            // Single API call with quantity parameter
            await buyReward(studentId, selectedReward._id, 1);
            
            // Update student points and refresh data
            const updatedStudentInfo = await getStudentInfo(studentId);
            setStudent(updatedStudentInfo);
            
            // Show success message
            setSuccessMessage(`Successfully purchased ${selectedReward.rewardName}!`);
            setShowSuccessMessage(true);
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
            
            // Refresh rewards to update stock count
            await fetchData();
            
        } catch (error) {
            setErrorMessage(error.message || 'Failed to purchase reward.');
            setErrorVisible(true);
        } finally {
            setPurchaseLoading(false);
            setModalVisible(false);
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const updateQuantity = (id, change) => {
        setRewards(rewards.map(item => {
            if (item._id === id || item.id === id) {
                // Get the current quantity and the max stock available
                const currentQuantity = item.quantity || 1;
                const maxStock = item.stocks || 1;

                // Calculate new quantity, but don't go below 1 or above the available stock
                const newQuantity = Math.min(Math.max(1, currentQuantity + change), maxStock);

                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const handleBuyPress = (item) => {
        // Check if student has enough points before showing modal
        const totalCost = item.points * item.quantity;
        if (student.points < totalCost) {
            setErrorMessage(`You don't have enough points. You need ${totalCost} points but only have ${student.points}.`);
            setErrorVisible(true);
            return;
        }

        setSelectedReward(item);
        setModalVisible(true);
    };

    const hasPurchasedReward = (rewardId) => {
        return purchasedRewards.some((p) => {
            const purchasedId = p.rewardId?._id || p.rewardId; // safely get rewardId reference
            return purchasedId?.toString() === rewardId?.toString();
        });
    };




    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileCard}>
                <Image source={require('../../assets/student.png')} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileTitle}>{student.name}</Text>
                    <Text style={styles.profileSubtitles}>ID: {student.studentID} | {teacher.subject} {student.role}</Text>
                </View>
                <View style={styles.pointsBadge}>
                    <Text style={styles.pointsBadgeTextProfile}>{student.points} <AntDesign name="star" size={20} color="#f5cb5c" /></Text>
                </View>
            </View>

            {showSuccessMessage && (
                <View style={styles.successMessage}>
                    <AntDesign name="checkcircle" size={20} color="#fff" />
                    <Text style={styles.successMessageText}>{successMessage}</Text>
                </View>
            )}

            <FlatList
                data={rewards}
                keyExtractor={(item, index) => (item?._id || item?.id || index).toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.rewardCard}>
                        {/* Title & badges */}
                        <View style={styles.titleContainer}>
                            <Text style={styles.rewardTitle}>{item.rewardName}</Text>
                            <View style={styles.badgeContainer}>
                                <View style={styles.stockBadge}>
                                    <Text style={styles.stockBadgeText}>Stock: {item.stocks}</Text>
                                </View>
                                <View style={styles.pointsBadge}>
                                    <Text style={styles.pointsBadgeText}>
                                        {item.points} <AntDesign name="star" size={14} color="#f5cb5c" />
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Image & details */}
                        <View style={styles.rewardContent}>
                            <Image source={item.imageObject} style={styles.rewardImage} />
                            <View style={styles.rewardDetails}>
                                <Text style={styles.rewardDescription}>{item.description}</Text>
                                <Text style={styles.profileSubtitle}>By: {item.createdBy?.name || 'Unknown'}</Text>
                                <Text style={styles.profileSubtitle}>Date: {item.formattedDate}</Text>
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.rewardFooter}>
                            <View style={styles.quantityContainer}>
                                <Text style={styles.quantityText}>Qty: 1</Text>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.buyButton,
                                    (!item.stocks || item.stocks <= 0 || student.points < item.points || hasPurchasedReward(item._id)) && styles.disabledButton
                                ]}
                                onPress={() => handleBuyPress(item)}
                                disabled={!item.stocks || item.stocks <= 0 || student.points < item.points || hasPurchasedReward(item._id)}
                            >
                                <Text style={styles.buyButtonText}>
                                    {hasPurchasedReward(item._id)
                                        ? 'Already Purchased'
                                        : student.points < item.points
                                        ? 'Not enough points'
                                        : 'Buy'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No rewards available</Text>
                    </View>
                }
            />
            <ConfirmationModal
                visible={modalVisible}
                title="Confirm Purchase"
                message={selectedReward ?
                    <View>
                        <Text>Are you sure you want to buy <Text style={{ fontWeight: 'bold', color: '#386641' }}>{selectedReward.rewardName}</Text>?</Text>
                    <Text>
                        Cost: <Text style={{ fontWeight: 'bold', color: '#6a994e' }}>
                            {selectedReward.points} points
                        </Text>
                    </Text>
                    <Text>
                        Your balance after purchase: <Text style={{ fontWeight: 'bold', color: '#386641' }}>
                            {student.points - selectedReward.points} points
                        </Text>
                    </Text>
                    </View> :
                    "Are you sure you want to buy this item?"}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                loading={purchaseLoading}
            />
            <ErrorModal
                visible={errorVisible}
                message={errorMessage}
                onCancel={() => setErrorVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#27AE60', // admin theme green
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    width: '95%',           // responsive width
    maxWidth: 1450,         // limit for big screens
    alignSelf: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  profileSubtitles: {
    fontSize: 14,
    color: '#555',
  },
  pointsBadge: {
    backgroundColor: '#000000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    elevation: 4,
  },
  pointsBadgeTextProfile: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Rewards card
rewardCard: {
    flexDirection: 'column',  // stack sections vertically
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    width: '95%', // make responsive
    alignSelf: 'center',
},

titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap', // allows wrapping on smaller screens
},

rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flexShrink: 1, // prevents overflow
},

badgeContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
},

stockBadge: {
    backgroundColor: '#FFD83D',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
},

stockBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
},

rewardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap', // image and details wrap on small screens
},

rewardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
},

rewardDetails: {
    flex: 1,
    minWidth: 150,
},

rewardDescription: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
},

profileSubtitle: {
    fontSize: 12,
    color: '#777',
},

rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
},

quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
},

quantityText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
},

buyButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: 'center',
},

disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
},

buyButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
},

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
  successMessage: {
    backgroundColor: '#27AE60',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  successMessageText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
