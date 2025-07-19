
import axios from "axios";

// https://myexploreislam.vercel.app/
// http://localhost:5000/

const baseUrl = 'http://localhost:5000';


export const LoginApi = async (data) => {
  onst token = localStorage.getItem("token");
  if (@)
  const res = await axios.post(`${baseUrl}/api/auth/login`, data);
  return res;
};

export const RegisterApi = async (data) => {
  const res = await axios.post(`${baseUrl}/api/auth/register`, data);
  return res.data;
};


export const addChild = async (childData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You are not logged in. Please log in first.");
  }

  const response = await axios.post(
    `${baseUrl}/api/parent/add-child`,
    childData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};







