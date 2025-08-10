import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-web';
const CustomHeader = ({ title, navigation }) => {
  return (
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/QuizQuestIcon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appTitle}>QuizQuest</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#386641',
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f2e8cf',
  },
  logoContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 2,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f2e8cf',
    marginRight: 15,
  },
});

export default CustomHeader;
