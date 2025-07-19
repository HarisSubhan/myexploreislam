import axios from "axios";
import { baseUrl } from "../services/config";


export const getCategoriesApi = () => axios.get(`${baseUrl}/api/Category`);

export const addCategoryApi = (name) =>
  axios.post(`${baseUrl}/api/Category`, { name });

export const updateCategoryApi = (id, name) =>
  axios.put(`${baseUrl}/api/Category/${id}`, { name });

export const deleteCategoryApi = (id) =>
  axios.delete(`${baseUrl}/api/Category/${id}`);
