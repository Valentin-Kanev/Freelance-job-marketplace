export type Review = {
  id: string;
  freelancerId: string;
  clientId: string;
  rating: number;
  reviewText: string;
  clientUsername: string;
  freelancerUsername: string;
};

export type SubmitReviewData = Required<
  Omit<Review, "id" | "freelancerId" | "clientUsername" | "freelancerUsername">
>;
