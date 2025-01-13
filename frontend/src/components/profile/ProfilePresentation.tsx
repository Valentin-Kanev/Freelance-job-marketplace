import { useState, useEffect } from "react";
import { Profile } from "../../api/profileApi";
import ReviewList from "../Reviews/FreelancerReviewsList";
import MyJobs from "../jobs/MyJobsList";
import MyReviews from "../Reviews/ClientReviewsList";
import MyApplications from "../jobApplications/MyApplicationsList";
import Button from "../UI/Button";
import StartChat from "../chat/StartChat";
import { useAuth } from "../../contexts/AuthContext";
import FloatingChatButton from "../chat/FloatingChatButton";
import { useChat } from "../../contexts/ChatContext";

interface ProfilePresentationProps {
  profile: Profile;
  isOwner: boolean;
  onEdit: () => void;
}

export function ProfilePresentation({
  profile,
  isOwner,
  onEdit,
}: ProfilePresentationProps) {
  const { userId, isLoggedIn } = useAuth();
  const isFreelancer = profile.userType === "freelancer";
  const isProfileOwner = String(userId) === String(profile.userId);
  const [activeTab, setActiveTab] = useState(
    isFreelancer ? "reviews" : isOwner ? "jobs" : "reviews"
  );
  const { isChatOpen, chatRoomId, openChat, closeChat } = useChat();
  const [isFloatingChatButtonVisible, setIsFloatingChatButtonVisible] =
    useState(true);

  const handleStartChat = (roomId: string) => {
    openChat(roomId);
    setIsFloatingChatButtonVisible(false);
  };

  useEffect(() => {
    // Trigger refetch in child components when activeTab changes
  }, [activeTab]);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-20 border border-gray-200 mt-4 h-screen overflow-y-auto">
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
        {isFreelancer && (
          <div>
            <strong className="font-medium">Hourly Rate:</strong>
            <p className="text-lg text-gray-600">
              {profile?.hourlyRate ? `$${profile.hourlyRate}/hr` : "N/A"}
            </p>
          </div>
        )}
        <div>
          <strong className="font-medium">Role:</strong>
          <p className="text-lg text-gray-600">
            {isFreelancer ? "Freelancer" : "Client"}
          </p>
        </div>
      </div>
      {!isProfileOwner && isLoggedIn && (
        <div className="mt-6">
          <StartChat
            targetUserId={profile.userId}
            onStartChat={handleStartChat}
          />
        </div>
      )}
      {isOwner && (
        <div className="mt-6 flex justify-left">
          <Button
            label="Edit Profile"
            onClick={onEdit}
            className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
          />
        </div>
      )}
      <div className="mt-8 flex space-x-4 border-b pb-2">
        {isFreelancer && (
          <button
            onClick={() => setActiveTab("reviews")}
            className={`${
              activeTab === "reviews"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            } px-4 py-2`}
          >
            Reviews
          </button>
        )}
        {isFreelancer && isOwner && (
          <button
            onClick={() => setActiveTab("applications")}
            className={`${
              activeTab === "applications"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            } px-4 py-2`}
          >
            My Applications
          </button>
        )}
        {!isFreelancer && isOwner && (
          <>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`${
                activeTab === "jobs"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              } px-4 py-2`}
            >
              My Jobs
            </button>
            <button
              onClick={() => setActiveTab("myReviews")}
              className={`${
                activeTab === "myReviews"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              } px-4 py-2`}
            >
              Reviews I've Left
            </button>
          </>
        )}
      </div>
      <div className="mt-6">
        {activeTab === "reviews" && (
          <ReviewList
            freelancerId={profile.profileId}
            isFreelancer={isFreelancer}
          />
        )}
        {activeTab === "applications" && isFreelancer && <MyApplications />}
        {activeTab === "jobs" && !isFreelancer && (
          <MyJobs clientId={profile.userId} />
        )}
        {activeTab === "myReviews" && !isFreelancer && (
          <MyReviews clientId={profile.userId} />
        )}
      </div>
      <FloatingChatButton
        isOpen={isChatOpen}
        setIsOpen={(isOpen) => {
          if (!isOpen) setIsFloatingChatButtonVisible(true);
          isOpen ? openChat(chatRoomId!) : closeChat();
        }}
        chatRoomId={chatRoomId}
        isVisible={isFloatingChatButtonVisible}
      />
    </div>
  );
}
