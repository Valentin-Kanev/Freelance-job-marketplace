import { useEffect, useState } from "react";

const useJobForm = (initialDetails: any) => {
  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    budget: 0,
    deadline: "",
  });

  useEffect(() => {
    if (initialDetails) {
      setJobDetails(initialDetails);
    }
  }, [initialDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobDetails({
      ...jobDetails,
      [e.target.name]: e.target.value,
    });
  };

  return { jobDetails, handleChange };
};

export default useJobForm;
