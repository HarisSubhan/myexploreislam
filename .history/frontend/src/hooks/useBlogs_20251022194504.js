// src/hooks/useBlogs.js
import { useState, useEffect } from "react";


export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogApi.getLatestBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    error,
    refetch: fetchBlogs,
  };
};

export const useBlog = (id) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlog = async (blogId) => {
    if (!blogId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await blogApi.getBlogById(blogId);
      setBlog(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog(id);
  }, [id]);

  return {
    blog,
    loading,
    error,
    refetch: () => fetchBlog(id),
  };
};
