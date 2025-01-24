import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import DashboardStyles from '../Styles/DashboardStyles'; 
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import TeacherSidebar from '../components/TeacherSidebar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// Helper function for API requests
const apiRequest = async (url, method, data = null, token) => {
  try {
    const response = await axios({
      url,
      method,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error.response?.data?.message || 'API request failed';
  }
};

export default function TeacherDashboard() {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Fetch students when component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          return Alert.alert('Error', 'Token not found');
        }

        const data = await apiRequest('http://localhost:5000/api/students', 'GET', null, token);
        setStudents(data);
      } catch (error) {
        Alert.alert('Error', `Failed to fetch students: ${error}`);
      }
    };

    fetchStudents();
  }, []);

  // Handle adding a new subject
  const handleAddSubject = async () => {
    if (!subjectName.trim()) {
      return Alert.alert('Error', 'Please enter a subject name');
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return Alert.alert('Error', 'Token not found');
      }

      const data = await apiRequest(
        'http://localhost:5000/api/subjects',
        'POST',
        {
          title: subjectName,
          description: 'Sample description',
          students: selectedStudents,
        },
        token
      );

      Alert.alert('Success', 'Subject created successfully!');
      setModalVisible(false);
      setSubjectName('');
      setSelectedStudents([]);
    } catch (error) {
      Alert.alert('Error', `Failed to create subject: ${error}`);
    }
  };

  // Handle selecting or deselecting students
  const handleSelectStudent = useCallback((studentId) => {
    setSelectedStudents((prevSelectedStudents) =>
      prevSelectedStudents.includes(studentId)
        ? prevSelectedStudents.filter((id) => id !== studentId)
        : [...prevSelectedStudents, studentId]
    );
  }, []);

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#A8D98A' }}>
      <TeacherSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} navigation={navigation} />

      <View style={[DashboardStyles.container, { zIndex: isOpen ? 1 : 0 }]}>
        <Text style={DashboardStyles.dashboardTitle}>
          <Icon name="dashboard" size={24} /> Dashboard
        </Text>

        {/* Button to open modal */}
        <TouchableOpacity
          style={DashboardStyles.addSubjectButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={DashboardStyles.buttonText}>Add Subject</Text>
        </TouchableOpacity>

        {/* Modal for Adding Subject */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={DashboardStyles.modalContainer}>
            <View style={DashboardStyles.modalView}>
              <Text style={DashboardStyles.modalTitle}>Add New Subject</Text>
              <TextInput
                placeholder="Enter subject name"
                value={subjectName}
                onChangeText={setSubjectName}
                style={DashboardStyles.input}
              />

              <Text>Select Students:</Text>
              <FlatList
                data={students}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectStudent(item._id)}>
                    <View style={DashboardStyles.subjectOption}>
                      <Icon name="person" size={20} color="#333" />
                      <Text style={DashboardStyles.subjectText}>{item.name}</Text>
                      {selectedStudents.includes(item._id) && (
                        <Icon name="check-circle" size={20} color="green" />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item._id}
              />

              <TouchableOpacity style={DashboardStyles.submitButton} onPress={handleAddSubject}>
                <Text style={DashboardStyles.buttonText}>Add Subject</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={DashboardStyles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
