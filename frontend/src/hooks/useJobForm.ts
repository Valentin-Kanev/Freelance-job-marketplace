import { useEffect, useState } from "react";

type JobDetails = {
  title: string;
  description: string;
  budget: number; // Change budget to number
  deadline: string;
};

const useJobForm = (initialDetails: JobDetails) => {
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    title: "",
    description: "",
    budget: 0, // Initialize budget as a number
    deadline: "",
  });

  useEffect(() => {
    if (initialDetails) {
      setJobDetails(initialDetails);
    }
  }, [initialDetails]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setJobDetails((prevDetails) => ({
      ...prevDetails,
      [name]: name === "budget" ? parseFloat(value) || 0 : value, // Handle budget as a number
    }));
  };

  return { jobDetails, handleChange };
};

export default useJobForm;
