import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './apiConfig';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Determine if SecureStore is available
const isSecureStoreAvailable = async () => {
  if (Platform.OS === 'web') return false;
  
  try {
    await SecureStore.getItemAsync('test');
    return true;
  } catch (error) {
    return false;
  }
};

// Storage wrapper that falls back to AsyncStorage if SecureStore isn't available
const secureStorage = {
  setItem: async (key, value) => {
    try {
      if (await isSecureStoreAvailable()) {
        await SecureStore.setItemAsync(key, value);
      } else {
        await AsyncStorage.setItem(`secure_${key}`, value);
      }
    } catch (error) {
      // Fallback to AsyncStorage if SecureStore fails
      await AsyncStorage.setItem(`secure_${key}`, value);
    }
  },
  
  getItem: async (key) => {
    try {
      if (await isSecureStoreAvailable()) {
        return await SecureStore.getItemAsync(key);
      } else {
        return await AsyncStorage.getItem(`secure_${key}`);
      }
    } catch (error) {
      // Fallback to AsyncStorage if SecureStore fails
      return await AsyncStorage.getItem(`secure_${key}`);
    }
  },
  
  removeItem: async (key) => {
    try {
      if (await isSecureStoreAvailable()) {
        await SecureStore.deleteItemAsync(key);
      } 
      // Always try to remove from AsyncStorage as well in case it was stored there
      await AsyncStorage.removeItem(`secure_${key}`);
    } catch (error) {
      await AsyncStorage.removeItem(`secure_${key}`);
    }
  }
};

// Login Function with fallback storage
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        
        // Store sensitive data using our storage wrapper
        if (response.data.token) {
            await secureStorage.setItem('authToken', response.data.token);
        }
        
        if (response.data.user) {
            await secureStorage.setItem('userId', response.data.user.id);
            await secureStorage.setItem('userRole', response.data.user.role);
            
            // Keep AsyncStorage keys for backward compatibility
            if (response.data.user.role === 'Teacher') {
                await AsyncStorage.setItem('teacherId', response.data.user.id);
            } else if (response.data.user.role === 'Admin') {
                await AsyncStorage.setItem('adminId', response.data.user.id);
            } else if (response.data.user.role === 'Student') {
                await AsyncStorage.setItem('studentId', response.data.user.id);
            }
        }
        
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network Error' };
    }
};

// Logout Function with fallback storage cleanup
export const logout = async () => {
    try {
        await axios.post(`${API_URL}/logout`);
        
        // Clear AsyncStorage
        await AsyncStorage.removeItem('teacherId');
        await AsyncStorage.removeItem('studentId');
        await AsyncStorage.removeItem('adminId');
        
        // Clear secure storage
        await secureStorage.removeItem('authToken');
        await secureStorage.removeItem('userId');
        await secureStorage.removeItem('userRole');

        return { message: 'Logged out successfully.' };
    } catch (error) {
        await AsyncStorage.multiRemove(['teacherId', 'studentId', 'adminId']);
        await secureStorage.removeItem('authToken');
        await secureStorage.removeItem('userId');
        await secureStorage.removeItem('userRole');
        
        throw error.response?.data || { message: 'Network Error' };
    }
};

// Helper function to create secure API requests
export const secureApiRequest = async (method, endpoint, data = null) => {
    try {
        const token = await secureStorage.getItem('authToken');
        const config = {
            method,
            url: `${API_URL}${endpoint}`,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            data: method !== 'GET' ? data : undefined,
            params: method === 'GET' ? data : undefined,
        };
        
        const response = await axios(config);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network Error' };
    }
};