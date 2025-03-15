import axios from 'axios';
import { API_URL } from './apiConfig';


// Get Teacher Info
export const getTeacherInfo = async (teacherId) => {
  try {
    const response = await axios.get(`${API_URL}/get/teacher/${teacherId}`);
    return response.data.teacher; // Return only the teacher info
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch teacher info.'
    );
  }
};

//Create Student
export const createStudent = async (studentData, teacherId) => {
  try {
    const response = await axios.post(`${API_URL}/create/student`, {
      ...studentData,
      teacherId, 
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to create Student.'
    );
  }
};

// Remove Student
export const removeStudent = async (studentId) => {
  try {
    const response = await axios.delete(`${API_URL}/remove/student/${studentId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to remove student.'
    );
  }
};



// Update Student
export const updateStudent = async (id, studentData) => {
  try {
    const response = await axios.put(`${API_URL}/update/student/${id}`, studentData);
    return response.data; 
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update student.'
    );
  }
};


// Get All Students
export const getAllStudents = async (teacherId) => {
  try {
    const response = await axios.get(`${API_URL}/get/students/${teacherId}`);
    return response.data.students; // Return only the students array
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch students.'
    );
  }
};

