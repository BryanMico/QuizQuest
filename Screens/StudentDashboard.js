import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import DashboardStyles from '../Styles/DashboardStyles'; // Adjust path based on your file structure
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the desired icon set
import StudentSidebar from '../components/StudentSidebar';

export default function StudentDashboard({ navigation }) { // Ensure navigation prop is received
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar open/closed
  };

  const handleSubjectPress = (subject) => {
    navigation.navigate('StudentQuiz', { subject }); // Navigate to Quiz with the subject
  };

  // Define an array of subjects
  const subjects = [
    { name: 'English', icon: 'book' },
    { name: 'Math', icon: 'calculate' },
    { name: 'History', icon: 'flag' },
  ];

  return (
    <View style={{ flex: 1, flexDirection: 'row',backgroundColor: '#A8D98A',}}>
      {/* Hamburger icon to toggle sidebar */}
      <StudentSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} navigation={navigation} />

      <View style={DashboardStyles.container}>
        <Text style={DashboardStyles.dashboardTitle}>
          <Icon name="dashboard" size={24} /> Dashboard
        </Text>
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
    </View>
  );
}
