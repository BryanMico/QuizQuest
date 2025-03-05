import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, Image, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import QuestImg from "../../assets/quest.png";
import mathImage from '../../assets/math.png';

export default function StudentsQuest() {
    const subject = { 
        id: '1', name: 'Mathematics', teacher: 'Mr. Smith', students: 25, image: mathImage 
    };

    const [quests, setQuests] = useState([
        { id: "1", quest: "Complete 5 quizzes", type: "complete_quizzes", requirement: 5, progress: 2, points: "100", image: QuestImg, claimed: false },
        { id: "2", quest: "Score 80% on a quiz", type: "score_percentage", requirement: 80, progress: 75, points: "200", image: QuestImg, claimed: false },
        { id: "3", quest: "Earn 500 total points", type: "total_points", requirement: 500, progress: 499, points: "500", image: QuestImg, claimed: false }
    ]);

    const claimQuest = (id) => {
        setQuests(prevQuests =>
            prevQuests.map(quest =>
                quest.id === id ? { ...quest, claimed: true } : quest
            )
        );
    };

    const incrementProgress = (id) => {
        setQuests(prevQuests =>
            prevQuests.map(quest =>
                quest.id === id && !quest.claimed
                    ? { ...quest, progress: Math.min(quest.progress + 1, quest.requirement) }
                    : quest
            )
        );
    };

    return (            
        <SafeAreaView style={styles.container}>
            <View style={styles.subjectCard}>
                <Image source={subject.image} style={styles.subjectImage} />
                <View style={styles.subjectInfo}>
                    <Text style={styles.subjectTitle}>{subject.name}</Text>
                    <Text style={styles.subjectSubtitle}>Teacher: {subject.teacher}</Text>
                    <Text style={styles.subjectSubtitle}>Students: {subject.students}</Text>
                </View>
            </View>

            <View style={styles.questSection}>
                <Text style={styles.sectionTitle}>Available Quests</Text>
                <FlatList
                    data={quests}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.questCard}>
                            <Image source={item.image} style={styles.questImage} />
                            <View style={styles.questInfo}>
                                <Text style={styles.questTitle}>{item.quest}</Text>
                                <Text style={styles.questDetails}>Requirement: {item.requirement}</Text>
                                <Text style={styles.questDetails}>Progress: {item.progress} / {item.requirement}</Text>
                                <View style={styles.progressBarContainer}>
                                    <View style={[styles.progressBar, { width: `${(item.progress / item.requirement) * 100}%` }]} />
                                </View>
                            </View>
                            {item.claimed ? (
                                <Text style={styles.claimedText}>Claimed</Text>
                            ) : item.progress >= item.requirement ? (
                                <TouchableOpacity style={styles.claimButton} onPress={() => claimQuest(item.id)}>
                                    <Text style={styles.claimButtonText}>Claim</Text>
                                    <AntDesign name="star" size={20} color="#f5cb5c" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.progressButton} onPress={() => incrementProgress(item.id)}>
                                    <MaterialCommunityIcons name="progress-check" size={20} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#a7c957',
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
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f2e8cf',
        backgroundColor: "#6a994e",
        padding: 5,
        borderTopWidth: 1,       
        borderLeftWidth: 1,      
        borderRightWidth: 1,     
        borderColor: "#386641",   
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
    progressButton: {
        backgroundColor: '#386641',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    claimedText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#386641',
    },
});

