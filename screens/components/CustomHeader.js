import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomHeader = ({ title, navigation }) => {
  return (
    <View style={styles.header}>
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
});

export default CustomHeader;
