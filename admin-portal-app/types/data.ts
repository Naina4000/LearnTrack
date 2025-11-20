// types/data.ts

// Data from the Student Portal API (Unchanged)
export interface StudentPortalData {
  name: string;
  batchNo: string;
  subjects: { name: string; attendancePercentage: number }[];
  currentSemester: string;
}

// UPDATED: Data structure for the Teacher Portal (Teacher Profiles)
export interface TeacherData {
  serialNumber: number;
  teacherName: string;
  employeeId: string; // Teacher ID
  dateOfJoining: string; // ISO Format YYYY-MM-DD
  email: string;
  department: string; // Added for context
}
