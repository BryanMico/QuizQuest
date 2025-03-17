import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import LoadingScreen from '../components/LoadingScreen';
import { getQuizById } from '../../services/quizService';
import { answerQuiz } from '../../services/quizService';


// Assets
const playerImage = require('../../assets/player.png');
const monsters = {
  "10 points": require("../../assets/monsters/10points.png"),
  "20 points": require("../../assets/monsters/20points.png"),
  "30 points": require("../../assets/monsters/30points.png"),
  "40 points": require("../../assets/monsters/40points.png"),
  "50 points": require("../../assets/monsters/50points.png"),
  "60 points": require("../../assets/monsters/60points.png"),
  "70 points": require("../../assets/monsters/70points.png"),
  "80 points": require("../../assets/monsters/80points.png"),
  "90 points": require("../../assets/monsters/90points.png"),
  "100 points": require("../../assets/monsters/100points.png"),
};
const slashEffect = require('../../assets/slash.png');
const starImage = require('../../assets/star.png');
const backgroundImage = require('../../assets/game_background.jpg');


export default function GameScreen({ navigation, route }) {
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { quizId, quizData: initialQuizData } = route.params || {};
  const [quizData, setQuizData] = useState(initialQuizData || null);
  const [screen, setScreen] = useState('loading');
  // Initialize with default value, will update after quiz is loaded
  const [lives, setLives] = useState(3);
  const [points, setPoints] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shakeAnim] = useState(new Animated.Value(0));
  const [bossOpacity] = useState(new Animated.Value(1));
  const [showSlash, setShowSlash] = useState(false);
  const [slashPosition, setSlashPosition] = useState({ x: 0, y: 0 });
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false });
  const [stars, setStars] = useState([]);
  const mountedRef = useRef(true);
  const slashAnimationRef = useRef(null);


  useEffect(() => {
    // If quiz data was passed in navigation, use it
    if (initialQuizData) {
      setQuizData(initialQuizData);
      setLives(initialQuizData.questions && Array.isArray(initialQuizData.questions)
        ? initialQuizData.questions.length : 3);
      return;
    }

    const fetchQuizData = async () => {
      try {
        setLoading(true);
        if (quizId) {
          const fetchedQuiz = await getQuizById(quizId);
          if (fetchedQuiz) {
            setQuizData(fetchedQuiz);
            setLives(fetchedQuiz.questions && Array.isArray(fetchedQuiz.questions) ? fetchedQuiz.questions.length : 3);
          }
        } else {
          console.log("No quiz ID provided");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
        if (mountedRef.current) {
          setScreen('title');
        }
      }
    };

    if (quizId) {
      fetchQuizData();
    }
  }, [quizId, initialQuizData]);

  // Current question for cleaner code
  const currentQuestion = quizData && quizData.questions && currentQuestionIndex < quizData.questions.length
    ? quizData.questions[currentQuestionIndex]
    : null;

  useEffect(() => {
    // Initial loading animation with confetti
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setScreen('title');
      }
    }, 3000);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, []);

  const createStars = () => {
    const newStars = [];
    for (let i = 0; i < 10; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 300,
        y: Math.random() * 200,
        size: Math.random() * 30 + 10,
        duration: Math.random() * 1000 + 500,
        delay: Math.random() * 500
      });
    }
    setStars(newStars);
  };

  const handleAnswer = (selectedOption) => {
    if (!currentQuestion || feedback.show) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    setUserAnswers(prev => [...prev, {
      questionIndex: currentQuestionIndex,
      selectedAnswer: selectedOption
    }]);
    // Show feedback
    setFeedback({ show: true, isCorrect });

    if (isCorrect) {
      setPoints(prevPoints => prevPoints + currentQuestion.points);
      triggerBossDefeatEffects();

    } else {
      setLives(prevLives => prevLives - 1);
      triggerBossAttackEffect();

    }

    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false });

      // Move to next question or end game
      if (currentQuestionIndex + 1 < quizData.questions.length) {
        setScreen('loading');
        setTimeout(() => {
          if (mountedRef.current) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setScreen('question');
          }
        }, 800);
      } else {
        // Game complete
        setTimeout(() => {
          if (mountedRef.current) {
            setScreen(lives > 0 ? 'victory' : 'defeat');
            if (lives > 0) {
              createStars();
            }
          }
        }, 800);
      }
    }, 1500);
  };

  const submitQuizAnswers = async () => {
    try {
      if (quizSubmitted) return;

      setLoading(true);

      // Get studentId from user context or auth state
      // This would come from your authentication system
      const studentId = await AsyncStorage.getItem('studentId');

      const answerData = {
        studentId,
        answers: userAnswers,
        pointsEarned: points

      };

      const result = await answerQuiz(quizId, answerData);

      console.log("Quiz submitted successfully:", result);
      setQuizSubmitted(true);

      // Maybe show success message or animation
    } catch (error) {
      console.error("Error submitting quiz:", error);
      // Show error message to user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // When the game ends, submit the answers
    if ((screen === 'victory' || screen === 'defeat') && !quizSubmitted) {
      submitQuizAnswers();
    }
  }, [screen]);

  const triggerBossDefeatEffects = () => {
    // Multiple slash effects
    const slashPositions = [
      { x: -30, y: -20 },
      { x: 20, y: 30 },
      { x: -10, y: 10 }
    ];

    slashPositions.forEach((position, index) => {
      setTimeout(() => {
        if (mountedRef.current) {
          setSlashPosition(position);
          setShowSlash(true);

          // Create slash animation
          if (slashAnimationRef.current) {
            slashAnimationRef.current.fadeIn(100).then(() => {
              slashAnimationRef.current.rotate(800);
            });
          }

          // Shake and flash the boss
          Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -15, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
          ]).start();

          // Flash effect
          Animated.sequence([
            Animated.timing(bossOpacity, { toValue: 0.3, duration: 100, useNativeDriver: true }),
            Animated.timing(bossOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(bossOpacity, { toValue: 0.3, duration: 100, useNativeDriver: true }),
            Animated.timing(bossOpacity, { toValue: 1, duration: 100, useNativeDriver: true })
          ]).start();
        }
      }, index * 200);
    });

    // Hide slash after all animations
    setTimeout(() => {
      if (mountedRef.current) {
        setShowSlash(false);
      }
    }, 1000);
  };

  const triggerBossAttackEffect = () => {
    // Boss attack animation
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -5, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 40, duration: 300, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 200, useNativeDriver: true })
    ]).start();
  };

  const goBackToQuizScreen = () => {
    navigation.navigate("StudentTabs", { screen: "StudentQuizScreen" });
  };



  return (
    <SafeAreaView style={styles.container}>
      {screen === 'loading' && <LoadingScreen visible={true} />}

      <Image source={backgroundImage} style={styles.backgroundImage} />

      {screen !== 'title' && screen !== 'introduction' && (
        <View style={styles.topBar}>
          <View style={styles.playerContainer}>
            <Image source={playerImage} style={styles.playerImage} />
            <View style={styles.heartBadge}>
              <Text style={styles.hearts}>❤️ {lives}</Text>
            </View>

          </View>
          <View style={styles.pointsContainer}>
            <MaterialIcons name="stars" size={24} color="gold" />
            <Text style={styles.points}>{points}</Text>
          </View>
        </View>
      )}

      {screen === 'title' && (
        <Animatable.View animation="bounceIn" duration={1500} style={styles.centered}>
          <Text style={styles.title}>{quizData.title}</Text>
          <Image source={playerImage} style={styles.titleCharacter} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => setScreen('introduction')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Start Adventure</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      {screen === 'introduction' && (
        <Animatable.View animation="fadeIn" duration={1000} style={styles.centered}>
          <Text style={styles.story}>{quizData.introduction}</Text>
          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            style={styles.monologue}
          >
            {quizData.monologueText}
          </Animatable.Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setScreen('question')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Begin Battle</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      {screen === 'question' && currentQuestion && (
        <View style={styles.centered}>
          <View style={styles.battleContainer}>
            <Image source={playerImage} style={styles.playerBattleImage} />

            <View style={styles.bossContainer}>
              <Animated.Image
                source={monsters[currentQuestion.monster] || monsters["10 points"]}
                style={[
                  styles.bossImage,
                  {
                    transform: [{ translateX: shakeAnim }],
                    opacity: bossOpacity
                  }
                ]}
                resizeMode="contain"
              />

              {showSlash && (
                <Animatable.Image
                  ref={slashAnimationRef}
                  source={slashEffect}
                  style={[
                    styles.slashImage,
                    {
                      left: slashPosition.x,
                      top: slashPosition.y
                    }
                  ]}
                />
              )}
            </View>
          </View>

          <View style={styles.questionBubble}>
            <Text style={styles.questionCounter}>
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </Text>
            <Text style={styles.question}>{currentQuestion.text}</Text>
          </View>

          <View style={styles.answersContainer}>
            {currentQuestion.choices.map((option, index) => (
              <Animatable.View
                key={index}
                animation="fadeInUp"
                delay={index * 200}
              >
                <TouchableOpacity
                  style={[
                    styles.answerButton,
                    feedback.show && option === currentQuestion.correctAnswer && styles.correctAnswerButton,
                    feedback.show && option !== currentQuestion.correctAnswer && feedback.isCorrect === false && option === currentQuestion.choices[index] && styles.wrongAnswerButton
                  ]}
                  onPress={() => !feedback.show && handleAnswer(option)}
                  activeOpacity={feedback.show ? 1 : 0.7}
                  disabled={feedback.show}
                >
                  <Text style={styles.buttonText}>{option}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>

          {feedback.show && (
            <Animatable.View animation="bounceIn" style={styles.feedbackContainer}>
              <Text style={[
                styles.feedbackText,
                feedback.isCorrect ? styles.correctFeedback : styles.wrongFeedback
              ]}>
                {feedback.isCorrect ? "Correct! Great job!" : "Oops! Try again!"}
              </Text>
            </Animatable.View>
          )}
        </View>
      )}

      {screen === 'victory' && (
        <Animatable.View animation="bounceIn" style={styles.centered}>
          <Text style={styles.victoryTitle}>Victory!</Text>

          {/* Stars celebration */}
          {stars.map(star => (
            <Animatable.Image
              key={star.id}
              source={starImage}
              style={[
                styles.star,
                {
                  width: star.size,
                  height: star.size,
                  left: star.x,
                  top: star.y
                }
              ]}
              animation="zoomIn"
              duration={star.duration}
              delay={star.delay}
            />
          ))}

          <View style={styles.scoreCard}>
            <MaterialIcons name="emoji-events" size={40} color="gold" />
            <Text style={styles.scoreText}>Total Score: {points}</Text>
            {quizSubmitted && (
              <View style={styles.submissionStatus}>
                <MaterialIcons name="check-circle" size={20} color="green" />
                <Text style={styles.submissionText}>Results submitted</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={goBackToQuizScreen}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Back to Quiz Screen</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      {screen === 'defeat' && (
        <Animatable.View animation="fadeIn" style={styles.centered}>
          <Text style={styles.defeatTitle}>Oh no!</Text>
          <Image source={playerImage} style={styles.defeatImage} />
          <Text style={styles.defeatMessage}>Don't worry, you can try again!</Text>
          <Text style={styles.scoreText}>Score: {points}</Text>

          {quizSubmitted && (
            <View style={styles.submissionStatus}>
              <MaterialIcons name="check-circle" size={20} color="green" />
              <Text style={styles.submissionText}>Results submitted</Text>
            </View>
          )}


          <TouchableOpacity
            style={styles.button}
            onPress={goBackToQuizScreen}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Back to Quiz Screen</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    position: 'relative'
  },
  submittedContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  submittedText: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.4
  },
  topBar: {
    position: 'absolute',
    top: 40,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#fff',
    marginRight: 10
  },
  heartBadge: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hearts: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  points: {
    color: 'gold',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5
  },
  centered: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    padding: 20
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5
  },
  titleCharacter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'gold',
    marginBottom: 30
  },
  story: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10
  },
  monologue: {
    color: '#ffcc00',
    fontSize: 28,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5
  },
  battleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20
  },
  playerBattleImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    marginLeft: 20
  },
  bossContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    marginRight: 20
  },
  bossImage: {
    width: 150,
    height: 150
  },
  slashImage: {
    position: 'absolute',
    width: 150,
    height: 150,
    zIndex: 2
  },
  questionCounter: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 5
  },
  questionBubble: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20
  },
  question: {
    color: '#222',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '600'
  },
  answersContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  answerButton: {
    backgroundColor: '#5e35b1',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3
  },
  correctAnswerButton: {
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff'
  },
  wrongAnswerButton: {
    backgroundColor: '#F44336',
    borderWidth: 2,
    borderColor: '#fff'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  feedbackContainer: {
    padding: 10,
    alignItems: 'center',
    marginTop: 10
  },
  feedbackText: {
    fontSize: 26,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  correctFeedback: {
    color: '#4CAF50'
  },
  wrongFeedback: {
    color: '#F44336'
  },
  loadingText: {
    color: '#fff',
    marginTop: 10
  },
  victoryTitle: {
    color: '#4CAF50',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5
  },
  star: {
    position: 'absolute',
    resizeMode: 'contain'
  },
  scoreCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  scoreText: {
    color: '#222',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10
  },
  defeatTitle: {
    color: '#F44336',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5
  },
  defeatImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.7,
    marginBottom: 20
  },
  defeatMessage: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  }
});