import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, TextInput, StyleSheet } from 'react-native';
import StudentStyles from '../Styles/StudentStyles';
import DashboardStyles from '../Styles/DashboardStyles';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TeacherSidebar from '../components/TeacherSidebar';
export default function Student() {
  const [isOpen, setIsOpen] = useState(false);
  const [students, setStudents] = useState([
    { name: 'Harry', image: 'https://example.com/harry.png' },
    { name: 'Cathy', image: 'https://example.com/cathy.png' },
    { name: 'Deanne', image: 'https://example.com/deanne.png' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentImage, setNewStudentImage] = useState('');

  const navigation = useNavigation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleAddStudent = () => {
    setIsModalVisible(true); // Open the modal
  };

  const submitNewStudent = () => {
    if (newStudentName.trim() && newStudentImage.trim()) {
      // Add new student to the list
      setStudents([...students, { name: newStudentName, image: newStudentImage }]);
      setNewStudentName(''); // Clear input
      setNewStudentImage(''); // Clear input
      setIsModalVisible(false); // Close the modal
    } else {
      alert('Please fill in all fields!');
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#A8D98A' }}>
<TeacherSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} navigation={navigation} />


      {/* Main Content */}
      <View style={StudentStyles.container}>
        <Text style={StudentStyles.title}>STUDENTS</Text>
        <TouchableOpacity style={StudentStyles.addButton} onPress={handleAddStudent}>
          <Text style={StudentStyles.addButtonText}>ADD STUDENTS</Text>
        </TouchableOpacity>

        {/* Student Grid */}
        <View style={StudentStyles.studentGrid}>
          {students.map((student, index) => (
            <View key={index} style={StudentStyles.studentCard}>
              <Image source={{ uri: student.image }} style={StudentStyles.studentImage} />
              <Text style={StudentStyles.studentName}>{student.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Modal for Adding Students */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={StudentStyles.modalContainer}>
          <View style={StudentStyles.modalContent}>
            <Text style={StudentStyles.modalTitle}>Add a New Student</Text>
            <TextInput
              style={StudentStyles.input}
              placeholder="Student Name"
              value={newStudentName}
              onChangeText={setNewStudentName}
            />
            <TextInput
              style={StudentStyles.input}
              placeholder="Image URL"
              value={newStudentImage}
              onChangeText={setNewStudentImage}
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
    </View>
  );
}
