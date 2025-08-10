import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

import 'react-native-gesture-handler';

import LoadingScreen from './screens/components/LoadingScreen';
import Login from './screens/auth/LoginScreen';
import AdminDashboard from './screens/admin/AdminDashboard';
import TeacherDashboardScreen from './screens/teacher/TeacherDashboardScreen';
import Students from './screens/teacher/Students';
import QuizScreen from './screens/teacher/QuizScreen';
import QuestScreen from './screens/teacher/QuestScreen';
import RewardScreen from './screens/teacher/RewardScreen';
import StudentDashboardScreen from './screens/student/StudentDashboardScreen';
import StudentsQuiz from './screens/student/StudentQuizScreen';
import StudentsRewards from './screens/student/StudentRewardScreen';
import StudentsQuest from './screens/student/StudentQuestScreen';
import StudentGameScreen from './screens/student/StudentGameScreen';
import CustomHeader from './screens/components/CustomHeader';
import SplashScreen from './screens/components/SplashScreen';

import { logout } from './services/authService';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LogoutScreen = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        Alert.alert('Success', 'You have been logged out.');
      } catch (error) {
        Alert.alert('Error', error.message || 'Logout failed.');
      } finally {
        setLoading(false);
        navigation.replace('Login');
      }
    };

    handleLogout();
  }, [navigation]);

  return <LoadingScreen visible={loading} />;
};

// Bottom Tab Navigator for Admin Dashboard
const AdminTabs = (navigation) => {
  return (
    <Tab.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{
        tabBarActiveTintColor: '#f2e8cf',
        tabBarInactiveTintColor: '#f2e8cf',
        tabBarStyle: { backgroundColor: '#386641' },
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{
          headerShown: true,
          tabBarLabel: 'Dashboard',
          header: () => <CustomHeader title="Administrator" navigation={navigation} />,
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarLabel: 'Logout',
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="logout" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Bottom Tab Navigator for Student Dashboard
const StudentTabs = ({ navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName="StudentDashboardScreen"
      screenOptions={{
        tabBarActiveTintColor: '#f2e8cf',
        tabBarInactiveTintColor: '#f2e8cf',
        tabBarStyle: { backgroundColor: '#386641' },

      }}
    >
      <Tab.Screen
        name="StudentDashboardScreen"
        component={StudentDashboardScreen}
        options={{
          title: 'Dashboard',
          headerShown: true,
          header: () => <CustomHeader title="Dashboard" navigation={navigation} />,
          tabBarIcon: ({ size, color }) => <MaterialIcons name="leaderboard" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="StudentQuizScreen"
        component={StudentsQuiz}
        options={{
          title: 'Quiz',
          headerShown: true,
          header: () => <CustomHeader title="Quiz" navigation={navigation} />,
          tabBarIcon: ({ size, color }) => <MaterialIcons name="quiz" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="StudentQuestScreen"
        component={StudentsQuest}
        options={{
          title: 'Quests',
          headerShown: true,
          header: () => <CustomHeader title="Quests" navigation={navigation} />,
          tabBarIcon: ({ size, color }) => <Fontisto name="map" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="StudentRewardScreen"
        component={StudentsRewards}
        options={{
          title: 'Rewards',
          headerShown: true,
          header: () => <CustomHeader title="Rewards" navigation={navigation} />,
          tabBarIcon: ({ size, color }) => <Entypo name="shop" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarLabel: 'Logout',
          headerShown: true,
          header: () => <CustomHeader title="Logout" navigation={navigation} />,
          tabBarIcon: ({ size, color }) => <MaterialIcons name="logout" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

// Bottom Tab Navigator for Teacher Dashboard
const TeacherTabs = (navigation) => {

  return (
    <Tab.Navigator
      initialRouteName="DashboardScreen"
      screenOptions={{
        tabBarActiveTintColor: '#f2e8cf',
        tabBarInactiveTintColor: '#f2e8cf',
        tabBarStyle: { backgroundColor: '#386641' },
      }}
    >
      <Tab.Screen
        name="DashboardScreen"
        component={TeacherDashboardScreen}
        options={{
          title: 'Dashboard',
          headerShown: true,
          header: () => <CustomHeader title="Dashboard" navigation={navigation} />,
          tabBarIcon: ({ size, color }) => <MaterialIcons name="leaderboard" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Students"
        component={Students}
        options={{
          title: 'Students',
          headerShown: true,
          header: () => <CustomHeader title="Students" navigation={navigation} />,
          tabBarIcon: ({ size, color }) => <Ionicons name="school" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="QuizScreen"
        component={QuizScreen}
        options={{
          title: 'Quiz',
          headerShown: true,
          header: () => <CustomHeader title="Quiz" navigation={navigation} />,
          tabBarIcon: ({ size, color }) => <MaterialIcons name="quiz" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="QuestScreen"
        component={QuestScreen}
        options={{
          title: 'Quests',
          headerShown: true,
          header: () => <CustomHeader title="Quests" navigation={navigation} />,
          tabBarIcon: ({ size, color }) => <Fontisto name="map" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="RewardScreen"
        component={RewardScreen}
        options={{
          title: 'Rewards',
          headerShown: true,
          header: () => <CustomHeader title="Rewards" navigation={navigation} />,
          tabBarIcon: ({ size, color }) => <Entypo name="shop" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarLabel: 'Logout',
          headerShown: true,
          header: () => <CustomHeader title="Logout" navigation={navigation} />,
          tabBarIcon: ({ size, color }) => <MaterialIcons name="logout" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Game" component={StudentGameScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
        <Stack.Screen name="TeacherTabs" component={TeacherTabs} options={{ headerShown: false }} />
        <Stack.Screen name="StudentTabs" component={StudentTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
