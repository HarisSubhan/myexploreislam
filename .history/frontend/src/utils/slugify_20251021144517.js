// utils/slugify.js
export const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/[^\w\-]+/g, "") // Remove special chars
    .replace(/\-\-+/g, "-") // Multiple hyphens to single
    .replace(/^-+/, "") // Remove hyphens from start
    .replace(/-+$/, ""); // Remove hyphens from end
};
