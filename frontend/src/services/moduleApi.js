import { baseUrl, getToken } from "../services/config";

// Get Child Modules API
// export const getModuleApi = async () => {
//   try {
//     const token = getToken(); 

//     const response = await fetch(`${baseUrl}/modules/child`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`, 
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//     });

//     if (response.status === 401) {
    
//       localStorage.removeItem('token');
//       throw new Error('Session expired. Please login again.');
//     }

//     if (!response.ok) {
//       throw new Error(`Failed to fetch modules: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching modules', error);
//     throw error;
//   }
// };

export const getModuleApi = async () => {
  try {
    const response = await fetch('http://localhost:5000/modules/child', {
      // Remove this line if you don't need credentials
      // credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch modules');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching modules', error);
    throw error;
  }
};