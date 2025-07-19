
import axios from "axios";
import { addChildApi } from '.';

// https://myexploreislam.vercel.app/
// http://localhost:5173/

const baseUrl = 'http://localhost:5173';


export const LoginApi = async (data) => {
  const res = await axios.post(`${baseUrl}/api/auth/login`, data);
  return res;
};

export const addChildApi = async (data) => {
  const res = await axios.post(`${baseUrl},api/parent/add-child`, data);
  return res;
};



