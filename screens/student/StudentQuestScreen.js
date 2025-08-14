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
                    <View style={styles.headerRow}>
                    <TouchableOpacity 
                        style={styles.refreshButton}
                        onPress={updateQuestProgress}
                    >
                        <AntDesign name="reload1" size={20} color="#f2e8cf" />
                    </TouchableOpacity>
                </View>
                
            </View>

            <View style={styles.questSection}>
                <Text style={styles.sectionTitle}>Available Quests</Text>
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
    padding: 15,
    backgroundColor: '#27AE60', // Green background to match Admin
  },

  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },

  errorText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },

  retryButton: {
    backgroundColor: '#000000', // Black pill button like Admin
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: 'center',
    width: 300,
    alignSelf: 'center',
  },

  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#27AE60',
    borderRadius: 10,
    marginTop: 20,
  },

  emptyStateText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },

  subjectCard: {
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

  subjectImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 15,
  },

  subjectInfo: {
    flex: 1,
  },

  subjectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },

  subjectSubtitle: {
    fontSize: 14,
    color: '#555',
  },

  questSection: {
    marginTop: 15,
    flex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft:5,
  },

  refreshButton: {
    padding: 8,
    backgroundColor: '#FFD83D', // Yellow accent
    borderRadius: 999,
  },

  questCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
    width: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    width: '95%',       // wider than normal cards
    alignSelf: 'center',
  },

  questImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 15,
  },

  questInfo: {
    flex: 1,
  },

  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },

  questDetails: {
    fontSize: 14,
    color: '#555',
  },

  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 999,
    marginTop: 5,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#27AE60', // Green progress
  },

  claimButton: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  claimButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginHorizontal: 5,
  },

  claimedBadge: {
    backgroundColor: '#27AE60',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  claimedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  pointsBadge: {
    backgroundColor: '#FFD83D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },

  pointsLabel: {
    fontSize: 12,
    color: '#000000',
  },
});