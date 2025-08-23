import { baseUrl, getToken } from "../services/config";



export const getModuleApi = async () => {
  const token = getToken();
  const response = await fetch(`${baseUrl}/api/modules/child`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch modules');
  }
  return response.json();
};
