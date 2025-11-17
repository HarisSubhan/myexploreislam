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


// Add this to your existing seriesApi.js
export const getSeriesVideosApi = async (seriesId) => {
  const token = getToken();
  const response = await fetch(`${baseUrl}/api/series/${seriesId}/videos`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch series videos");
  }
  return response.json();
};

