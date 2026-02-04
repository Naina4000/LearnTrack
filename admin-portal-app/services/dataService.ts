import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

import { db } from "../app/lib/firebase";
import { StudentPortalData, TeacherData, StudentSubject } from "@/types/data";

/* ===================== STUDENTS ===================== */

export const fetchAllStudentData = async (): Promise<StudentPortalData[]> => {
  const snapshot = await getDocs(collection(db, "students"));

  let serial = 1;

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      serialNumber: serial++,
      name: data.name,
      enrollmentNo: data.rollNo,
      branch: data.branch,
      batchNo: data.branch,
      currentSemester: data.semester,
      subjects: (data.subjects || []).map((subject: string) => ({
        name: subject,
        attendancePercentage: data.attendance?.[subject] ?? 0,
      })),
    };
  });
};

export const updateStudentAttendance = async (
  studentId: string,
  updatedSubjects: StudentSubject[],
): Promise<boolean> => {
  const ref = doc(db, "students", studentId);

  const updates: Record<string, number> = {};
  updatedSubjects.forEach((s) => {
    updates[`attendance.${s.name}`] = s.attendancePercentage;
  });

  await updateDoc(ref, updates);
  return true;
};

/* ===================== TEACHERS ===================== */

export const fetchTeacherData = async (): Promise<TeacherData[]> => {
  const snapshot = await getDocs(collection(db, "teachers"));

  let serial = 1;

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      serialNumber: serial++,
      teacherName: data.name,
      employeeId: data.teacherId,
      department: data.department,
      subjects: data.subjects || [],
      dateOfJoining: data.joiningDate?.toDate?.() ?? null,
      email: data.email || "",
    };
  });
};
