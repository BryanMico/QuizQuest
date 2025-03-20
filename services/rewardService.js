import axios from 'axios';
import { API_URL } from './apiConfig';

export const createReward = async (rewardData) => {
    try {
        const response = await axios.post(`${API_URL}/create/reward`, rewardData);
        return response.data; 
    } catch (error) {
        throw error.response ? error.response.data : { error: "Network error. Please try again." };
    }
};

export const getAllRewards = async (teacherId) => {
    try {
        const response = await axios.get(`${API_URL}/rewards/${teacherId}`);
        return response.data;


    } catch (error) {
        throw error.response ? error.response.data : { error: "Network error. Please try again." };



    }
}
export const removeReward = async (rewardId) => {
    try {
        const response = await axios.delete(`${API_URL}/rewards/${rewardId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { error: "Network error. Please try again." };
    }
};

export const editReward = async (rewardId, rewardData) => {
    try {
        const response = await axios.put(`${API_URL}/rewards/${rewardId}`, rewardData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { error: "Network error. Please try again." };
    }
};

// New functions for buying rewards and tracking purchases

export const buyReward = async (studentId, rewardId, quantity = 1) => {
    try {
        const response = await axios.post(`${API_URL}/buy`, { 
            studentId, 
            rewardId,
            quantity 
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { error: "Network error. Please try again." };
    }
};

export const getStudentPurchasedRewards = async (studentId) => {
    try {
        const response = await axios.get(`${API_URL}/purchased/student/${studentId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { error: "Network error. Please try again." };
    }
};

export const getTeacherStudentsPurchasedRewards = async (teacherId) => {
    try {
        const response = await axios.get(`${API_URL}/purchased/teacher/${teacherId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { error: "Network error. Please try again." };
    }
};

export const fulfillReward = async (purchaseId) => {
    try {
        const response = await axios.put(`${API_URL}/fulfill/${purchaseId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { error: "Network error. Please try again." };
    }
};