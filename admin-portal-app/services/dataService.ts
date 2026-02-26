import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../app/lib/firebase";
import { StudentPortalData, TeacherData, StudentSubject } from "@/types/data";

/* =====================================================
   SUBJECT NORMALIZER (BULLETPROOF)
   ===================================================== */

const normalizeSubjects = (raw: unknown): string[] => {
  if (!raw) return [];

  // ✅ Case 1: Proper array of strings
  if (Array.isArray(raw)) {
    // Handle ["[\"OS\",\"DBMS\",\"CN\"]"]
    if (
      raw.length === 1 &&
      typeof raw[0] === "string" &&
      raw[0].startsWith("[")
    ) {
      try {
        const parsed = JSON.parse(raw[0]);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return raw.filter((s): s is string => typeof s === "string");
  }

  // ✅ Case 2: JSON string
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

/* =====================================================
   STUDENTS
   ===================================================== */

export const fetchAllStudentData = async (): Promise<StudentPortalData[]> => {
  const snapshot = await getDocs(collection(db, "students"));
  let serial = 1;

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    const subjects = normalizeSubjects(data.subjects);

    return {
      id: docSnap.id,
      serialNumber: serial++,

      name: data.name || data.Name || "—",
      enrollmentNo: String(data.rollNo ?? ""),
      branch: data.branch ?? "—",
      batchNo: data.branch ?? "—",
      currentSemester: data.semester ?? "—",

      subjects: subjects.map((subject) => ({
        name: subject,
        attendancePercentage:
          typeof data.attendance?.[subject] === "number"
            ? data.attendance[subject]
            : 0,
      })),
    };
  });
};

/* =====================================================
   UPDATE ATTENDANCE
   ===================================================== */

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

/* =====================================================
   TEACHERS
   ===================================================== */

export const fetchTeacherData = async (): Promise<TeacherData[]> => {
  const snapshot = await getDocs(collection(db, "teachers"));
  let serial = 1;

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      serialNumber: serial++,

      teacherName: data.name || "—",
      employeeId: String(data.teacherId ?? "—"),
      department: data.department ?? "—",

      subjects: normalizeSubjects(data.subjects),

      dateOfJoining: data.joiningDate?.toDate?.() ?? null,
      email: data.email ?? "",
    };
  });
};

/* =====================================================
   ADD STUDENT (MATCHING YOUR SCHEMA)
   ===================================================== */

import { addDoc, Timestamp } from "firebase/firestore";

export const addStudent = async (form: any) => {
  const subjects: string[] = form.subjects
    .map((s: any) => s.name.trim())
    .filter(Boolean);

  const attendance: Record<string, number> = {};
  form.subjects.forEach((s: any) => {
    if (s.name) attendance[s.name] = Number(s.attendancePercentage) || 0;
  });

  await addDoc(collection(db, "students"), {
    name: form.name,
    rollNo: form.enrollmentNo,
    branch: form.branch,
    semester: form.currentSemester,
    subjects,
    attendance,
  });
};

/* =====================================================
   ADD TEACHER
   ===================================================== */

export const addTeacher = async (form: any) => {
  await addDoc(collection(db, "teachers"), {
    name: form.teacherName,
    teacherId: form.employeeId,
    department: form.department,
    email: form.email,
    joiningDate: Timestamp.fromDate(new Date(form.dateOfJoining)),
  });
};
