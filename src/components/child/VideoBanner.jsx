import React from "react";
import { FaPlay, FaInfoCircle, FaStar } from "react-icons/fa";
import { GiPopcorn } from "react-icons/gi";

const VideoBanner = ({ video }) => {
  return (
    <div
      className="relative h-[90vh] w-full bg-cover bg-center text-white flex items-center justify-start"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(255,255,255,0.1), rgba(0,0,0,0.6)), url(${video.thumbnail})`,
      }}
    >
      {/* Floating animated elements */}
      <div className="absolute top-10 right-10 animate-bounce">
        <GiPopcorn className="text-yellow-300 text-4xl" />
      </div>
      
      <div className="p-8 md:p-16 bg-[rgba(0,0,0,0.5)] rounded-xl m-6 max-w-xl border-4 border-purple-400 shadow-lg">
        <h1 className="text-yellow-300 text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-md font-comic">
          {video.title}
        </h1>
        
        {/* Rating stars */}
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-yellow-400 mx-1" />
          ))}
          <span className="ml-2 text-white">5.0</span>
        </div>
        
        <p className="text-lg text-white mb-6 font-medium leading-relaxed bg-[rgba(255,255,255,0.2)] p-3 rounded-lg">
          {video.description}
        </p>

        <div className="flex flex-wrap gap-4">
          <button className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-full hover:bg-yellow-300 shadow-md flex items-center gap-2 transition-all duration-200 hover:scale-105 transform">
            <FaPlay size={18} /> <span>Watch Now</span>
          </button>
          <button className="bg-purple-500 text-white font-bold px-6 py-3 rounded-full hover:bg-purple-400 shadow-md flex items-center gap-2 transition-all duration-200 hover:scale-105 transform">
            <FaInfoCircle size={18} /> <span>More Info</span>
          </button>
        </div>
        
        {/* Age badge */}
        <div className="mt-6 bg-green-500 text-white font-bold rounded-full px-4 py-2 inline-block">
          Recommended for ages {video.ageRange || "5-12"}
        </div>
      </div>
      
      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400"></div>
    </div>
  );
};

export default VideoBanner;