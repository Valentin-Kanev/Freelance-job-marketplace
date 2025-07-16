export interface Application {
  applicationId: number;
  jobId: number;
  freelancerId: string;
  username: string;
  coverLetter: string;
}

export interface MyApplication {
  jobId: number;
  jobTitle: string;
  coverLetter: string;
  applicationDate: string;
}
