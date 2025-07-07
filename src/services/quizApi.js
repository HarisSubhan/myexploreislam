import axios from "axios";
import { baseUrl, getToken } from "../services/config";

export const createQuizApi = async (quizData) => {
  const token = getToken();

  const response = await axios.post(`${baseUrl}/api/quizzes`, quizData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getQuizApi = async () => {
  const token = getToken();

  const response = await axios.get(`${baseUrl}/api/quizzes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


export const getQuizByIdApi = async (id) => {
  const token = getToken();

  const response = await axios.get(`${baseUrl}/api/quizzes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Update a quiz by ID
export const updateQuizApi = async (id, updatedData) => {
  const token = getToken();

  const response = await axios.put(`${baseUrl}/api/quizzes/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Delete a quiz by ID
export const deleteQuizApi = async (id) => {
  const token = getToken();

  const response = await axios.delete(`${baseUrl}/api/quizzes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Submit a completed quiz (quiz result)
export const submitQuizApi = async (submissionData) => {
  const token = getToken();

  const response = await axios.post(`${baseUrl}/api/quiz-submissions/submit`, submissionData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
