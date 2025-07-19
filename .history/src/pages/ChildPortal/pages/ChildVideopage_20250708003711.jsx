import React, { useEffect, useState } from "react";
import VideoBanner from "../../../components/child/VideoBanner";
import { getAllVideosApi } from "../../../services/videoApi";
import { VideoHomepage } from "../../../components/child/Videohomepage";
import { Card } from "react-bootstrap";

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
      <Card className="bg-gradient-to-br from-yellow-200 via-pink-100 to-purple-200 rounded-3xl shadow-2xl border-4 border-white p-6">
        <div className="text-center p-10">
          <div className="max-w-md mx-auto">
            {/* Fun TV emoji */}
            <div className="text-7xl mb-4 animate-pulse">📺</div>

            {/* Playful Heading */}
            <h3 className="text-3xl font-extrabold text-pink-500 mb-2 font-[Comic Sans MS,cursive]">
              Uh-oh! No Videos Yet!
            </h3>

            {/* Friendly Message */}
            <p className="text-lg text-purple-800 mb-6 font-semibold font-[Comic Sans MS,cursive]">
              We're still cooking up something awesome for you! 🍿🎬
            </p>

            {/* Animated Arrow */}
            <div className="animate-bounce text-5xl mb-2">👇</div>

            {/* Friendly Suggestion */}
            <p className="text-blue-600 mt-2 font-[Comic Sans MS,cursive]">
              Come back soon for new adventures! 🌟✨
            </p>

            {/* Cute Icons Row */}
            <div className="flex justify-center space-x-6 mt-6 text-4xl">
              <span role="img" aria-label="balloon">
                🎈
              </span>
              <span role="img" aria-label="paint palette">
                🎨
              </span>
              <span role="img" aria-label="teddy bear">
                🧸
              </span>
              <span role="img" aria-label="rocket">
                🚀
              </span>
              <span role="img" aria-label="rainbow">
                🌈
              </span>
            </div>
          </div>
        </div>
      </Card>
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
