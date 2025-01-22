import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import MainLogin from './Screens/MainLogin';
import QuizQuestLogin from './Screens/QuizQuestLogin';
import AdminLogin from './Screens/AdminLogin';
import StudentDashboard from './Screens/StudentDashboard';
import TeacherDashboard from './Screens/TeacherDashboard';
import AdminDashboard from './Screens/AdminDashboard';
import Quiz from './Screens/Quiz';
import StudentQuiz from './Screens/StudentQuiz';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainLogin"  screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainLogin" component={MainLogin} />
        <Stack.Screen name="QuizQuestLogin" component={QuizQuestLogin} />
        <Stack.Screen name="AdminLogin" component={AdminLogin} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="Quiz" component={Quiz}/>
        <Stack.Screen name="StudentQuiz" component={StudentQuiz}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

