// types/data.ts

export interface StudentSubject {
  name: string;
  attendancePercentage: number;
}

// UPDATED: Student Data Structure
export interface StudentPortalData {
  id: string; // Unique ID for editing
  serialNumber: number;
  name: string;
  enrollmentNo: string; // New Field
  branch: string; // New Field
  batchNo: string;
  currentSemester: string;
  subjects: StudentSubject[];
}

// Teacher Data Structure
export interface TeacherData {
  serialNumber: number;
  teacherName: string;
  employeeId: string;
  dateOfJoining: string;
  email: string;
  department: string;
}
