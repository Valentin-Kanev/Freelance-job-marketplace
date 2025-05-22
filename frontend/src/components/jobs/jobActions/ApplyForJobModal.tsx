import React from "react";
import Modal from "../../UI/Modal";
import ApplyForJob from "../../jobApplications/ApplyForJob";

interface ApplyForJobModalProps {
  job_id: number;
  onClose: () => void;
}

const ApplyForJobModal: React.FC<ApplyForJobModalProps> = ({
  job_id,
  onClose,
}) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="Apply for Job">
      <ApplyForJob job_id={job_id} onClose={onClose} />
    </Modal>
  );
};

export default ApplyForJobModal;
