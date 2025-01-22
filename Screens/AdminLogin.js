import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import LoginStyles from '../Styles/LoginStyles'; // Adjust path based on your file structure

export default function AdminLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }
  
    // Replace this condition with actual admin credential validation logic
      navigation.navigate('AdminDashboard');
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
