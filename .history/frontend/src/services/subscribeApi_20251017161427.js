import axios from "axios";
import { baseUrl, getToken } from "../services/config";

export const getsubscriptionsAllActiveApi = async () => {
  const token = getToken();

  const response = await axios.get(`${baseUrl}/api/subscriptions/all_active`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getsubscriptionsAllActiveApi;
