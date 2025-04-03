import React from "react";
import Modal from "../../UI/Modal";
import JobApplication from "../../jobApplications/JobApplication";

interface ApplyJobProps {
  job_id: number;
  onClose: () => void;
}

const ApplyForJob: React.FC<ApplyJobProps> = ({ job_id, onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="Apply for Job">
      <JobApplication job_id={job_id} onClose={onClose} />
    </Modal>
  );
};

export default ApplyForJob;
