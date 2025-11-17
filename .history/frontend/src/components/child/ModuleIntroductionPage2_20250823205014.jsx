import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ModuleIntroductionPage2 = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleBack = () => {
    navigate(`/module/series/${id}/introduction`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-green-200 px-6">
      <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">📖 Page 2</h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          This is the second page of your module introduction. Let’s continue
          learning step by step!
        </p>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default ModuleIntroductionPage2;
