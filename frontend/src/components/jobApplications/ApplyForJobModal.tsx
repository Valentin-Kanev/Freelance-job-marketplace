import React from "react";
import Modal from "../UI/Modal";
import ApplyForJob from "./ApplyForJob";

interface ApplyForJobModalProps {
  jobId: number;
  onClose: () => void;
}

const ApplyForJobModal: React.FC<ApplyForJobModalProps> = ({
  jobId,
  onClose,
}) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="Apply for Job">
      <ApplyForJob jobId={jobId} onClose={onClose} />
    </Modal>
  );
};

export default ApplyForJobModal;
