import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Adjust the import according to your icon library
import DashboardStyles from '../Styles/DashboardStyles';

const TeacherSidebar = ({ isOpen, toggleSidebar, navigation }) => {
  return (
    <>
      <View style={{ zIndex: 20 }}>
        <TouchableOpacity onPress={toggleSidebar} style={{ padding: 10 }}>
          <Icon name="menu" size={30} />
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
          <Text style={DashboardStyles.teacherName}>Teacher Name</Text>

          {/* Adjust menu items to have limited width */}
          <MenuItem
            icon="book"
            text="Subjects"
            onPress={() => navigation.navigate('TeacherDashboard')}
          />
          <MenuItem
            icon="people"
            text="Students"
            onPress={() => navigation.navigate('Student')}
          />
          <MenuItem
            icon="emoji-events"
            text="Rewards"
            onPress={() => navigation.navigate('TeacherRewards')}
          />
          <MenuItem
            icon="logout"
            text="Logout"
            onPress={() => navigation.navigate('MainLogin')}
            style={DashboardStyles.logoutButton}
          />
        </View>
      )}
    </>
  );
};

const MenuItem = ({ icon, text, onPress, style }) => {
  return (
    <TouchableOpacity style={[DashboardStyles.menuItem, { width: '80%' }, style]} onPress={onPress}>
      <Text style={DashboardStyles.menuText}>
        <Icon name={icon} size={20} color="#333" /> {text}
      </Text>
    </TouchableOpacity>
  );
};

export default TeacherSidebar;
