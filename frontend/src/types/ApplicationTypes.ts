export interface Application {
  application_id: number;
  job_id: number;
  freelancer_id: string;
  username: string;
  cover_letter: string;
}

export interface MyApplication {
  job_id: number;
  jobTitle: string;
  coverLetter: string;
  applicationDate: string;
}
