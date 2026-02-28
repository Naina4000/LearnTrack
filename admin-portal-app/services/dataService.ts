import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../app/lib/firebase";
import { StudentPortalData, TeacherData, StudentSubject } from "@/types/data";

/* =====================================================
   SAFE HELPERS
   ===================================================== */

const asString = (val: any, fallback = "—"): string =>
  val === undefined || val === null ? fallback : String(val);

const normalizeSemester = (sem: any): string =>
  String(sem ?? "")
    .replace(/semester|sem/gi, "")
    .trim()
    .toLowerCase();

/* =====================================================
   SUBJECT NORMALIZER
   ===================================================== */

const normalizeSubjects = (raw: unknown): string[] => {
  if (!raw) return [];

  if (Array.isArray(raw))
    return raw.filter((s): s is string => typeof s === "string");

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [raw];
  }

  return [];
};

/* =====================================================
   BUILD STUDENT OBJECT
   ===================================================== */

const buildStudent = (docSnap: any, serial: number): StudentPortalData => {
  const data = docSnap.data();
  const subjects = normalizeSubjects(data.subjects);

  const subjectObjects: StudentSubject[] = subjects.map((subject) => ({
    name: subject,
    attendancePercentage:
      typeof data.attendance?.[subject] === "number"
        ? data.attendance[subject]
        : 0,
  }));

  const overallAttendance =
    subjectObjects.length === 0
      ? 0
      : Math.round(
          subjectObjects.reduce((acc, s) => acc + s.attendancePercentage, 0) /
            subjectObjects.length,
        );

  return {
    id: docSnap.id,
    serialNumber: serial,

    name: asString(data.name),
    enrollmentNo: asString(data.rollNo ?? data.enrollmentNo),
    branch: asString(data.branch),
    batch: asString(data.batch),
    currentSemester: normalizeSemester(data.semester),

    subjects: subjectObjects,
    overallAttendance,
  };
};

/* =====================================================
   FETCH ALL STUDENTS
   ===================================================== */

export const fetchAllStudentData = async (): Promise<StudentPortalData[]> => {
  const snapshot = await getDocs(collection(db, "students"));
  let serial = 1;
  return snapshot.docs.map((docSnap) => buildStudent(docSnap, serial++));
};

/* =====================================================
   🔥 FETCH STUDENTS FOR TEACHER ALLOCATIONS
   (MULTI CLASS SUPPORT)
   ===================================================== */

export const fetchStudentsByBatch = async (
  allocations: { batch: string; semester: string }[],
): Promise<StudentPortalData[]> => {
  if (!allocations || allocations.length === 0) return [];

  const snapshot = await getDocs(collection(db, "students"));
  let serial = 1;

  const students = snapshot.docs.map((docSnap) =>
    buildStudent(docSnap, serial++),
  );

  return students.filter((student) =>
    allocations.some(
      (alloc) =>
        student.batch.toLowerCase() === alloc.batch.toLowerCase() &&
        normalizeSemester(student.currentSemester) ===
          normalizeSemester(alloc.semester),
    ),
  );
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
    updates[`attendance.${s.name}`] = Number(s.attendancePercentage) || 0;
  });

  await updateDoc(ref, updates);
  return true;
};

/* =====================================================
   FETCH TEACHERS (MULTI ALLOCATION SUPPORT)
   ===================================================== */

export const fetchTeacherData = async (): Promise<TeacherData[]> => {
  const snapshot = await getDocs(collection(db, "teachers"));
  let serial = 1;

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    /* BACKWARD COMPATIBILITY
       if old teacher stored single batch+semester
       convert → allocations array
    */
    let allocations = [];

    if (Array.isArray(data.allocations)) {
      allocations = data.allocations;
    } else if (data.batch && data.semester) {
      allocations = [{ batch: data.batch, semester: data.semester }];
    }

    return {
      id: docSnap.id,
      serialNumber: serial++,

      teacherName: asString(data.teacherName ?? data.name),
      employeeId: asString(data.employeeId ?? data.teacherId),
      email: asString(data.email, ""),

      department: asString(data.department),

      allocations,

      subjects: normalizeSubjects(data.subjects),

      dateOfJoining: data.dateOfJoining || data.joiningDate || "",
    };
  });
};

/* =====================================================
   ADD STUDENT
   ===================================================== */

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
    batch: form.batch,
    semester: form.currentSemester,
    subjects,
    attendance,
  });
};

/* =====================================================
   ADD TEACHER (MULTI CLASS SUPPORT)
   ===================================================== */

export const addTeacher = async (form: any) => {
  await addDoc(collection(db, "teachers"), {
    teacherName: form.teacherName,
    employeeId: form.employeeId,
    email: form.email,

    department: form.department,

    // 🔥 MAIN FEATURE
    allocations: form.allocations || [],

    subjects: form.subjects || [],

    dateOfJoining: form.dateOfJoining,
  });
};
