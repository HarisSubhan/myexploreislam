import React from "react";
import AdminLayout from "../../AdminApp";
import { useParams } from "react-router-dom";

const EditVideo = () => {
  const { id } = useParams();

  return (
    <AdminLayout>
      <h3 className="my-4">✏️ Edit Video (ID: {id})</h3>
      {/* Add/Edit form yahan aayega - same as AddVideo */}
    </AdminLayout>
  );
};

export default EditVideo;
