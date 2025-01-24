import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import LoginStyles from '../Styles/LoginStyles'; // Adjust path based on your file structure

export default function AdminLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async () => {
    if (email === '' || password === '' || !role) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }), // Include the role (teacher or student)
      });
  
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        // Redirect based on the role returned in the token or response
        if (role === 'teacher') {
          navigation.navigate('TeacherDashboard');
        } else if (role === 'student') {
          navigation.navigate('StudentDashboard');
        }
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };
  
  
  
  return (
    <View style={LoginStyles.container}>
      <View style={LoginStyles.logoContainer}>
        <Text style={LoginStyles.logo}>🔐</Text>
        <Text style={LoginStyles.logoTitle}>ADMIN PORTAL</Text>
      </View>

      <View style={LoginStyles.formContainer}>
        <Text style={LoginStyles.roleText}>ADMIN LOGIN</Text>
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
      </View>
    </View>
  );
}
