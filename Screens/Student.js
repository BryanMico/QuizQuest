import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import StudentStyles from '../Styles/StudentStyles';
import { useNavigation } from '@react-navigation/native';
import TeacherSidebar from '../components/TeacherSidebar';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api/students'; // Backend endpoint

export default function Student() {
  const [isOpen, setIsOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(BACKEND_URL);
      setStudents(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to fetch students.');
      setIsLoading(false);
    }
  };

  // Create a new student
  const submitNewStudent = async () => {
    if (!newStudentName || !newStudentEmail || !newStudentPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(BACKEND_URL, {
        name: newStudentName,
        email: newStudentEmail,
        password: newStudentPassword,
      });

      setStudents([...students, response.data.student]);
      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentPassword('');
      setIsModalVisible(false);
      Alert.alert('Success', 'Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('Error', 'Failed to add student.');
    }
  };

  // Update a student
  const updateStudent = async () => {
    if (!selectedStudent || !selectedStudent.name || !selectedStudent.email || !selectedStudent.password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.put(`${BACKEND_URL}/${selectedStudent._id}`, {
        name: selectedStudent.name,
        email: selectedStudent.email,
        password: selectedStudent.password, // Ensure password is updated
      });

      const updatedStudents = students.map((student) =>
        student._id === selectedStudent._id ? response.data.student : student
      );

      setStudents(updatedStudents);
      setSelectedStudent(null);
      setEditModalVisible(false);
      Alert.alert('Success', 'Student updated successfully!');
    } catch (error) {
      console.error('Error updating student:', error);
      Alert.alert('Error', 'Failed to update student.');
    }
  };

  // Delete a student
  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/${id}`);
      setStudents(students.filter((student) => student._id !== id));
      Alert.alert('Success', 'Student deleted successfully!');
    } catch (error) {
      console.error('Error deleting student:', error);
      Alert.alert('Error', 'Failed to delete student.');
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#A8D98A' }}>
      <TeacherSidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} navigation={navigation} />

      {/* Main Content */}
      <View style={StudentStyles.container}>
        <Text style={StudentStyles.title}>STUDENTS</Text>

        {/* Add Student Button */}
        <TouchableOpacity style={StudentStyles.addButton} onPress={() => setIsModalVisible(true)}>
          <Text style={StudentStyles.addButtonText}>ADD STUDENTS</Text>
        </TouchableOpacity>

        {/* Student List */}
        <ScrollView>
          <View style={StudentStyles.studentGrid}>
            {students.map((student) => (
              <View key={student._id} style={StudentStyles.studentCard}>
                <Text style={StudentStyles.studentName}>{student.name}</Text>
                <Text style={StudentStyles.studentEmail}>{student.email}</Text>
                <TouchableOpacity
                  style={StudentStyles.editButton}
                  onPress={() => {
                    setSelectedStudent(student);
                    setEditModalVisible(true);
                  }}
                >
                  <Text style={StudentStyles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={StudentStyles.deleteButton}
                  onPress={() => deleteStudent(student._id)}
                >
                  <Text style={StudentStyles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Add Student Modal */}
      <Modal transparent={true} animationType="slide" visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View style={StudentStyles.modalContainer}>
          <View style={StudentStyles.modalContent}>
            <Text style={StudentStyles.modalTitle}>Add a New Student</Text>
            <TextInput
              style={StudentStyles.input}
              placeholder="Name"
              value={newStudentName}
              onChangeText={setNewStudentName}
            />
            <TextInput
              style={StudentStyles.input}
              placeholder="Email"
              value={newStudentEmail}
              onChangeText={setNewStudentEmail}
            />
            <TextInput
              style={StudentStyles.input}
              placeholder="Password"
              value={newStudentPassword}
              secureTextEntry
              onChangeText={setNewStudentPassword}
            />
            <TouchableOpacity style={StudentStyles.addButton} onPress={submitNewStudent}>
              <Text style={StudentStyles.addButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={StudentStyles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={StudentStyles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Student Modal */}
      <Modal transparent={true} animationType="slide" visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
        <View style={StudentStyles.modalContainer}>
          <View style={StudentStyles.modalContent}>
            <Text style={StudentStyles.modalTitle}>Edit Student</Text>
            <TextInput
              style={StudentStyles.input}
              placeholder="Name"
              value={selectedStudent?.name || ''}
              onChangeText={(text) => setSelectedStudent({ ...selectedStudent, name: text })}
            />
            <TextInput
              style={StudentStyles.input}
              placeholder="Email"
              value={selectedStudent?.email || ''}
              onChangeText={(text) => setSelectedStudent({ ...selectedStudent, email: text })}
            />
            <TextInput
              style={StudentStyles.input}
              placeholder="Password"
              value={selectedStudent?.password || ''}
              secureTextEntry
              onChangeText={(text) => setSelectedStudent({ ...selectedStudent, password: text })}
            />
            <TouchableOpacity style={StudentStyles.addButton} onPress={updateStudent}>
              <Text style={StudentStyles.addButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={StudentStyles.closeButton} onPress={() => setEditModalVisible(false)}>
              <Text style={StudentStyles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
