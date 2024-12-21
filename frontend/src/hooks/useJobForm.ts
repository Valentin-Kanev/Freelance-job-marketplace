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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return { jobDetails, handleChange };
};

export default useJobForm;
