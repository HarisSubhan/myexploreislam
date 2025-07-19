
import axios from "axios";

// https://myexploreislam.vercel.app/
// http://localhost:5000/

const baseUrl = 'http://localhost:5000';


export const LoginApi = async (data) => {
  const res = await axios.post(`${baseUrl}/api/auth/login`, data);
  // Ensure your API returns user data in this format
  return {
    ...res,
    data: {
      success: true,
      user: {
        name: res.data.name, // or whatever field your API returns
        email: res.data.email,
        avatar: res.data.avatar, // if available
      },
    },
  };
};

export const RegisterApi = async (data) => {
  const res = await axios.post(`${baseUrl}/api/auth/register`, data);
  return res.data;
};

// export const fetchUserData = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) throw new Error("Not logged in");

//   const res = await axios.get(`${baseUrl}/api/user`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res;
// };




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







