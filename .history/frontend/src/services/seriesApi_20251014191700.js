import { baseUrl, getToken } from "../services/config";

export const getSeriesApi = async () => {
  const token = getToken();
  const response = await fetch(`${baseUrl}/api/series/child/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch modules");
  }
  return response.json();
};


export const getVideosBySeriesApi = async (seriesId) => {
  const token = getToken();
  const response = await fetch(`${baseUrl}/api/videos/series/${seriesId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch videos");
  }
  return response.json();
};