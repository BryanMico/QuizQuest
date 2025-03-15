import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import { Picker } from "@react-native-picker/picker";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createQuiz } from "../../../../services/quizService";
import ErrorModal from "../../../components/ErrorModal";
import LoadingScreen from "../../../components/LoadingScreen";

// Constants
const bossImages = {
  "10 points": require("../../../../assets/monsters/10points.png"),
  "20 points": require("../../../../assets/monsters/20points.png"),
  "30 points": require("../../../../assets/monsters/30points.png"),
  "40 points": require("../../../../assets/monsters/40points.png"),
  "50 points": require("../../../../assets/monsters/50points.png"),
  "60 points": require("../../../../assets/monsters/60points.png"),
  "70 points": require("../../../../assets/monsters/70points.png"),
  "80 points": require("../../../../assets/monsters/80points.png"),
  "90 points": require("../../../../assets/monsters/90points.png"),
  "100 points": require("../../../../assets/monsters/100points.png"),
};

const monsterOptions = Object.keys(bossImages).map((monster) => ({
  label: monster.charAt(0).toUpperCase() + monster.slice(1),
  value: monster,
}));

const QuizCreatorModal = ({ visible, onClose }) => {
  // State Management
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Start at 0
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    type: "multiple_choice",
    choices: ["", "", ""],
    correctAnswer: "",
    monster: "10 points",
    points: "",
  });

  // Helper Functions
  const validateQuiz = () => {
    if (!title.trim() || !introduction.trim()) {
      setErrorMessage("Quiz title and introduction are required.");
      return false;
    }

    if (questions.length === 0) {
      setErrorMessage("At least one question is required.");
      return false;
    }

    for (const question of questions) {
      if (!question.text.trim() || !question.correctAnswer.trim() || question.choices.some(choice => !choice.trim())) {
        setErrorMessage("All questions must have a text, correct answer, and non-empty choices.");
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && (!title.trim() || !introduction.trim())) {
      setErrorMessage("Quiz title and introduction are required.");
      setErrorVisible(true);
      return;
    }

    setStep(step + 1);

    // Only reset if there are no questions yet
    if (questions.length === 0) {
        setCurrentQuestionIndex(0);
    } else {
        setCurrentQuestionIndex(questions.length); // Continue from the last question
    }
};


  const handlePreviousStep = () => {
    if (step === 2 && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentQuestion(questions[currentQuestionIndex - 1]);
    } else {
      setStep(1);
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.text.trim() || !currentQuestion.correctAnswer.trim() || currentQuestion.choices.some(choice => !choice.trim())) {
      setErrorMessage("Please fill out all fields for the question.");
      setErrorVisible(true);
      return;
    }

    const updatedQuestions = [...questions, currentQuestion];
    setQuestions(updatedQuestions);
    setCurrentQuestionIndex(questions.length + 1);
    setCurrentQuestion({
      text: "",
      type: "multiple_choice",
      choices: ["", "", ""],
      correctAnswer: "",
      monster: "10 points",
      points: "",
    });
  };

  const handleRemoveQuestion = () => {
    if (currentQuestionIndex >= 0) {
      const updatedQuestions = questions.filter((_, index) => index !== currentQuestionIndex);
      setQuestions(updatedQuestions);

      if (updatedQuestions.length > 0) {
        const newIndex = Math.max(0, currentQuestionIndex - 1);
        setCurrentQuestionIndex(newIndex);
        setCurrentQuestion(updatedQuestions[newIndex]);
      } else {
        setCurrentQuestion({
          text: "",
          type: "multiple_choice",
          choices: ["", "", ""],
          correctAnswer: "",
          monster: "10 points",
          points: "",
        });
        setCurrentQuestionIndex(0); // Reset to 0 if no questions are left
      }
    }
  };

  const resetQuizData = () => {
    setStep(1); // Reset to Step 1
    setTitle('');
    setIntroduction('');
    setQuestions([]);
    setCurrentQuestion({
      text: '',
      choices: ['', '', '', ''],
      correctAnswer: '',
      monster: '',
      points: 0
    });
  };


  const handleSubmit = async () => {
    if (!validateQuiz()) {
      setErrorVisible(true);
      return;
    }

    const teacherId = await AsyncStorage.getItem('teacherId');
    if (!teacherId) {
      setErrorMessage('Teacher ID is missing.');
      setErrorVisible(true);
      return;
    }

    try {
      setLoading(true);
      const sanitizedQuestions = questions.map(q => ({
        text: q.text.trim(),
        choices: q.choices.map(choice => choice.trim()),
        correctAnswer: q.correctAnswer.trim(),
        points: parseInt(q.points) || 0,
      }));

      const quizData = {
        title: title.trim(),
        introduction: introduction.trim(),
        questions: sanitizedQuestions,
        teacherId,
      };

      await createQuiz(quizData);
      resetQuizData(); // Clear quiz data here

      onClose();
    } catch (error) {
      setErrorMessage(error.message || "An error occurred while creating the quiz.");
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };


  // Render Functions
  const renderStepOne = () => (
    <>
      <Text style={styles.label}>Quiz Title</Text>
      <TextInput style={styles.input} placeholder="Enter Quiz Title" value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Introduction</Text>
      <TextInput style={styles.input} placeholder="Enter Introduction" value={introduction} onChangeText={setIntroduction} />
      <TouchableOpacity style={styles.Button} onPress={handleNextStep}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </>
  );

  const renderStepTwo = () => (
    <>
      <Text style={styles.questionIndex}>
        {questions.length > 0
          ? `Question ${questions.length + 1} / ${questions.length + 1}`
          : "Question 1"}
      </Text>

      {/* Question Form */}
      <Text style={styles.label}>Enemy</Text>
      <Picker
        selectedValue={currentQuestion.monster}
        onValueChange={(monster) => {
          const points = parseInt(monster.replace('points', '')) || 0;
          setCurrentQuestion({ ...currentQuestion, monster, points });
        }}
        style={styles.picker}
      >
        {monsterOptions.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
      <Image source={bossImages[currentQuestion.monster]} style={styles.bossImage} />

      <Text style={styles.label}>Points</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#e0e0e0' }]}
        placeholder="Points"
        keyboardType="numeric"
        value={String(currentQuestion.points)}
        editable={false}
      />

      <Text style={styles.label}>Question</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Question"
        value={currentQuestion.text}
        onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, text })}
      />

      {currentQuestion.choices.map((choice, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Choice ${index + 1}`}
          value={choice}
          onChangeText={(text) => {
            const newChoices = [...currentQuestion.choices];
            newChoices[index] = text;
            setCurrentQuestion({ ...currentQuestion, choices: newChoices });
          }}
        />
      ))}

      <Text style={styles.label}>Answer</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Correct Answer"
        value={currentQuestion.correctAnswer}
        onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, correctAnswer: text })}
      />

      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.Button} onPress={handlePreviousStep} disabled={step === 1 && currentQuestionIndex <= 0}>
          <MaterialIcons name="skip-previous" size={27} color="#f2e8cf" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.Button, currentQuestionIndex >= questions.length - 1 && styles.disabledButton]}
          onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex >= questions.length - 1}
        >
          <MaterialIcons name="skip-next" size={27} color="#f2e8cf" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={handleAddQuestion}>
          <Ionicons name="add-circle-sharp" size={27} color="#f2e8cf" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={handleRemoveQuestion}>
          <Ionicons name="trash" size={27} color="#f2e8cf" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
          <Ionicons name="checkmark-done-sharp" size={27} color="#f2e8cf" />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Quiz Creation">
      {loading && <LoadingScreen />}
      <ErrorModal visible={errorVisible} message={errorMessage} onTryAgain={() => {
        setErrorVisible(false);
        handleSubmit();
      }} onCancel={() => setErrorVisible(false)} />
      <ScrollView>
        {step === 1 ? renderStepOne() : renderStepTwo()}
      </ScrollView>
    </ReusableModal>
  );
};

// Styles
const styles = StyleSheet.create({
  questionIndex: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#386641",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#386641",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "#f1faee",
    borderColor: "#386641",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  bossImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 10,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  picker: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "#f1faee",
    borderColor: "#386641",
    borderRadius: 5,
  },
  Button: {
    flex: 1,
    backgroundColor: "#386641",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 2,
  },
  buttonText: {
    color: "#f2e8cf",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default QuizCreatorModal;