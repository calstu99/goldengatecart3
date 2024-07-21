// src/app/review/[asin]/page.js
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ReviewPage = ({ params }) => {
  const { asin } = params;
  const router = useRouter();
  const [liked, setLiked] = useState(null);

  const handleLike = () => {
    setLiked(true);
  };

  const handleDislike = () => {
    setLiked(false);
  };

  const handleLeaveReview = () => {
    router.push(`https://www.amazon.com/review/create-review/ref=cm_cr_othr_d_wr_but_top?ie=UTF8&channel=glance-detail&asin=${asin}`);
  };

  return (
    <div className="container">
      <h1>Do you like the product?</h1>
      <button onClick={handleLike} className="btn btn-primary">Yes</button>
      <button onClick={handleDislike} className="btn btn-secondary">No</button>

      {liked && (
        <div>
          <h2>Great! Would you like to leave a review on Amazon?</h2>
          <button onClick={handleLeaveReview} className="btn btn-success">Leave a Review</button>
        </div>
      )}

      {liked === false && (
        <div>
          <h2>We're sorry to hear that. Thank you for your feedback!</h2>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
