import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from "@expo/vector-icons";
import ReusableModal from "../../../components/ModalScreen";
import ErrorModal from "../../../components/ErrorModal";
import LoadingScreen from "../../../components/LoadingScreen";
import { getStudentInfo } from "../../../../services/studentService";
import { getTeacherInfo } from "../../../../services/teacherService";
import { getQuizzesStatus } from "../../../../services/quizService";

export default function ViewStudentModal({ visible, onClose, student }) {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState({});
  const [completedQuizzes, setCompletedQuizzes] = useState([]);

  useEffect(() => {
    const fetchTeacherAndQuizzes = async () => {
      try {
        setLoading(true);

        // Use the student prop directly instead of fetching it again
        if (!student || !student._id) {
          setErrorMessage('Invalid student data.');
          setErrorVisible(true);
          return;
        }

        const studentId = student._id.toString();
        const teacherId = student.teacherId;

        if (!teacherId) {
          setErrorMessage('Teacher ID not found in student info.');
          setErrorVisible(true);
          return;
        }

        const teacherData = await getTeacherInfo(teacherId);
        const teacherQuizzesCompleted = await getQuizzesStatus('Completed', teacherId, studentId);

        setTeacher(teacherData);
        setCompletedQuizzes(teacherQuizzesCompleted);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to fetch data.');
        setErrorVisible(true);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchTeacherAndQuizzes();
    }
  }, [visible, student]);


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
  
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  return (
    <ReusableModal visible={visible} onClose={onClose} title="Student Details">
      {loading && <LoadingScreen />}

      <ErrorModal
        visible={errorVisible}
        title="Student Loading Data Failed"
        message={errorMessage}
        onTryAgain={() => {
          setErrorVisible(false);
        }}
        onCancel={() => setErrorVisible(false)}
      />

      <View style={styles.infoContainer}>
        <View style={styles.column}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{`${student?.name || ""}`}</Text>

          <Text style={styles.label}>Student ID</Text>
          <Text style={styles.value}>{`${student?.studentID || ""}`}</Text>

          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{`${student?.username || ""}`}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Points Earned</Text>
          <Text style={styles.value}>{`${student?.pointsEarned || 0}`}</Text>

          <Text style={styles.label}>Points Spent</Text>
          <Text style={styles.value}>{`${student?.pointsSpent || 0}`}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quizzes Taken</Text>
      <FlatList
        data={completedQuizzes}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.quizItem}>
            <View style={styles.quizHeader}>
              <Text style={styles.quizTitle}>{item.title}</Text>
              <Text style={styles.accumulatedPoints}>
                +{item.studentAnswers.find(sa => sa.studentId.toString() === student._id.toString())?.totalScore || 0}
                <AntDesign name="star" size={24} color="#f5cb5c" />
              </Text>
            </View>
            <Text style={styles.quizDate}>
              Date: {formatDate(item.studentAnswers.find(sa => sa.studentId.toString() === student._id.toString())?.answeredAt || '')}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            No quizzes available. The student has not taken a quiz yet or data failed to load.
          </Text>
        }
      />

    </ReusableModal>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    width: "48%",
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  quizItem: {
    backgroundColor: "#f1faee",
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
    borderLeftWidth: 4,
    borderColor: "#386641",
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quizTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  quizPoints: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#386641",
  },
  quizDate: {
    fontSize: 12,
    color: "#555",
  },
});
