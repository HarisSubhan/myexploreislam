
import axios from "axios";

// https://myexploreislam.vercel.app/
// http://localhost:5173/

const baseUrl = 'http://localhost:5173';


export const LoginApi = async (data) => {
  const res = await axios.post(`${baseUrl}/api/auth/login`, data);
  return res;
};


export const addChild = async (childData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You are not logged in. Please log in first.");
  }

  const response = await axios.post(`${BASE_URL}/add-child`, childData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


