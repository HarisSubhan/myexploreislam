import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// ✅ Backend server URL, not the frontend
const baseUrl =
  import.meta.env.MODE === "production"
    ? "https://myexploreislam.vercel.app"
    : "http://localhost:5000";

// ⬇️ LOGIN API
export const LoginApi = async (data) => {
  const res = await axios.post(`${baseUrl}/api/auth/login`, data);

  // Save token in cookies if returned
  if (res.data.token) {
    cookies.set("token", res.data.token, {
      path: "/",
      sameSite: "Strict",
      secure: import.meta.env.MODE === "production",
    });
  }

  return res;
};

// ⬇️ ADD CHILD API (with token)
export const addChildApi = async (childData) => {
  const token = cookies.get("token");

  const res = await axios.post(`${baseUrl}/api/parent/add-child`, childData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true, // in case you're using cookie-based JWT validation
  });

  return res;
};
