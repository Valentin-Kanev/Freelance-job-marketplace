import React, { useState } from "react";
import { useSubmitReview } from "../../hooks/useReview";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import { useToast } from "../../contexts/ToastManager";
import { FaStar } from "react-icons/fa";

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
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const { addToast } = useToast();

  const submitReviewMutation = useSubmitReview(
    () => {
      setRating(0);
      setReviewText("");
      onClose();
      addToast("Review submitted successfully!");
    },
    (error: Error) => {
      console.error("Error submitting review:", error.message);
    }
  );

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
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={30}
                  className={`cursor-pointer ${
                    star <= (hover || rating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>
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
