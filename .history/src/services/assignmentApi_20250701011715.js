import { baseUrl, getToken } from "../";

export const uploadAssignment = async (formData) => {
  const token = getToken();

  if (!token) throw new Error("Not authorized");

  try {
    const response = await fetch(`${baseUrl}/api/assignments/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Upload failed");
    }

    return result;
  } catch (error) {
    throw error;
  }
};
