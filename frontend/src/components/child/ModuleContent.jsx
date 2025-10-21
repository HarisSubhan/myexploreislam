import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ModuleContent = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  // Fetch module details and videos based on moduleId
  // Display series overview and video list

  const handleVideoClick = (videoId) => {
    navigate(`/child/modules/${moduleId}/videos/${videoId}`);
  };

  return (
    <div>
      <h2>Module Content</h2>
      {/* Add series/video list interface */}
    </div>
  );
};

export default ModuleContent;
