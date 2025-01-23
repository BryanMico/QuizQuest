import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal, Button } from 'react-native';
import DashboardStyles from '../Styles/DashboardStyles'; // Adjust path based on your file structure

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState([
    { id: '1', name: 'John Doe', password: 'password123' },
    { id: '2', name: 'Jane Smith', password: 'password123' },
    { id: '3', name: 'Mark Johnson', password: 'password123' },
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [newTeacherName, setNewTeacherName] = useState(''); // New teacher name input
  const [newPassword, setNewPassword] = useState(''); // New teacher password input

  const handleAddTeacher = () => {
    // Add the new teacher to the list
    const newTeacher = { id: (teachers.length + 1).toString(), name: newTeacherName, password: newPassword };
    setTeachers([...teachers, newTeacher]);
    setIsModalVisible(false); // Close the modal
    setNewTeacherName(''); // Reset the input fields
    setNewPassword(''); // Reset the password input field
  };

  const renderTeacher = ({ item }) => (
    <View style={DashboardStyles.teacherItem}>
      <Text style={DashboardStyles.teacherName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={DashboardStyles.container}>
      <Text style={DashboardStyles.text}>Welcome to the Admin Dashboard</Text>

      {/* Teacher List */}
      <FlatList
        data={teachers}
        renderItem={renderTeacher}
        keyExtractor={(item) => item.id}
        style={DashboardStyles.teacherList}
      />

      {/* Add Teacher Button */}
      <TouchableOpacity style={DashboardStyles.addTeacherButton} onPress={() => setIsModalVisible(true)}>
        <Text style={DashboardStyles.addTeacherButtonText}>Add Teacher</Text>
      </TouchableOpacity>

      {/* Modal to Add a Teacher */}
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
      >
        <View style={DashboardStyles.modalContainer}>
          <View style={DashboardStyles.modalView}>
            <Text style={DashboardStyles.modalTitle}>Add New Teacher</Text>

            <TextInput
              style={DashboardStyles.input}
              placeholder="Teacher Name"
              value={newTeacherName}
              onChangeText={setNewTeacherName}
            />

            {/* Password Input */}
            <TextInput
              style={DashboardStyles.input}
              placeholder="Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true} // Ensures the password is hidden
            />

            <Button title="Add Teacher" onPress={handleAddTeacher} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
