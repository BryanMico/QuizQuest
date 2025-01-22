import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import DashboardStyles from '../Styles/DashboardStyles'; // Adjust path based on your file structure
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the desired icon set

const initialSubjects = [
  { name: 'English', icon: 'book' },
  { name: 'Math', icon: 'calculate' },
  { name: 'History', icon: 'flag' },
];

export default function TeacherDashboard() {
  const navigation = useNavigation(); // Get the navigation object
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [subjectName, setSubjectName] = useState(''); // State to manage input field
  const [subjects, setSubjects] = useState(initialSubjects); // State to manage the list of subjects

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar open/closed
  };

  const handleAddSubject = () => {
    if (subjectName.trim()) {
      setSubjects([...subjects, { name: subjectName, icon: 'book' }]); // Add new subject to the list
      setSubjectName(''); // Clear the input field
      setModalVisible(false); // Close the modal
    } else {
      alert("Please enter a subject name"); // Alert if the input is empty
    }
  };

  const handleSubjectPress = (subject) => {
    navigation.navigate('Quiz', { subject }); // Navigate to Quiz with the subject
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row' ,backgroundColor: '#A8D98A',}}>
      {/* Hamburger icon to toggle sidebar */}
      <View style={{ zIndex: 20 }}>
        <TouchableOpacity onPress={toggleSidebar} style={{ padding: 10 }}>
          <Icon name="menu" size={30}/>
        </TouchableOpacity>
      </View>

      {/* Sidebar */}
      {isOpen && (
        <View
          style={[
            DashboardStyles.sidebar,
            { position: 'absolute', top: 0, left: 0, height: '100%', zIndex: 10 },
          ]}
        >
          <Image
            source={{ uri: 'https://example.com/student-image.jpg' }} // Replace with your image URL
            style={DashboardStyles.image}
          />
          <Text style={DashboardStyles.teacherName}>Student Name</Text>

          {/* Adjust menu items to have limited width */}
          <TouchableOpacity style={[DashboardStyles.menuItem, { width: '80%' }]}>
            <Text style={DashboardStyles.menuText}>
              <Icon name="book" size={20} color="#333" /> Subjects
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[DashboardStyles.menuItem, { width: '80%' }]}>
            <Text style={DashboardStyles.menuText}>
              <Icon name="people" size={20} color="#333" /> Students
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[DashboardStyles.menuItem, { width: '80%' }]}>
            <Text style={DashboardStyles.menuText}>
              <Icon name="emoji-events" size={20} color="#333" /> Rewards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[DashboardStyles.logoutButton, { width: '80%' }]}>
            <Text style={DashboardStyles.menuText}>
              <Icon name="logout" size={20} color="#333" /> Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Dashboard */}
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

        {/* Subject Grid */}
        <View style={DashboardStyles.subjectGrid}>
          {subjects.map((subject, index) => (
            <TouchableOpacity
              key={index}
              style={DashboardStyles.subjectItem}
              onPress={() => handleSubjectPress(subject.name)} // Pass subject name on press
            >
              <Icon name={subject.icon} size={40} />
              <Text>{subject.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

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
            <FlatList
              data={initialSubjects}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSubjectName(item.name)}>
                  <View style={DashboardStyles.subjectOption}>
                    <Icon name={item.icon} size={20} color="#333" />
                    <Text style={DashboardStyles.subjectText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.name}
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
  );
}
