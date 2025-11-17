// src/components/child/ModuleIntroductionPage2.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ModuleIntroductionPage2 = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          📘 Module Introduction - Page 2
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Here’s the next part of your learning journey. Let’s explore more
          details.
        </p>
        <div className="flex justify-between">
          <button
            onClick={() => navigate(`/module/series/${id}/introduction`)}
            className="bg-gray-400 text-white px-6 py-2 rounded-xl hover:bg-gray-500 transition"
          >
            ← Back
          </button>
          <button
            onClick={() => alert("Go to Page 3 or Start Module Lessons")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleIntroductionPage2;
