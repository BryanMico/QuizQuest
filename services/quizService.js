import axios from 'axios';
import { API_URL } from './apiConfig';

//  Create Quiz
export const createQuiz = async (quizData) => {
    try {
        const response = await axios.post(`${API_URL}/create/Quiz`, quizData);
        return response.data;
    } catch (error) {
        console.error('Error creating quiz:', error);
        throw error.response?.data || { message: 'Failed to create quiz.' };
    }
};

//  Get All Quizzes by Teacher
export const getQuizzesByTeacher = async (teacherId) => {
    try {
        const response = await axios.get(`${API_URL}/get/Quiz/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error.response?.data || { message: 'Failed to fetch quizzes.' };
    }
};

//  Get a Single Quiz by ID
export const getQuizById = async (quizId) => {
    try {
        const response = await axios.get(`${API_URL}/get/Quiz/${quizId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error.response?.data || { message: 'Failed to fetch quiz.' };
    }
};

//  Update Quiz
export const updateQuiz = async (quizId, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/update/Quiz/${quizId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating quiz:', error);
        throw error.response?.data || { message: 'Failed to update quiz.' };
    }
};

//  Delete Quiz
export const deleteQuiz = async (quizId) => {
    try {
        const response = await axios.delete(`${API_URL}/remove/Quiz/${quizId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting quiz:', error);
        throw error.response?.data || { message: 'Failed to delete quiz.' };
    }
};

//  Answer Quiz
export const answerQuiz = async (quizId, answerData) => {
    try {
        const response = await axios.post(`${API_URL}/${quizId}/answer`, answerData);
        return response.data;
    } catch (error) {
        console.error('Error answering quiz:', error);
        throw error.response?.data || { message: 'Failed to submit answers.' };
    }
};
