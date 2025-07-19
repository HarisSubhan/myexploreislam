import axios from "axios";
import { baseUrl, getToken } from "../services/config";

export const addChild = async (childData) => {
  const token = getToken();

  if (!token) throw new Error("You are not logged in. Please log in first.");

  try {
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
  } catch (error) {
    throw error.response?.data || { message: "Failed to add child" };
  }
};
