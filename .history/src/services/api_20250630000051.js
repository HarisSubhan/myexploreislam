import axios from "axios";

// https://myexploreislam.vercel.app/
// http://localhost:5173/

const baseUrl = "http://localhost:5173";

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
    const response = await api.post("/api/parent/add-child", childData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create child account";
    throw new Error(errorMessage);
  }
};

// You can add more child-related API functions here
export const childApi = {
  add: addChildApi,
  // get: getChildrenApi,
  // update: updateChildApi,
  // delete: deleteChildApi
};