import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ModulePage2 = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleNext = () => {
    navigate(`/child/module/series/${id}/page3`);
  };

  const handleBack = () => {
    navigate(`//module/series/${id}/page1`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-green-200 px-6 py-8">
      <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          🌱 Page 2: Growing Your Knowledge
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 p-4 rounded-xl">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              Interactive Example
            </h3>
            <p className="text-gray-700">
              See how these concepts work in practice with this interactive
              demonstration.
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl">
            <h3 className="text-xl font-semibold text-yellow-700 mb-3">
              Quick Tip
            </h3>
            <p className="text-gray-700">
              Remember to take notes as you go through each section!
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Deeper Understanding
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Now that you understand the basics, let's explore how these concepts
            connect and build upon each other. You'll see patterns and
            relationships that make the knowledge more meaningful.
          </p>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-xl shadow hover:bg-gray-400 transition"
          >
            ⬅ Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModulePage2;
