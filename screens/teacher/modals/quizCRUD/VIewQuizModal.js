import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import AntDesign from '@expo/vector-icons/AntDesign';
import LoadingScreen from "../../../components/LoadingScreen";
import ErrorModal from "../../../components/ErrorModal";
import { getQuizCompletions } from "../../../../services/quizService";

const QuizViewModal = ({ visible, onClose, quiz }) => {
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedStudents, setCompletedStudents] = useState([]);

  useEffect(() => {
    const fetchStudentsWhoCompletedQuiz = async () => {
      if (!quiz || !quiz._id) return;
      
      try {
        setLoading(true);
        const studentsData = await getQuizCompletions(quiz._id);
        setCompletedStudents(studentsData);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to fetch quiz completion data.');
        setErrorVisible(true);
      } finally {
        setLoading(false);
      }
    };

    if (visible && quiz) {
      fetchStudentsWhoCompletedQuiz();
    }
  }, [visible, quiz]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
  
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title={quiz?.title || "Quiz Results"}>
      {loading && <LoadingScreen />}

      <ErrorModal
        visible={errorVisible}
        title="Failed to Load Quiz Results"
        message={errorMessage}
        onTryAgain={() => {
          setErrorVisible(false);
          if (quiz && quiz._id) {
            fetchStudentsWhoCompletedQuiz();
          }
        }}
        onCancel={() => setErrorVisible(false)}
      />

      <View style={styles.container}>
        <Text style={styles.header}>Results</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {completedStudents.length} student{completedStudents.length !== 1 ? 's' : ''} completed
          </Text>
          <Text style={styles.statsText}>
            Average score: {
              completedStudents.length > 0 
                ? Math.round(completedStudents.reduce((sum, student) => sum + student.percentScore, 0) / completedStudents.length)
                : 0
            }%
          </Text>
        </View>
        <FlatList
          data={completedStudents}
          keyExtractor={(item) => item.studentId.toString()}
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.studentName}</Text>
                <Text style={styles.points}>
                  {item.totalScore} <AntDesign name="star" size={16} color="#f5cb5c" />
                </Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.info}>Score: {item.percentScore}%</Text>
                <Text style={styles.info}>
                  Correct: {item.correctAnswers}/{item.totalQuestions}
                </Text>
              </View>
              <Text style={styles.info}>Completed: {formatDate(item.answeredAt)}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>
              No students have completed this quiz yet.
            </Text>
          }
        />
      </View>
    </ReusableModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statsContainer: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderColor: "#184e77",
  },
  statsText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  studentCard: {
    backgroundColor: "#f1faee",
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
    borderLeftWidth: 4,
    borderColor: "#386641",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  points: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#386641",
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    fontSize: 12,
    color: "#555",
  },
  emptyListText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    padding: 20,
  },
});

export default QuizViewModal;