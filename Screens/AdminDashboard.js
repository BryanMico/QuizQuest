import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal, Button } from 'react-native';
import axios from 'axios';
import DashboardStyles from '../Styles/DashboardStyles'; // Adjust path based on your file structure
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editingTeacher, setEditingTeacher] = useState(null); // For editing

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teachers'); // Adjust URL to fetch teachers
      setTeachers(response.data); // Set fetched teachers
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers(); // Fetch teachers when component mounts
  }, []);

  // Handle adding/updating teacher
  const handleSaveTeacher = async () => {
    if (editingTeacher) {
      // Update teacher
      try {
        await axios.put(`http://localhost:5000/api/updateTeacher/${editingTeacher._id}`, {
          name: newTeacherName,
          email: newTeacherEmail,
          password: newPassword,
          role: 'teacher', // Ensure role is set to teacher
        });
        setEditingTeacher(null);
      } catch (error) {
        console.error('Error updating teacher:', error);
      }
    } else {
      // Create teacher
      try {
        await axios.post('http://localhost:5000/api/createTeacher', {
          name: newTeacherName,
          email: newTeacherEmail,
          password: newPassword,
          role: 'teacher', // Ensure role is set to teacher
        });
      } catch (error) {
        console.error('Error creating teacher:', error);
      }
    }
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewPassword('');
    setIsModalVisible(false);
    fetchTeachers(); // Refresh teacher list
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setNewTeacherName(teacher.name);
    setNewTeacherEmail(teacher.email);
    setNewPassword(''); // Optional, leave password empty for editing
    setIsModalVisible(true);
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/deleteTeacher/${id}`);
      fetchTeachers(); // Refresh teacher list
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Remove the token from AsyncStorage
      await AsyncStorage.removeItem('token');
      
      // Optionally, navigate to login screen
      navigation.navigate('AdminLogin'); 
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Something went wrong while logging out.');
    }
  };

  const renderTeacher = ({ item }) => (
    <View style={DashboardStyles.teacherItem}>
      <Text style={DashboardStyles.teacherName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleEditTeacher(item)}>
        <Text>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteTeacher(item._id)}>
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={DashboardStyles.container}>
      <Text style={DashboardStyles.text}>Welcome to the Admin Dashboard</Text>

      <FlatList
        data={teachers}
        renderItem={renderTeacher}
        keyExtractor={(item) => item._id}
        style={DashboardStyles.teacherList}
      />

      <TouchableOpacity 
        style={DashboardStyles.addTeacherButton} 
        onPress={() => {
          setEditingTeacher(null); // Reset editingTeacher state
          setIsModalVisible(true); 
        }}
      >
        <Text style={DashboardStyles.addTeacherButtonText}>
          {editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
        </Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} animationType="slide">
        <View style={DashboardStyles.modalContainer}>
          <View style={DashboardStyles.modalView}>
            <Text style={DashboardStyles.modalTitle}>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</Text>
            <TextInput
              style={DashboardStyles.input}
              placeholder="Teacher Name"
              value={newTeacherName}
              onChangeText={setNewTeacherName}
            />
            <TextInput
              style={DashboardStyles.input}
              placeholder="Teacher Email"
              value={newTeacherEmail}
              onChangeText={setNewTeacherEmail}
            />
            <TextInput
              style={DashboardStyles.input}
              placeholder="Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <Button title="Save Teacher" onPress={handleSaveTeacher} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={handleLogout} style={DashboardStyles.logoutButton}>
        <Text style={DashboardStyles.addTeacherButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
