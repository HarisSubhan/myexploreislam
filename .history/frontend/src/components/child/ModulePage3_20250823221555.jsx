import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ModulePage3 = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleNext = () => {
    navigate(`/child/module/series/${id}/quiz`);
  };

  const handleBack = () => {
    navigate(`/module/series/${id}/page2`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-100 to-orange-200 px-6 py-8">
      <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-orange-700 mb-6 text-center">
          🎯 Page 3: Advanced Applications
        </h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">
            Putting It All Together
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            In this final content section, you'll see how all the pieces fit
            together to solve real problems and create amazing things.
          </p>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl mb-8">
          <h3 className="text-xl font-semibold text-orange-700 mb-3">
            Case Study:
          </h3>
          <p className="text-gray-700 mb-3">
            A real-world example showing these concepts in action:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Problem identification</li>
            <li>Application of concepts</li>
            <li>Solution implementation</li>
            <li>Results and outcomes</li>
          </ul>
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
            className="px-6 py-2 bg-orange-600 text-white rounded-xl shadow hover:bg-orange-700 transition"
          >
            Take Quiz ➡
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModulePage3;
