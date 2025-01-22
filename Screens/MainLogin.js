import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MainLogin({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Quiz Quest</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('QuizQuestLogin')}>
        <Text style={styles.buttonText}>Login as Student/Teacher</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminLogin')}>
        <Text style={styles.buttonText}>Login as Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B9FBC6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    width: '80%',
    backgroundColor: '#82C91E',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
