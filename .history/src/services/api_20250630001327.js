import axios from "axios";

// https://myexploreislam.vercel.app/
// http://localhost:5173/

const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export const LoginApi = async (data) => {
  const res = await axios.post(`${baseUrl}/api/auth/login`, data);
  return res;
};

// export const addChildApi = async (data) =>{
//   const res = await axios.post(`${baseUrl}/api/parent/add-child`, data);
//   return res;
// }

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const addChildApi = async (childData) => {
  try {
    const response = await api.post("/api/parent/add-child", {
      name: childData.childName,
      email: childData.email,
      password: childData.password,
      phoneNumber: childData.phone,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle specific backend error messages
      const serverMessage =
        error.response.data?.error || error.response.data?.message;
      if (error.response.status === 401) {
        throw new Error(
          serverMessage || "Authentication failed. Please login again."
        );
      } else if (error.response.status === 400) {
        throw new Error(serverMessage || "Child limit reached.");
      }
      throw new Error(serverMessage || "Request failed. Please try again.");
    }
    throw new Error(
      error.message || "Network error. Please check your connection."
    );
  }
};