
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// https://myexploreislam.vercel.app/
// http://localhost:5173/

const baseUrl = 'http://localhost:5000';


export const LoginApi = async (data) => {
  const res = await axios.post(`${baseUrl}/api/auth/login`, data);
  return res;
};

export const addChildApi = async (ata) => {
  const token = cookies.get("token");

  const res = await axios.post(`${baseUrl}/api/parent/add-child`, childData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true, // in case you're using cookie-based JWT validation
  });

  return res;
};



