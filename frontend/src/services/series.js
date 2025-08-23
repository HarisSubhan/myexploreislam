import { baseUrl } from "../services/config";

export const getSeriesApi = async () => {
  try {
    const response = await fetch(`${baseUrl}api/series/child/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch Series');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Series', error);
    throw error;
  }
};