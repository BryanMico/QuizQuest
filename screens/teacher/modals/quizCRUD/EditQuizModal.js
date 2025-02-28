import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Picker, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import ReusableModal from "../../../components/ModalScreen";
import Ionicons from '@expo/vector-icons/Ionicons';

const bossImages = {
  "snake": require("../../../../assets/snake.png"),
  "mob1": require("../../../../assets/mob1.png"),
  "mob2": require("../../../../assets/mob2.png"),
};

const EditQuizModal = ({ visible, onClose, onSubmit, quest }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [quizType, setQuizType] = useState(null);
  const [monologueText, setMonologueText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    type: "multiple_choice",
    choices: ["", "", ""],
    correctAnswer: "",
    monster: "snake",
    points: "",
  });

  useEffect(() => {
    if (quest) {
      setTitle(quest.title);
      setIntroduction(quest.introduction);
      setQuizType(quest.quizType);
      setMonologueText(quest.monologueText || "");
      setQuestions(quest.questions || []);
    }
  }, [quest]);

  const handleNextStep = () => {
    if (step === 3 && quizType) {
      setStep(2);
    } else {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAddQuestion = () => {
    if (quizType === "monologue") {
      setMonologueText(monologueText); // Store monologue separately
    } else {
      setQuestions([...questions, currentQuestion]);
    }
  
    setCurrentQuestion({
      text: "",
      type: "multiple_choice",
      choices: ["", "", ""],
      correctAnswer: "",
      monster: "snake",
      points: "",
    });
  
    setStep(2);
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = questions[index];
    setCurrentQuestion(questionToEdit);
    setQuestions(questions.filter((_, i) => i !== index));
    setStep(3);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit({ title, introduction, quizType, monologueText, questions });
  };

  return (
    <ReusableModal visible={visible} onClose={onClose} title="Edit Quiz">
      <ScrollView>
        {step === 1 && (
          <>
            <Text style={styles.label}>Quiz Title</Text>
            <TextInput style={styles.input} placeholder="Enter Quiz Title" value={title} onChangeText={setTitle} />
            <Text style={styles.label}>Introduction</Text>
            <TextInput style={styles.input} placeholder="Enter Introduction" value={introduction} onChangeText={setIntroduction} />
            <TouchableOpacity 
              style={[styles.Button]} 
              onPress={handleNextStep} 
              >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.label}>What to Add next?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={quizType}
                onValueChange={setQuizType}
                style={styles.picker}
              >
                <Picker.Item label="Monologue" value="monologue" />
                <Picker.Item label="Multiple Choice" value="multiple_choice" />
                <Picker.Item label="Identification" value="identification" />
              </Picker>
            </View>
            <View style={styles.navigationButtons}>
              <TouchableOpacity style={styles.navButton} onPress={handlePreviousStep}>
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.navButton, !quizType && styles.disabledButton]} 
                onPress={handleNextStep} 
                disabled={!quizType}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 3 && quizType === "monologue" && (
          <>
            <Text style={styles.label}>Monologue</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Monologue Text"
              value={monologueText}
              onChangeText={setMonologueText}
            />
            <View style={styles.navigationButtons}>
              <TouchableOpacity style={styles.Button} onPress={handlePreviousStep}>
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.Button} onPress={handleAddQuestion}>
                <Ionicons name="add-circle-sharp" size={27} color="#f2e8cf" />      
              </TouchableOpacity>
              <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 3 && (quizType === "multiple_choice" || quizType === "identification") && (
          <>
            <Text style={styles.questionIndex}>Question {questions.length + 1}</Text>

            <Text style={styles.label}>Enemy</Text>
            <Picker
              selectedValue={currentQuestion.monster}
              onValueChange={(monster) => setCurrentQuestion({ ...currentQuestion, monster })}
              style={styles.picker}
            >
              <Picker.Item label="Snake" value="snake" />
              <Picker.Item label="Mob 1" value="mob1" />
              <Picker.Item label="Mob 2" value="mob2" />
            </Picker>
            <Image source={bossImages[currentQuestion.monster]} style={styles.bossImage} />
            <Text style={styles.label}>Points</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Points"
              keyboardType="numeric"
              value={currentQuestion.points}
              onChangeText={(points) => setCurrentQuestion({ ...currentQuestion, points })}
            />
            <Text style={styles.label}>Question</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Question"
              value={currentQuestion.text}
              onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, text })}
            />
            {quizType === "multiple_choice" &&
              currentQuestion.choices.map((choice, index) => (
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
              <TouchableOpacity style={styles.Button} onPress={handlePreviousStep}>
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.Button} onPress={handleAddQuestion}>
                <Ionicons name="add-circle-sharp" size={27} color="#f2e8cf" />      
              </TouchableOpacity>
              <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.label}>Questions</Text>
            {questions.map((question, index) => (
              <View key={index} style={styles.questionContainer}>
                <Text style={styles.questionText}>{question.text}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditQuestion(index)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteQuestion(index)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.navigationButtons}>
              <TouchableOpacity style={styles.Button} onPress={handlePreviousStep}>
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
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
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 10,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  textStyle: {
    fontSize: 13,
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    backgroundColor: "#f1faee",
    borderColor: "#386641",
    borderRadius: 5,
  },
  Button: {
    flex: 1,
    backgroundColor: "#386641",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  navButton: {
    backgroundColor: "#386641",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#f2e8cf",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    color: "#386641",
  },
  editButton: {
    backgroundColor: "#386641",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: "#e63946",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default EditQuizModal;