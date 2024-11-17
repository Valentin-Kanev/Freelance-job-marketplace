// src/components/ProfilePresentation.tsx
import React, { useState } from "react";
import { Profile } from "../../api/profileApi";
import ReviewList from "../Reviews/ReviewsList";
import CreateReview from "../Reviews/CreateReview";
import Modal from "../UI/Modal";
import Button from "../UI/Button";

interface ProfilePresentationProps {
  profile: Profile;
  isOwner: boolean;
  onEdit: () => void; // Add onEdit function here
}

export function ProfilePresentation({
  profile,
  isOwner,
  onEdit, // Destructure the onEdit prop here
}: ProfilePresentationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-8 mb-12 border border-gray-200">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        {profile.username || "User"}'s Profile
      </h1>

      <div className="space-y-4">
        <div>
          <strong className="font-medium">Skills:</strong>
          <p className="text-lg text-gray-600">
            {profile.skills || "No skills listed."}
          </p>
        </div>
        <div>
          <strong className="font-medium">Description:</strong>
          <p className="text-lg text-gray-600">
            {profile.description || "No description provided."}
          </p>
        </div>
        <div>
          <strong className="font-medium">Hourly Rate:</strong>
          <p className="text-lg text-gray-600">${profile.hourlyRate}</p>
        </div>
      </div>

      {isOwner && (
        <div className="mt-6 flex justify-left">
          <Button
            label="Edit Profile"
            onClick={onEdit} // Call onEdit when the button is clicked
            className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
          />
        </div>
      )}

      {/* Create Review Button Above Review List */}
      {!isOwner && (
        <div className="mt-10 flex justify-left">
          <Button
            label="Create Review"
            onClick={openModal}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
          />
        </div>
      )}

      {/* Review Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
        <ReviewList freelancerId={profile.profileId} />
      </div>

      {/* Modal for Create Review */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Leave a Review">
        <CreateReview freelancerId={profile.profileId} onClose={closeModal} />
      </Modal>
    </div>
  );
}
