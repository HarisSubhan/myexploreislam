import React from 'react';
import { Container, Card } from 'react-bootstrap';
import Slider from 'react-slick';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { FaPlay } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const ChildVideos = () => {
  const videoItems = [
    {
      id: 1,
      title: 'React Crash Course',
      description: 'Learn React fundamentals in 30 minutes',
      thumbnail: 'https://i.ytimg.com/vi/w7ejDZ8SWv8/maxresdefault.jpg',
      duration: '12:34',
      views: '1.2M views'
    },
    {
      id: 2,
      title: 'Bootstrap 5 Tutorial',
      description: 'Complete guide to Bootstrap 5',
      thumbnail: 'https://i.ytimg.com/vi/-qfEOE4vtxE/maxresdefault.jpg',
      duration: '15:20',
      views: '856K views'
    },
    {
      id: 3,
      title: 'JavaScript ES6 Features',
      description: 'Modern JavaScript features explained',
      thumbnail: 'https://i.ytimg.com/vi/NCwa_xi0Uuc/maxresdefault.jpg',
      duration: '22:45',
      views: '2.3M views'
    },
    {
      id: 4,
      title: 'Node.js Beginner Guide',
      description: 'Getting started with Node.js',
      thumbnail: 'https://i.ytimg.com/vi/TlB_eWDSMt4/maxresdefault.jpg',
      duration: '18:30',
      views: '1.5M views'
    },
    {
      id: 5,
      title: 'CSS Grid Layout',
      description: 'Master CSS Grid in one video',
      thumbnail: 'https://i.ytimg.com/vi/9zBsdzdE4sM/maxresdefault.jpg',
      duration: '25:10',
      views: '1.8M views'
    },
    {
      id: 6,
      title: 'React Hooks Explained',
      description: 'Deep dive into React Hooks',
      thumbnail: 'https://i.ytimg.com/vi/dpw9EHDh2bM/maxresdefault.jpg',
      duration: '30:15',
      views: '2.1M views'
    }

  ];

  const NextArrow = ({ onClick }) => (
    <button className="slick-arrow next-arrow" onClick={onClick}>
      <MdNavigateNext />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button className="slick-arrow prev-arrow" onClick={onClick}>
      <MdNavigateBefore />
    </button>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <Container className="video-slider-section my-5">
      <h2 className="mb-4">Featured Videos</h2>
      <Slider {...settings}>
        {videoItems.map((video) => (
          <div key={video.id} className="px-2">
            <Card className="video-card h-100">
              <div className="video-thumbnail">
                <Card.Img 
                  variant="top" 
                  src={video.thumbnail} 
                  alt={video.title}
                />
                <div className="play-icon">
                  <FaPlay size={20} />
                </div>
                <span className="video-duration">{video.duration}</span>
              </div>
              <Card.Body>
                <Card.Title>{video.title}</Card.Title>
                <Card.Text className="text-truncate">{video.description}</Card.Text>
                <div className="video-meta">
                  <span>{video.views}</span>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default ChildVideos;