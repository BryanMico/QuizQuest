import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

// Login Function
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password
        });

        return response.data; 
    } catch (error) {
        throw error.response?.data || { message: 'Network Error' };
    }
};

// Logout Function
export const logout = async () => {
    try {
        await axios.post(`${API_URL}/logout`);
        return { message: 'Logged out successfully.' };
    } catch (error) {
        throw error.response?.data || { message: 'Network Error' };
    }
};
