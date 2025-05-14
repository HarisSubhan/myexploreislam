import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import Slider from 'react-slick';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const BookHomepage = () => {
  const trendingItems = [
    { 
      id: 1, 
      title: 'The Silent Patient', 
      description: 'A psychological thriller about a woman who shoots her husband and then stops speaking.',
      image: 'https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg' 
    },
    { 
      id: 2, 
      title: 'Atomic Habits', 
      description: 'Learn how to build good habits and break bad ones with proven strategies.',
      image: 'https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg' 
    },
    { 
      id: 3, 
      title: 'Where the Crawdads Sing', 
      description: 'A murder mystery and coming-of-age story set in the marshes of North Carolina.',
      image: 'https://m.media-amazon.com/images/I/81O1oy0y9eL._AC_UF1000,1000_QL80_.jpg' 
    },
    { 
      id: 4, 
      title: 'Educated', 
      description: 'A memoir about a woman who leaves her survivalist family and goes on to earn a PhD.',
      image: 'https://m.media-amazon.com/images/I/81O1oy0y9eL._AC_UF1000,1000_QL80_.jpg' 
    },
    { 
      id: 5, 
      title: 'The Midnight Library', 
      description: 'A novel about a library between life and death where each book represents a different life path.',
      image: 'https://m.media-amazon.com/images/I/81WcnNQ-TBL._AC_UF1000,1000_QL80_.jpg' 
    },
    { 
      id: 6, 
      title: 'Project Hail Mary', 
      description: 'A lone astronaut must save the earth from disaster in this science fiction adventure.',
      image: 'https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg' 
    },
  ];

  // Custom arrow components
  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <button 
        className="slick-arrow slick-next" 
        onClick={onClick}
        style={{
          right: '-25px',
          zIndex: 1,
          background: 'transparent',
          border: 'none',
          fontSize: '24px',
          color: '#000'
        }}
      >
        <MdNavigateNext />
      </button>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button 
        className="slick-arrow slick-prev" 
        onClick={onClick}
        style={{
          left: '-25px',
          zIndex: 1,
          background: 'transparent',
          border: 'none',
          fontSize: '24px',
          color: '#000'
        }}
      >
        <MdNavigateBefore />
      </button>
    );
  };

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
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
    <Container className="trending-now-section my-5" style={{ position: 'relative' }}>
      <h2 className="mb-3">All Books</h2>

      <Slider {...settings}>
        {trendingItems.map((item) => (
          <div key={item.id} className="px-2">
            <Card className="h-100" style={{ height: '500px' }}>
              <Link to={`/books/${item.slug}`}>
                <Card.Img 
                  variant="top" 
                  src={item.image} 
                  alt={item.title}
                  style={{ 
                    height: '250px',
                    objectFit: 'cover',
                    width: '100%',
                    cursor: 'pointer' // Show it's clickable
                  }}
                />
              </Link>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-truncate">{item.title}</Card.Title>
                <Card.Text 
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {item.description}
                </Card.Text>
                <Button 
                  as={Link} 
                  to={`/books/${item.slug}`} 
                  variant="primary" 
                  className="mt-auto"
                >
                  More Detail
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default BookHomepage;