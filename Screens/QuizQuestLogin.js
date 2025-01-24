import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import LoginStyles from '../Styles/LoginStyles'; // Adjust path based on your file structure
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function QuizQuestLogin({ navigation }) {
  const [isStudent, setIsStudent] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Make API request for login with role included
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role: isStudent ? 'student' : 'teacher', // Pass the role based on the login type
      });

      // Assuming the backend returns a token in response.data.token
      if (response.data.token) {
        // Store token in AsyncStorage
        await AsyncStorage.setItem('token', response.data.token);

        // Navigate to the appropriate dashboard based on role
        if (isStudent) {
          navigation.navigate('StudentDashboard', { userRole: 'Student' });
        } else {
          navigation.navigate('TeacherDashboard', { userRole: 'Teacher' });
        }
      } else {
        Alert.alert('Error', 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    }
  };

  return (
    <View style={LoginStyles.container}>
      <View style={LoginStyles.logoContainer}>
        <Text style={LoginStyles.lightbulb}>💡</Text>
        <Text style={LoginStyles.logoTitle}>QUIZ QUEST</Text>
      </View>

      <View style={LoginStyles.formContainer}>
        <Text style={LoginStyles.roleText}>{isStudent ? 'STUDENT LOGIN' : 'TEACHER LOGIN'}</Text>
        <TextInput
          style={LoginStyles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={LoginStyles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={LoginStyles.loginButton} onPress={handleLogin}>
          <Text style={LoginStyles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsStudent(!isStudent)}>
          <Text style={LoginStyles.toggleText}>
            Are you a {isStudent ? 'Teacher' : 'Student'}? Click here
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
