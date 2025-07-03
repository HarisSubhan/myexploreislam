
import axios from "axios";

// https://myexploreislam.vercel.app/
// http://localhost:5000/

const baseUrl = 'http://localhost:5000';


export const LoginApi = async (data) => {
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



export const getCategoriesApi = () => axios.get(`${baseUrl}/api/Category`);
export const addCategoryApi = (name) => axios.post(`${baseUrl}/api/Category`, { name });
export const updateCategoryApi = (id, name) =>
  axios.put(`${baseUrl}/api/Category/${id}`, { name });
export const deleteCategoryApi = (id) =>
  axios.delete(`${baseUrl}/api/Category/${id}`);


// export const uploadAssignment = async (formData, token) => {
//   try {
//     const response = await fetch("http://localhost:5000/api/assignments/", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.error || "Upload failed");
//     }

//     return result;
//   } catch (error) {
//     throw error;
//   }
// };






