import React, { useState } from "react";
import { useSubmitReview } from "../../hooks/useReview";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import { useToast } from "../ToastManager";

interface CreateReviewProps {
  freelancerId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CreateReview: React.FC<CreateReviewProps> = ({
  freelancerId,
  isOpen,
  onClose,
}) => {
  const { userId } = useAuth();
  const submitReviewMutation = useSubmitReview();
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("You need to be logged in to leave a review.");
      return;
    }

    submitReviewMutation.mutate(
      {
        freelancerId,
        data: {
          client_id: userId,
          rating,
          review_text: reviewText,
        },
      },
      {
        onSuccess: () => {
          setRating(0);
          setReviewText("");
          onClose();
          addToast("Review submitted successfully!");
        },
      }
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review">
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
            <label className="block text-gray-700 font-medium mb-2">
              Review
            </label>
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
            className="bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition duration-300 ease-in-out"
          />
        </form>
      </Modal>
    </>
  );
};

export default CreateReview;
