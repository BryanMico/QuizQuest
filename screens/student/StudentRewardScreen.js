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
                    quantity: 1, // Initialize quantity to 1
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

    useEffect(() => {
        fetchData();
    }, []);

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
            
            // Check if student has enough points
            const totalCost = selectedReward.points * selectedReward.quantity;
            if (student.points < totalCost) {
                setErrorMessage(`You don't have enough points. You need ${totalCost} points but only have ${student.points}.`);
                setErrorVisible(true);
                setModalVisible(false);
                return;
            }
            
            // Make API call to buy reward
            // For multiple quantity, we make multiple API calls
            const purchasePromises = [];
            for (let i = 0; i < selectedReward.quantity; i++) {
                purchasePromises.push(buyReward(studentId, selectedReward._id));
            }
            
            const results = await Promise.all(purchasePromises);
            
            // Update student points and refresh data
            const updatedStudentInfo = await getStudentInfo(studentId);
            setStudent(updatedStudentInfo);
            
            // Show success message
            setSuccessMessage(`Successfully purchased ${selectedReward.quantity} ${selectedReward.rewardName}!`);
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

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileCard}>
                <Image source={require('../../assets/student.png')} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileTitle}>{student.name}</Text>
                    <Text style={styles.profileSubtitle}>ID: {student.studentID} | {teacher.subject} {student.role}</Text>
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
                numColumns={1}
                keyExtractor={(item, index) => (item?._id || item?.id || index).toString()}
                renderItem={({ item }) => (
                    <View style={styles.rewardCard}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.rewardTitle}>{item.rewardName}</Text>
                            <View style={styles.badgeContainer}>
                                <View style={styles.stockBadge}>
                                    <Text style={styles.stockBadgeText}>Stock: {item.stocks}</Text>
                                </View>
                                <View style={styles.pointsBadge}>
                                    <Text style={styles.pointsBadgeText}>{item.points}  <AntDesign name="star" size={14} color="#f5cb5c" /></Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.rewardContent}>
                            <Image source={item.imageObject} style={styles.rewardImage} />
                            <View style={styles.rewardDetails}>
                                <Text style={styles.rewardDescription}>{item.description}</Text>
                                <Text style={styles.profileSubtitle}>By: {item.createdBy?.name || item.createdBy || 'Unknown'}</Text>
                                <Text style={styles.profileSubtitle}>Date: {item.formattedDate}</Text>
                            </View>
                        </View>

                        <View style={styles.rewardFooter}>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => updateQuantity(item._id || item.id, -1)}
                                    disabled={item.quantity <= 1}
                                >
                                    <AntDesign name="minus" size={20} color="white" />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{item.quantity || 1}</Text>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => updateQuantity(item._id || item.id, 1)}
                                    disabled={item.quantity >= item.stocks}
                                >
                                    <AntDesign name="plus" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.buyButton, 
                                    (!item.stocks || item.stocks <= 0 || student.points < item.points * item.quantity) && styles.disabledButton
                                ]}
                                onPress={() => handleBuyPress(item)}
                                disabled={!item.stocks || item.stocks <= 0 || student.points < item.points * item.quantity}
                            >
                                <Text style={styles.buyButtonText}>
                                    {student.points < item.points * item.quantity ? 'Not enough points' : 'Buy'}
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
                        <Text>Are you sure you want to buy <Text style={{ fontWeight: 'bold', color: '#386641' }}>{selectedReward.quantity} {selectedReward.rewardName}</Text>?</Text>
                        <Text style={{ marginTop: 10 }}>
                            Cost: <Text style={{ fontWeight: 'bold', color: '#6a994e' }}>{selectedReward.points * selectedReward.quantity} points</Text>
                        </Text>
                        <Text>
                            Your balance after purchase: <Text style={{ fontWeight: 'bold', color: '#386641' }}>{student.points - (selectedReward.points * selectedReward.quantity)} points</Text>
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
        padding: 5,
        backgroundColor: '#a7c957',
    },
    profileCard: {
        flexDirection: 'row',
        backgroundColor: '#f2e8cf',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        shadowOpacity: 0.1,
        elevation: 3,
        position: 'relative',
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
    pointsBadgeTextProfile: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
    },
    pointsBadgeText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#fff',
    },
    rewardCard: {
        backgroundColor: '#f2e8cf',
        padding: 10,
        margin: 5,
        borderRadius: 10,
        shadowOpacity: 0.1,
        elevation: 3,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#dde5b6',
        padding: 8,
        borderRadius: 10,
        marginBottom: 5,
    },
    rewardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#386641'
    },
    badgeContainer: {
        flexDirection: 'row',
    },
    stockBadge: {
        backgroundColor: '#d9534f',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginRight: 5
    },
    stockBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    pointsBadge: {
        backgroundColor: '#6a994e',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    rewardContent: {
        flexDirection: 'row',
    },
    rewardImage: {
        width: 80,
        height: 80,
        marginRight: 10,
    },
    rewardDetails: {
        flex: 1,
    },
    rewardDescription: {
        fontSize: 12,
        color: '#555',
    },
    rewardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6a994e',
        borderRadius: 20,
        padding: 3,
    },
    quantityButton: {
        backgroundColor: '#386641',
        padding: 5,
        borderRadius: 50,
        marginHorizontal: 5,
    },
    quantityText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#fff',
        marginHorizontal: 10,
    },
    buyButton: {
        backgroundColor: '#6a994e',
        padding: 10,
        borderRadius: 5,
        minWidth: 120,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
        opacity: 0.7,
    },
    buyButtonText: {
        color: '#fff',
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
        color: '#386641',
        textAlign: 'center',
    },
    successMessage: {
        backgroundColor: '#386641',
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