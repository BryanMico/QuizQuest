import React from 'react';
import { View, Text } from 'react-native';
import DashboardStyles from '../Styles/DashboardStyles'; // Adjust path based on your file structure

export default function AdminDashboard() {
  return (
    <View style={DashboardStyles.container}>
      <Text style={DashboardStyles.text}>Welcome to the Admin Dashboard</Text>
    </View>
  );
}
