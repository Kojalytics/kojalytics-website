import type { Metadata } from "next";
import AdminReviews from "./AdminReviews";

export const metadata: Metadata = {
  title: "Bewertungen verwalten",
  robots: { index: false, follow: false },
};

export default function AdminReviewsPage() {
  return <AdminReviews />;
}
