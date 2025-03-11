import axios from 'axios';

const API_URL = 'http://localhost:5000/api/';

//Create Teacher
export const createTeacher = async (teacherData) => {
  try {
    const response = await axios.post(`${API_URL}create/teacher`, teacherData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to create teacher.'
    );
  }
};

// Update Teacher
export const updateTeacher = async (id, teacherData) => {
  try {
    const response = await axios.put(`${API_URL}update/teacher/${id}`, teacherData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update teacher.'
    );
  }
};

//Get All Teachers
export const getAllTeachers = async () => {
  try {
    const response = await axios.get(`${API_URL}get/teachers`);
    return response.data.teachers;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch teachers.'
    );
  }
};

//Remove
export const removeTeacher = async (id) => {
  try {
      const response = await axios.delete(`${API_URL}delete/teacher/${id}`);
      console.log(response.data.message); // Success message
  } catch (error) {
      console.error('Error removing teacher:', error.response?.data?.message || error.message);
  }
};
