import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';


export default function StudentsRewards() {
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

    return(           
        <SafeAreaView style={styles.container}>
            <View style={styles.profileCard}>
                <Image source={student.image} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileTitle}>{student.name}</Text>
                    <Text style={styles.profileSubtitle}>ID: {student.studentID} | {student.grade}</Text>
                </View>
                
                {/* Points Earned Badge */}
                <View style={styles.pointsBadge}>
                    <Text style={styles.pointsBadgeText}>{student.pointsEarned} <AntDesign name="star" size={24} color="#f5cb5c" /></Text>
                </View>
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
    profileCard: {
        flexDirection: 'row',
        backgroundColor: '#f2e8cf',
        padding: 15,
        borderRadius: 10,
        marginBottom: 7,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
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
    pointsBadge: {
        backgroundColor: '#6a994e',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        position: 'absolute',
        right: 10,
        top: 10,
    },
    pointsBadgeText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#f2e8cf',
    },
});
