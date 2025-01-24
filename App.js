import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import MainLogin from './screens/MainLogin';
import QuizQuestLogin from './screens/QuizQuestLogin';
import AdminLogin from './screens/AdminLogin';
import StudentDashboard from './screens/StudentDashboard';
import TeacherDashboard from './screens/TeacherDashboard';
import AdminDashboard from './screens/AdminDashboard';
import Quiz from './screens/Quiz';
import StudentQuiz from './screens/StudentQuiz';
import Student from './screens/Student';
import StudentRewards from './screens/StudentRewards';
import TeacherRewards from './screens/TeacherRewards';


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
        <Stack.Screen name="Student" component={Student}/>
        <Stack.Screen name="StudentRewards" component={StudentRewards}/>
        <Stack.Screen name="TeacherRewards" component={TeacherRewards}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

