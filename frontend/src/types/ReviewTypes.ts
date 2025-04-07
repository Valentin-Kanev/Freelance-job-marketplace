export interface Review {
  id: string;
  freelancer_id: string;
  client_id: string;
  rating: number;
  review_text: string;
  client_username: string;
  freelancer_username: string;
}

export type SubmitReviewData = Required<
  Omit<
    Review,
    "id" | "freelancer_id" | "client_username" | "freelancer_username"
  >
>;
