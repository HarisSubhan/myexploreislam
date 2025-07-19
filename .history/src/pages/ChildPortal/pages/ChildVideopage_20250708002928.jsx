
import React, { useEffect, useState } from "react";
import VideoBanner from "../../../components/child/VideoBanner";
import { getAllVideosApi } from "../../../services/videoApi"; 
import { VideoHomepage } from "../../../components/child/Videohomepage";

export const ChildVideopage = () => {
  const [featuredVideo, setFeaturedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const data = await getAllVideosApi();
      if (data && data.length > 0) {
        setFeaturedVideo(data[0]); 
      }
    };

    fetchVideos();
  }, []);

  if (!featuredVideo) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div>
      <VideoBanner video={featuredVideo} />
      <VideoHomepage />
    </div>
  );
};
export default ChildVideopage;