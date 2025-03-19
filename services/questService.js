import axios from 'axios';
import { API_URL } from './apiConfig';

export const getTeacherQuests = async (teacherId) => {
    try {
        // Changed to match your actual route definition
        const response = await axios.get(`${API_URL}/quests/teacher/${teacherId}`);
        return response;
    } catch (error) {
        console.error('Error fetching quests:', error);
        throw error.response?.data || { message: 'Failed to fetch quests.' };
    }
};

// Modified createQuest function
export const createQuest = async (questData) => {
    try {
        const response = await axios.post(`${API_URL}/quests`, questData);
        return response;
    } catch (error) {
        console.error('Error creating quest:', error);
        throw error.response?.data || { message: 'Failed to create quest.' };
    }
};
// Update Quest
export const updateQuest = async (questId, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/quests/${questId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating quest:', error);
        throw error.response?.data || { message: 'Failed to update quest.' };
    }
};

// Delete Quest
export const deleteQuest = async (questId) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/quests/${questId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting quest:', error);
        throw error.response?.data || { message: 'Failed to delete quest.' };
    }
};
// Change Quest Status (Active/Archived)
export const changeQuestStatus = async (questId, status) => {
    try {
        const response = await axios.put(`${API_URL}/${questId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Error changing quest status:', error);
        throw error.response?.data || { message: 'Failed to change quest status.' };
    }
};

// Get Active Quests for Student
export const getActiveQuestsForStudent = async (studentId, teacherId) => {
    try {
        const response = await axios.get(`${API_URL}/quests/student/${studentId}/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student quests:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch quests for student.'
        };
    }
};

export const completeQuest = async (questId, studentId) => {
    try {
        console.log(`Attempting to complete quest ${questId} for student ${studentId}`);
        const response = await axios.post(`${API_URL}/${questId}/complete`, {
            studentId
        });

        console.log('Complete quest response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error details for complete quest:', error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to complete quest'
        };
    }
};
// Get Student's Quest Progress
export const getStudentQuestProgress = async (studentId) => {
    try {
        console.log('Fetching progress for student:', studentId);
        const response = await axios.get(`${API_URL}/progress/${studentId}`);
        console.log('Progress response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error details:', error.response || error.message);
        throw new Error(error.response?.data?.message || 'Failed to retrieve quest progress');
    }
};
// Get Quest by ID
export const getQuestById = async (questId) => {
    try {
        const response = await axios.get(`${API_URL}/quests/${questId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching quest:', error);
        throw error.response?.data || { message: 'Failed to fetch quest.' };
    }
};

// Get All Quests
export const getAllQuests = async () => {
    try {
        const response = await axios.get(`${API_URL}/quests`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all quests:', error);
        throw error.response?.data || { message: 'Failed to fetch quests.' };
    }
};