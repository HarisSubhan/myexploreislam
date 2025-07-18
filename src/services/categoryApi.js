import { baseUrl } from "../services/config";

export const createCategoryApi = async (categoryData) => {
    try {
      const response = await fetch(`${baseUrl}/api/Category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating category', error);
      throw error;
    }
  };


export const getCategoriesApi = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/Category`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories', error);
    throw error;
  }
};


export const getCategoryByIdApi = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/Category/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch category with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category with ID ${id}`, error);
    throw error;
  }
};


// Update
export const updateCategoryApi = async (id, categoryData) => {
  try {
    const response = await fetch(`${baseUrl}/api/Category/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update category with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating category with ID ${id}`, error);
    throw error;
  }
};

// Delete
export const deleteCategoryApi = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/Category/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete category with ID ${id}`);
    }
    return true; // or return response.json() if your API returns data
  } catch (error) {
    console.error(`Error deleting category with ID ${id}`, error);
    throw error;
  }
};