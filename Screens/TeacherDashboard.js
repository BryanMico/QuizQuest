import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import DashboardStyles from '../Styles/DashboardStyles'; // Adjust path based on your file structure
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the desired icon set

export default function TeacherDashboard() {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar open/closed
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Hamburger icon to toggle sidebar */}
    <View style={{zIndex: 20}}>
      <TouchableOpacity onPress={toggleSidebar} style={{ padding: 10, zIndex: 20 }}>
      <Icon name="menu" size={30} color="#000" />
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
        <TouchableOpacity style={DashboardStyles.addSubjectButton}>
          <Text style={DashboardStyles.buttonText}>Add Subject</Text>
        </TouchableOpacity>

        {/* Subject Grid */}
        <View style={DashboardStyles.subjectGrid}>
          <TouchableOpacity
            style={DashboardStyles.subjectItem}
            onPress={() => handleSubjectPress('English')}
          >
            <Icon name="book" size={40} />
            <Text>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={DashboardStyles.subjectItem}
            onPress={() => handleSubjectPress('Math')}
          >
            <Icon name="calculate" size={40} />
            <Text>Math</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={DashboardStyles.subjectItem}
            onPress={() => handleSubjectPress('History')}
          >
            <Icon name="flag" size={40} />
            <Text>History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
