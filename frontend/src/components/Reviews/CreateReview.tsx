// src/components/Reviews/CreateReview.tsx
import React, { useState } from "react";
import { useSubmitReview } from "../../hooks/useReview";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../UI/Button";

interface CreateReviewProps {
  freelancerId: string;
  onClose: () => void;
}

const CreateReview: React.FC<CreateReviewProps> = ({
  freelancerId,
  onClose,
}) => {
  const { userId } = useAuth();
  const submitReviewMutation = useSubmitReview();
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("You need to be logged in to leave a review.");
      return;
    }

    submitReviewMutation.mutate({
      freelancerId,
      data: {
        client_id: userId,
        rating,
        review_text: reviewText,
      },
    });

    // Reset the form and close modal after submission
    setRating(0);
    setReviewText("");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Rating (1-5)
        </label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="1"
          max="5"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">Review</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
          placeholder="Write your review here..."
        />
      </div>
      <Button
        type="submit"
        label="Submit Review"
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
      />
    </form>
  );
};

export default CreateReview;
