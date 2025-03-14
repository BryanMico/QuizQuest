import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Authstyles } from '../../styles/Authstyles';
import { login } from '../../services/authService';
import LoadingScreen from '../components/LoadingScreen';
import ErrorModal from '../components/ErrorModal'; // Import the reusable modal

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false); // For the error modal
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

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
        await AsyncStorage.setItem('teacherId', data.user.id); // Save teacher's ID
        navigation.replace('TeacherTabs', { teacherId: data.user.id }); 
      } else if (data.user.role === 'Admin') {
        await AsyncStorage.setItem('adminId', data.user.id); // Save Admin's ID
        navigation.navigate('AdminTabs', { adminId: data.user.id});
      } else if (data.user.role === 'Student') {
        navigation.navigate('StudentTabs');
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
          handleLogin(); // Retry logic
        }}
        onCancel={() => setErrorModalVisible(false)}
      />

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
