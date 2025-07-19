import React, { useEffect, useState } from "react";
import VideoBanner from "../../../components/child/VideoBanner";
import { getAllVideosApi } from "../../../services/videoApi";
import { VideoHomepage } from "../../../components/child/Videohomepage";

export const ChildVideopage = () => {
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getAllVideosApi();
        setVideos(data || []);
        if (data && data.length > 0) {
          setFeaturedVideo(data[0]);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  if (videos.length === 0) {
    return <div className="text-cp-10">No video found right now 🧐</div>;
  }

  return (
    <div>
      {featuredVideo && <VideoBanner video={featuredVideo} />}
      <VideoHomepage />
    </div>
  );
};

export default ChildVideopage;
