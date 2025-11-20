import StudentViewClient from "./StudentViewClient";

export const metadata = {
  title: "Student Overview | Admin Portal",
  description: "View detailed student attendance by subject.",
};

export default function StudentOverviewPage() {
  return <StudentViewClient />;
}
