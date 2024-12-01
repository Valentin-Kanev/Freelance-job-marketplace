import React from "react";
import Modal from "../../UI/Modal";
import JobApplication from "../../jobApplications/JobApplication";

interface ApplyJobProps {
  jobId: string;
  onClose: () => void;
}

const ApplyForJob: React.FC<ApplyJobProps> = ({ jobId, onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="Apply for Job">
      <JobApplication jobId={jobId} onClose={onClose} />
    </Modal>
  );
};

export default ApplyForJob;
