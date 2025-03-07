import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Authstyles } from '../../styles/Authstyles';

export default function LoginScreen() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminpass');
  const navigation = useNavigation();

  const handleLogin = () => {
    if (username && password) {
      if (username === 'admin' && password === 'adminpass') {
        navigation.navigate('AdminDashboard');
      } else {
        Alert.alert('Error', 'Invalid username or password.');
      }
    } else {
      Alert.alert('Error', 'Please enter both username and password.');
    }
  };

  return (
    <View style={Authstyles.container}>
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
    </View>
  );
}


