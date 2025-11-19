// types/data.ts

// Data from the Student Portal API
export interface StudentPortalData {
  name: string;
  batchNo: string;
  subjects: { name: string; attendancePercentage: number }[];
  currentSemester: string;
}

// Data from the Teacher Portal API (This API returns detailed student info + attendance)
export interface TeacherStudentView {
  serialNumber: number;
  studentName: string;
  studentRollNumber: string;
  attendanceHistory: { date: string; status: "Present" | "Absent" }[]; // Detailed attendance
  currentSemester: string;
  batchNumber: string;
  email: string;
}
