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
    return (
      <Card>
        
      </Card>
      <div className="text-center p-10">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-2">
            Oopsie-doodle!
          </h3>
          <p className="text-lg text-white mb-6">
            No videos found right now 🧐
          </p>
          <div className="animate-bounce text-4xl">👇</div>
          <p className="text-pink-300 mt-4">
            Check back soon for fun new videos!
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <span className="text-3xl">🎈</span>
            <span className="text-3xl">🎨</span>
            <span className="text-3xl">🧸</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {featuredVideo && <VideoBanner video={featuredVideo} />}
      <VideoHomepage />
    </div>
  );
};

export default ChildVideopage;
