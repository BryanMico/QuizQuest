import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import LoginStyles from '../Styles/LoginStyles'; // Adjust path based on your file structure

export default function QuizQuestLogin({ navigation }) {
  const [isStudent, setIsStudent] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isStudent) {
      navigation.navigate('StudentDashboard', { userRole: 'Student' });
    } else {
      navigation.navigate('TeacherDashboard', { userRole: 'Teacher' });
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
