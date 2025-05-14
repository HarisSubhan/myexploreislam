import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import  trendingItems  from '../components/Bookhomepage'; // Import your books data

const BookDetail = () => {
  const { slug } = useParams();
  
  // Find the book by slug
  const book = trendingItems.find(item => item.slug === slug);
  
  // Redirect if book not found
  if (!book) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container py-4">
      <Button 
        as={Link} 
        to="/" 
        variant="secondary" 
        className="mb-4"
      >
        Back to Home
      </Button>
      
      <h1>{book.title}</h1>
      <img 
        src={book.image} 
        alt={book.title}
        style={{ maxHeight: '400px' }}
        className="mb-3"
      />
      <p>{book.description}</p>
      {/* Add more book details as needed */}
    </div>
  );
};

export default BookDetail;
