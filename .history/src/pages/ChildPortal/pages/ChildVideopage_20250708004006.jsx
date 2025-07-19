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
      <Card className="bg-white rounded-2xl shadow-md p-6">
        <div className="text-center">
        <h2 className="section-title text-center text-primary fw-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>
    📚 Explore Our Magical Book Collection!
  </h2>

          <div className="bg-blue-100 border border-blue-200 text-gray-700 text-lg rounded-lg px-4 py-3 inline-block mx-auto font-[Comic Sans MS,cursive]">
            No books found right now 😳
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
