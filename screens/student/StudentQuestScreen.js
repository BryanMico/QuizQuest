import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import QuestImg from "../../assets/quest.png";
import { getActiveQuestsForStudent, completeQuest, getStudentQuestProgress } from '../../services/questService';
import { getStudentInfo } from '../../services/studentService';
import { getTeacherInfo } from '../../services/teacherService';

export default function StudentsQuest() {
    const route = useRoute();
    const [student, setStudent] = useState({});
    const [teacher, setTeacher] = useState({});
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);

    useEffect(() => {
        fetchStudentQuests();
    }, []);

    const fetchStudentQuests = async () => {
        try {
            setLoading(true);
            setError(null); // Reset error state
            
            // Get studentId from route or AsyncStorage
            const studentId = route.params?.studentId || await AsyncStorage.getItem('studentId');
    
            if (!studentId) {
                throw new Error('Student ID not found');
            }
    
            const studentInfo = await getStudentInfo(studentId);
            if (!studentInfo) {
                throw new Error('Failed to fetch student information');
            }
            
            setStudent(studentInfo);
            const teacherId = studentInfo.teacherId;
            
            if (!teacherId) {
                throw new Error('Teacher ID not found in student info');
            }
    
            const teacherData = await getTeacherInfo(teacherId);
            setTeacher(teacherData);
    
            // Get quest progress data
            const progressResponse = await getStudentQuestProgress(studentId);
            
            if (!progressResponse.success) {
                throw new Error(progressResponse.message || 'Failed to fetch quest progress');
            }
            
            // Format quests with progress information
            const formattedQuests = progressResponse.data.questProgress.map(quest => {
                // Calculate the visual progress value (ensure it doesn't exceed requirement)
                const progressValue = Math.min(
                    quest.targetValue, 
                    Math.round((quest.progress / 100) * quest.targetValue)
                );
                
                return {
                    id: quest.questId,
                    quest: quest.title,
                    type: quest.questType,
                    requirement: quest.targetValue,
                    progress: progressValue,
                    points: quest.points.toString(),
                    image: QuestImg,
                    claimed: quest.isCompleted
                };
            });
    
            setQuests(formattedQuests);
        } catch (error) {
            console.error('Error in fetchStudentQuests:', error);
            setError(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const claimQuest = async (id) => {
        try {
            setLoading(true);
            const studentId = route.params?.studentId || await AsyncStorage.getItem('studentId');
            
            if (!studentId) {
                throw new Error('Student ID not found');
            }
            
            const response = await completeQuest(id, studentId);
            
            if (response.success) {
                // Update local state immediately without refetching
                setQuests(prevQuests => prevQuests.map(quest => 
                    quest.id === id 
                    ? {...quest, claimed: true, progress: quest.requirement} 
                    : quest
                ));
                
                // Also update student points if available in response
                if (response.data?.totalPoints) {
                    setStudent(prev => ({...prev, points: response.data.totalPoints}));
                }
                
                Alert.alert('Success!', response.message);
            } else {
                Alert.alert('Error', response.message || 'Failed to claim quest');
            }
        } catch (error) {
            console.error('Error claiming quest:', error);
            Alert.alert('Error', error.message || 'Failed to claim quest');
        } finally {
            setLoading(false);
        }
    };

    const updateQuestProgress = async () => {
        // This function refreshes the quest progress data
        try {
            setLoading(true);
            const studentId = route.params?.studentId || await AsyncStorage.getItem('studentId');
            
            if (!studentId) {
                throw new Error('Student ID not found');
            }
            
            const progressResponse = await getStudentQuestProgress(studentId);
            
            if (progressResponse.success) {
                // Format quests with progress information
                const formattedQuests = progressResponse.data.questProgress.map(quest => {
                    // Calculate the visual progress value (ensure it doesn't exceed requirement)
                    const progressValue = Math.min(
                        quest.targetValue, 
                        Math.round((quest.progress / 100) * quest.targetValue)
                    );
                    
                    return {
                        id: quest.questId,
                        quest: quest.title,
                        type: quest.questType,
                        requirement: quest.targetValue,
                        progress: progressValue,
                        points: quest.points.toString(),
                        image: QuestImg,
                        claimed: quest.isCompleted
                    };
                });

                setQuests(formattedQuests);
                Alert.alert('Success', 'Progress updated successfully');
            } else {
                throw new Error(progressResponse.message || 'Failed to update quest progress');
            }
        } catch (error) {
            console.error('Error updating quest progress:', error);
            Alert.alert('Error', error.message || 'Failed to update progress');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#386641" />
                <Text style={styles.loadingText}>Loading quests...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchStudentQuests}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subjectCard}>
                <Image source={require('../../assets/books.png')} style={styles.subjectImage} />
                <View style={styles.subjectInfo}>
                    <Text style={styles.subjectTitle}>{student.name}</Text>
                    <Text style={styles.subjectSubtitle}>Teacher: {teacher.name}</Text>
                    <Text style={styles.subjectSubtitle}>Subject: {teacher.subject}</Text>
                    <Text style={styles.subjectSubtitle}>Points: {student.points || 0}</Text>
                </View>
            </View>

            <View style={styles.questSection}>
                <View style={styles.headerRow}>
                    <Text style={styles.sectionTitle}>Available Quests</Text>
                    <TouchableOpacity 
                        style={styles.refreshButton}
                        onPress={updateQuestProgress}
                    >
                        <AntDesign name="reload1" size={20} color="#f2e8cf" />
                    </TouchableOpacity>
                </View>
                
                {quests.length === 0 ? (
                    <View style={styles.emptyStateContainer}>
                        <Text style={styles.emptyStateText}>No quests available right now.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={quests}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.questCard}>
                                <Image source={item.image} style={styles.questImage} />
                                <View style={styles.questInfo}>
                                    <Text style={styles.questTitle}>{item.quest}</Text>
                                    <Text style={styles.questDetails}>Type: {item.type.replace(/_/g, ' ')}</Text>
                                    <Text style={styles.questDetails}>Requirement: {item.requirement}</Text>
                                    <Text style={styles.questDetails}>Progress: {item.progress} / {item.requirement}</Text>
                                    <View style={styles.progressBarContainer}>
                                        <View style={[styles.progressBar, { width: `${(item.progress / item.requirement) * 100}%` }]} />
                                    </View>
                                </View>
                                {item.claimed ? (
                                    <View style={styles.claimedBadge}>
                                        <Text style={styles.claimedText}>Claimed</Text>
                                    </View>
                                ) : item.progress >= item.requirement ? (
                                    <TouchableOpacity style={styles.claimButton} onPress={() => claimQuest(item.id)}>
                                        <Text style={styles.claimButtonText}>Claim</Text>
                                        <AntDesign name="star" size={20} color="#f5cb5c" />
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.pointsBadge}>
                                        <Text style={styles.pointsText}>{item.points}</Text>
                                        <Text style={styles.pointsLabel}>pts</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: '#a7c957',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#386641',
    },
    errorText: {
        fontSize: 16,
        color: '#bc4749',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#386641',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyStateContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f2e8cf',
        borderRadius: 10,
        marginTop: 20,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#6a994e',
        textAlign: 'center',
    },
    subjectCard: {
        flexDirection: 'row',
        backgroundColor: '#f2e8cf',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    subjectImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
    },
    subjectInfo: {
        flex: 1,
    },
    subjectTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#386641',
    },
    subjectSubtitle: {
        fontSize: 14,
        color: '#6a994e',
    },
    questSection: {
        marginTop: 15,
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#6a994e",
        padding: 5,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#386641",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f2e8cf',
    },
    refreshButton: {
        padding: 5,
    },
    questCard: {
        flexDirection: 'row',
        backgroundColor: '#fefae0',
        padding: 10,
        marginBottom: 7,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#386641",
    },
    questImage: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginRight: 10,
    },
    questInfo: {
        flex: 1,
    },
    questTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#386641',
    },
    questDetails: {
        fontSize: 14,
        color: '#6a994e',
    },
    progressBarContainer: {
        width: '100%',
        height: 8,
        backgroundColor: '#ccc',
        borderRadius: 5,
        marginTop: 5,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#6a994e',
    },
    claimButton: {
        flexDirection: 'row',
        backgroundColor: '#386641',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    claimButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
        marginRight: 5
    },
    claimedBadge: {
        backgroundColor: '#f5cb5c',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    claimedText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#386641',
    },
    pointsBadge: {
        backgroundColor: '#6a994e',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pointsText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    pointsLabel: {
        fontSize: 12,
        color: 'white',
    },
});