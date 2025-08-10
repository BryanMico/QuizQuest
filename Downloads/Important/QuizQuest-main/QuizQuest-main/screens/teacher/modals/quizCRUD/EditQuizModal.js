import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import { Picker } from "@react-native-picker/picker";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


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
  label: monster.charAt(0).toUpperCase() + monster.slice(1), // Capitalize the first letter
  value: monster,
}));

const EditQuizModal = ({ visible, onClose, quizData, onSave }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(quizData?.title || "");
  const [introduction, setIntroduction] = useState(quizData?.introduction || "");
  const [questions, setQuestions] = useState(quizData?.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(questions.length > 0 ? 0 : -1);
  const [currentQuestion, setCurrentQuestion] = useState(
    questions.length > 0
      ? questions[0]
      : {
        text: "",
        type: "multiple_choice",
        choices: ["", "", ""],
        correctAnswer: "",
        monster: "10 points",
        points: "10",
      }
  );

  const handleNextStep = () => {
    setStep(step + 1);
    if (questions.length > 0) {
      setCurrentQuestion(questions[0]);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setCurrentQuestion(questions[currentQuestionIndex - 1]);
      } else {
        setStep(1);
      }
    }
  };

  const handleAddQuestion = () => {
    const updatedQuestions = [...questions, currentQuestion];
    setQuestions(updatedQuestions);
    setCurrentQuestionIndex(updatedQuestions.length - 1);
    setCurrentQuestion({
      text: "",
      type: "multiple_choice",
      choices: ["", "", ""],
      correctAnswer: "",
      monster: "10 points",
      points: "10",
    });
  };

  const handleRemoveQuestion = () => {
    if (currentQuestionIndex >= 0) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(currentQuestionIndex, 1);

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
          points: "10",
        });
        setCurrentQuestionIndex(-1);
      }

      setQuestions(updatedQuestions);
    }
  };

  const handleSave = () => {
    // If there's a current question that hasn't been added to questions array yet
    let finalQuestions = [...questions];

    // Only add the current question if it has content and isn't already in the array
    if (currentQuestion.text && !questions.includes(currentQuestion)) {
      finalQuestions.push(currentQuestion);
    }

    onSave({ title, introduction, questions: finalQuestions });
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Edit Quiz">
      <ScrollView>
        {step === 1 && (
          <>
            <Text style={styles.label}>Quiz Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Quiz Title"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Introduction</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Introduction"
              value={introduction}
              onChangeText={setIntroduction}
            />

            <TouchableOpacity style={styles.Button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.questionIndex}>
              {questions.length > 0
                ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
                : "Add a new question"}
            </Text>

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
              style={[styles.input, { backgroundColor: '#e0e0e0' }]} // Add a disabled look
              placeholder="Points"
              keyboardType="numeric"
              value={String(currentQuestion.points)} // Ensure points are displayed as a string
              editable={false} // Makes the input read-only
            />
            <Text style={styles.label}>Question</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Question"
              value={currentQuestion.text}
              onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, text })}
            />

            {currentQuestion.choices?.map((choice, index) => (
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
              <TouchableOpacity
                style={styles.Button}
                onPress={handlePreviousStep}
                disabled={step === 1 && currentQuestionIndex <= 0}
              >
                <MaterialIcons name="skip-previous" size={27} color="#f2e8cf" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.Button, currentQuestionIndex >= questions.length - 1 && styles.disabledButton]}
                onPress={() => {
                  const nextIndex = currentQuestionIndex + 1;
                  if (nextIndex < questions.length) {
                    setCurrentQuestionIndex(nextIndex);
                    setCurrentQuestion(questions[nextIndex]);
                  }
                }}
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

              <TouchableOpacity style={styles.Button} onPress={handleSave}>
                <Ionicons name="checkmark-done-sharp" size={27} color="#f2e8cf" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </ReusableModal>
  );
};

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

export default EditQuizModal;