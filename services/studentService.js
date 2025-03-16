import axios from 'axios';
import { API_URL } from './apiConfig';

// Get Teacher Info
export const getStudentInfo = async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/get/student/${studentId}`);
      return response.data.student;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch student info.'
      );
    }
  };