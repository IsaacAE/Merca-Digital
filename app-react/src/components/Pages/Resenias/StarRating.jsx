import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ rating, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleMouseEnter = (index) => {
    setHoveredRating(index);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleClick = (index) => {
    onRatingChange(index);
  };

  const starSize = 48; // Tamaño de la estrella en píxeles

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((index) => (
        <svg
          key={index}
          width={starSize}
          height={starSize}
          viewBox="0 0 24 24"
          className={`star ${index <= (hoveredRating || rating) ? 'filled' : ''}`}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        >
          <polygon
            points="12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27"
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;

