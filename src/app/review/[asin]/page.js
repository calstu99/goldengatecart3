// src/app/review/[asin]/page.js
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ReviewPage = ({ params }) => {
  const { asin } = params;
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
    if (selectedRating >= 4) {
      setShowReviewPrompt(true);
    } else {
      setShowReviewPrompt(false);
    }
  };

  const handleLeaveReview = () => {
    router.push(`https://www.amazon.com/review/create-review/ref=cm_cr_othr_d_wr_but_top?ie=UTF8&channel=glance-detail&asin=${asin}`);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">How would you rate this product?</h1>
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className={`text-3xl mx-1 focus:outline-none ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {rating > 0 && (
        <p className="text-center mb-4">
          You rated this product {rating} star{rating !== 1 ? 's' : ''}.
        </p>
      )}
      {showReviewPrompt && (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Great! Would you like to leave a review on Amazon?</h2>
          <button
            onClick={handleLeaveReview}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Leave a Review
          </button>
        </div>
      )}
      {rating > 0 && !showReviewPrompt && (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Thank you for your feedback!</h2>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;

// https://quick-elf-humbly.ngrok-free.app/review/B0C7HHKH3G
