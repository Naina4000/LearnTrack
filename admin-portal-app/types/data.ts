/* ================= SUBJECT ================= */

export interface StudentSubject {
  name: string;
  attendancePercentage: number;
}

/* ================= STUDENT ================= */

export interface StudentPortalData {
  id: string;
  serialNumber?: number;

  name: string;
  enrollmentNo: string;

  branch: string;
  batch: string;
  currentSemester: string;

  subjects: StudentSubject[];

  overallAttendance: number;
}

/* ================= TEACHER ================= */

export interface TeacherAllocation {
  batch: string;
  semester: string;
}

export interface TeacherData {
  id: string;
  serialNumber?: number;

  teacherName: string;
  employeeId: string;
  email: string;

  department: string;

  // 🔥 NEW CORE FIELD
  allocations: TeacherAllocation[];

  subjects: string[];

  dateOfJoining: string;
}
