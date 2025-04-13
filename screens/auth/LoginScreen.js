import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Authstyles } from '../../styles/Authstyles';
import { login } from '../../services/authService';
import LoadingScreen from '../components/LoadingScreen';
import ErrorModal from '../components/ErrorModal';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [aboutVisible, setAboutVisible] = useState(false); // ⬅️ About Modal

  const navigation = useNavigation();

  useEffect(() => {
    // Show about modal on initial load
    setAboutVisible(true);
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Please fill in all fields.');
      setErrorModalVisible(true);
      return;
    }

    setLoading(true);

    try {
      const data = await login(username, password);

      if (data.user.role === 'Teacher') {
        await AsyncStorage.setItem('teacherId', data.user.id);
        navigation.replace('TeacherTabs', { teacherId: data.user.id });
      } else if (data.user.role === 'Admin') {
        await AsyncStorage.setItem('adminId', data.user.id);
        navigation.replace('AdminTabs', { adminId: data.user.id });
      } else if (data.user.role === 'Student') {
        await AsyncStorage.setItem('studentId', data.user.id);
        navigation.navigate('StudentTabs', { studentId: data.user.id });
      } else {
        setErrorMessage('Invalid role.');
        setErrorModalVisible(true);
      }

      Alert.alert('Success', data.message);
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please try again.');
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={Authstyles.container}>
      <LoadingScreen visible={loading} />

      <ErrorModal
        visible={errorModalVisible}
        title="Login Failed"
        message={errorMessage}
        onTryAgain={() => {
          setErrorModalVisible(false);
          handleLogin();
        }}
        onCancel={() => setErrorModalVisible(false)}
      />

      {/* 📘 About QuizQuest Modal */}
      <Modal visible={aboutVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, maxHeight: '80%' }}>
            <ScrollView>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#386641' }}>
                About QuizQuest
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 10 }}>
                QuizQuest is a mobile app designed to turn traditional quizzes into interactive, game-like learning
                experiences that reward both effort and improvement.
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 10 }}>
                🎮 Students earn points based on their quiz performance. These rewards can be redeemed for real-life
                items, making each quiz session more exciting and meaningful.
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 10 }}>
                👩‍🏫 Teachers can:
                {"\n"}- Create and assign multiple-choice quizzes
                {"\n"}- Track real-time student progress and results
                {"\n"}- Design custom rewards to recognize achievement
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 10 }}>
                This app aims to build stronger connections between students and teachers by making assessments more
                engaging and interactive. Through meaningful feedback and fun incentives, QuizQuest encourages learners
                to stay motivated and take ownership of their learning.
              </Text>
              <Text style={{ fontSize: 14 }}>
                Our vision is to create a classroom tool that not only supports academic growth but also fosters
                curiosity, connection, and consistent participation—making every quiz a step toward a more dynamic
                learning environment.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: '#386641',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
              }}
              onPress={() => setAboutVisible(false)}
            >
              <Text style={{ color: '#f2e8cf', fontSize: 16 }}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🔐 Login UI */}
      <Image
        source={require('../../assets/QuizQuestIcon.png')}
        style={Authstyles.logo}
        resizeMode="contain"
      />
      <Text style={Authstyles.title}>QuizQuest</Text>
      <TextInput
        style={Authstyles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={Authstyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={Authstyles.button} onPress={handleLogin}>
        <Text style={Authstyles.buttonText}>Join In!</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 15, fontSize: 12, color: '#6c757d', textAlign: 'center' }}>
        By logging in, you agree to our{" "}
        <Text style={{ color: '#386641', textDecorationLine: 'underline' }}>
          Terms & Conditions
        </Text>{" "}
        and{" "}
        <Text style={{ color: '#386641', textDecorationLine: 'underline' }}>
          Privacy Policy
        </Text>.
      </Text>
    </View>
  );
}
