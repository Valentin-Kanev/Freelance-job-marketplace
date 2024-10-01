// src/components/FreelancerReviews.tsx
import React from "react";
import { useParams } from "react-router-dom"; // Import useParams to access URL params
import { useFreelancerReviews } from "../hooks/useReview";

const FreelancerReviews: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the 'id' parameter from the route
  const freelancerId = Number(id); // Convert id to number

  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useFreelancerReviews(freelancerId);

  return (
    <div>
      <h1>Freelancer Reviews</h1>

      {isLoading && <p>Loading reviews...</p>}
      {isError && <p>Error loading reviews: {error?.message}</p>}

      {reviews && reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              Rating: {review.rating}/5 <br />
              {review.review_text} (Client ID: {review.client_id})
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews found for this freelancer.</p>
      )}
    </div>
  );
};

export default FreelancerReviews;

// // src/components/FreelancerReviews.tsx
// import React, { useState } from "react";
// import { useFreelancerReviews, useSubmitReview } from "../hooks/useReview";

// const FreelancerReviews: React.FC<{ freelancerId: number }> = ({
//   freelancerId,
// }) => {
//   const {
//     data: reviews,
//     isLoading,
//     isError,
//     error,
//   } = useFreelancerReviews(freelancerId);
//   const submitReviewMutation = useSubmitReview();

//   const [clientId, setClientId] = useState<number>(0);
//   const [rating, setRating] = useState<number>(0);
//   const [reviewText, setReviewText] = useState<string>("");

//   const handleSubmitReview = (e: React.FormEvent) => {
//     e.preventDefault();
//     submitReviewMutation.mutate({
//       freelancerId,
//       data: { client_id: clientId, rating, review_text: reviewText },
//     });
//   };

//   return (
//     <div>
//       <h1>Freelancer Reviews</h1>

//       <form onSubmit={handleSubmitReview}>
//         <div>
//           <label>Client ID</label>
//           <input
//             type="number"
//             value={clientId}
//             onChange={(e) => setClientId(Number(e.target.value))}
//             required
//           />
//         </div>
//         <div>
//           <label>Rating (1-5)</label>
//           <input
//             type="number"
//             value={rating}
//             min="1"
//             max="5"
//             onChange={(e) => setRating(Number(e.target.value))}
//             required
//           />
//         </div>
//         <div>
//           <label>Review Text</label>
//           <textarea
//             value={reviewText}
//             onChange={(e) => setReviewText(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Submit Review</button>
//       </form>

//       <h2>All Reviews for Freelancer ID: {freelancerId}</h2>
//       {isLoading && <p>Loading reviews...</p>}
//       {isError && <p>Error loading reviews: {error?.message}</p>}
//       {reviews && reviews.length > 0 ? (
//         <ul>
//           {reviews.map((review) => (
//             <li key={review.id}>
//               Rating: {review.rating}/5 <br />
//               {review.review_text} (Client ID: {review.client_id})
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No reviews found for this freelancer.</p>
//       )}
//     </div>
//   );
// };

// export default FreelancerReviews;
