export const baseUrl =
  // import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  import.meta.env.VITE_API_BASE_URL || "https://myexploreislam.com";


export const getToken = () => localStorage.getItem("token");


  