import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaStar } from "react-icons/fa";
import { useSubmitReview } from "../../hooks/reviews/useSubmitReview";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastManager";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import {
  createReviewSchema,
  CreateReviewValidation,
} from "../../validationSchemas/reviewValidationSchema";

type CreateReviewProps = {
  freelancerId: string;
  isOpen: boolean;
  onClose: () => void;
};

const CreateReview: React.FC<CreateReviewProps> = ({
  freelancerId,
  isOpen,
  onClose,
}) => {
  const { loggedInUserId } = useAuth();
  const { addToast } = useToast();
  const [hover, setHover] = useState<number>(0);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    reset,
  } = useForm<CreateReviewValidation>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: 0,
      reviewText: "",
    },
  });

  const rating = watch("rating");
  const submitReviewMutation = useSubmitReview(() => {
    reset();
    onClose();
    addToast("Review submitted successfully!");
  });

  const onSubmit = (data: CreateReviewValidation) => {
    if (!loggedInUserId) {
      setError("root", {
        message: "You need to be logged in to leave a review.",
      });
      return;
    }

    submitReviewMutation.mutate({
      freelancerId,
      data: {
        clientId: loggedInUserId,
        rating: data.rating,
        reviewText: data.reviewText,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root?.message && (
          <div className="rounded bg-red-100 px-4 py-2 text-red-700">
            {errors.root.message}
          </div>
        )}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Rating</label>
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
                onClick={() => setValue("rating", star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>
          {errors.rating && (
            <p className="text-sm text-red-600 mt-1">{errors.rating.message}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Review</label>
          <textarea
            {...register("reviewText")}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
            placeholder="Write your review here..."
          />
          {errors.reviewText && (
            <p className="text-sm text-red-600 mt-1">
              {errors.reviewText.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          label="Submit Review"
          className="bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition duration-300 ease-in-out"
        />
      </form>
    </Modal>
  );
};

export default CreateReview;
