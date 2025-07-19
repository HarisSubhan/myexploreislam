import axios from "axios";
import { baseUrl } from "../services/config";


export const LoginApi = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/api/auth/login`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const RegisterApi = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/api/auth/register`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};
