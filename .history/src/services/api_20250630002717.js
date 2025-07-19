// src/services/api.js
import axios from "axios";
import Cookies from "universal-cookie";

// Use your production URL in production
const baseUrl =
  import.meta.env.MODE === "production"
    ? "https://myexploreislam.vercel.app"
    : "http://localhost:5000"; // ✅ API runs on port 5000

const cookies = new Cookies();

export const LoginApi = async (data) => {
  const res = await axios.post(`${baseUrl}/api/auth/login`, data);

  // Save token in cookies (if not handled by backend already)
  if (res.data.token) {
    cookies.set("token", res.data.token, {
      path: "/",
      sameSite: "Strict",
      secure: false, // set to true in production with HTTPS
    });
  }

  return res;
};

export const addChildApi = async (childData) => {
  const token = cookies.get("token");

  const res = await axios.post(`${baseUrl}/api/parent/add-child`, childData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};
