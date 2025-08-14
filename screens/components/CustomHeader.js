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
    backgroundColor: '#184e77', // deep blue header
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f2e8cf', // beige text
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
    color: '#f2e8cf', // beige text
    marginRight: 15,
  },
});

export default CustomHeader;
