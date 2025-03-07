import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import ConfirmationModal from './modals/confirmationModal';

export default function StudentsRewards() {
    const [modalVisible, setModalVisible] = useState(false);
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

    const [rewards, setRewards] = useState([
        {
            id: "1",
            reward: "Piatos",
            stocks: 10,
            points: 10,
            image: require('../../assets/snacks.png'),
            category: "Snacks",
            description: "A crispy and tasty potato snack for students.",
            professor: "Prof. Smith",
            date: "2025-03-06",
            quantity: 1,
        },
        {
            id: "2",
            reward: "Chuckie",
            stocks: 10,
            points: 20,
            image: require('../../assets/drinks.png'),
            category: "Beverages",
            description: "A delicious chocolate milk drink packed with energy.",
            professor: "Prof. Johnson",
            date: "2025-03-06",
            quantity: 1,
        },

    ]);

    const handleConfirm = async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
        console.log("Cancelled!");
    };

    const updateQuantity = (id, change) => {
        setRewards(rewards.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
        ));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileCard}>
                <Image source={student.image} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileTitle}>{student.name}</Text>
                    <Text style={styles.profileSubtitle}>ID: {student.studentID} | {student.grade}</Text>
                </View>
                <View style={styles.pointsBadge}>
                    <Text style={styles.pointsBadgeTextProfile}>{student.pointsEarned} <AntDesign name="star" size={20} color="#f5cb5c" /></Text>
                </View>
            </View>

            <FlatList
                data={rewards}
                numColumns={1}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.rewardCard}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.rewardTitle}>{item.reward}</Text>
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
                            <Image source={item.image} style={styles.rewardImage} />
                            <View style={styles.rewardDetails}>
                                <Text style={styles.rewardDescription}>{item.description}</Text>
                                <Text style={styles.profileSubtitle}>By: {item.professor}</Text>
                                <Text style={styles.profileSubtitle}>Date: {item.date}</Text>
                            </View>
                        </View>

                        <View style={styles.rewardFooter}>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, -1)}>
                                    <AntDesign name="minus" size={20} color="white" />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{item.quantity}</Text>
                                <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 1)}>
                                    <AntDesign name="plus" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.buyButton} onPress={() => setModalVisible(true)}>
                                <Text style={styles.buyButtonText}>Buy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <ConfirmationModal
                visible={modalVisible}
                title="Confirm Purchase"
                message="Are you sure you want to buy this item?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
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
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
