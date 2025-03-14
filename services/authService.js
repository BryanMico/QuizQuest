import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://localhost:5000/api'; 

// Login Function
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        return response.data; // Keep this simple since backend sends all required data
    } catch (error) {
        throw error.response?.data || { message: 'Network Error' };
    }
};


// Logout Function
export const logout = async () => {
    try {
        await axios.post(`${API_URL}/logout`);
        
        // Clear stored user data
        await AsyncStorage.removeItem('teacherId'); 
        await AsyncStorage.removeItem('studentId'); 
        await AsyncStorage.removeItem('adminId'); 

        return { message: 'Logged out successfully.' };
    } catch (error) {
        throw error.response?.data || { message: 'Network Error' };
    }
};
