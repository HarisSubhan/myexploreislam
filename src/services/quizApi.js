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
