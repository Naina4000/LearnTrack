import { StudentPortalData, TeacherData } from "@/types/data";

/*
   SAFETY HELPERS
*/

const normalize = (v: any) =>
  String(v ?? "")
    .toLowerCase()
    .trim();

/*
   MAIN FILTER
*/

export const getStudentsUnderTeacher = (
  teacher: TeacherData | null | undefined,
  students: StudentPortalData[] | null | undefined,
): StudentPortalData[] => {
  if (!teacher || !students?.length) return [];

  // no allocation = no class assigned
  if (!Array.isArray(teacher.allocations) || teacher.allocations.length === 0)
    return [];

  const teacherDept = normalize(teacher.department);

  const teacherSubjects = new Set(
    (teacher.subjects ?? []).map((s) => normalize(s)),
  );

  return students.filter((student) => {
    if (!student) return false;

    /* ---------- STEP 1: CLASS MATCH ---------- */

    const studentDept = normalize(student.branch);
    const studentBatch = normalize(student.batch);
    const studentSem = normalize(student.currentSemester);

    const classMatch = teacher.allocations!.some((alloc) => {
      if (!alloc) return false;

      return (
        studentDept === teacherDept &&
        studentBatch === normalize(alloc.batch) &&
        studentSem === normalize(alloc.semester)
      );
    });

    if (!classMatch) return false;

    /* ---------- STEP 2: SUBJECT MATCH ---------- */

    // if teacher has no subject restriction → allow all
    if (teacherSubjects.size === 0) return true;

    const studentSubjects = (student.subjects ?? []).map((s) =>
      normalize(s?.name),
    );

    return studentSubjects.some((sub) => teacherSubjects.has(sub));
  });
};
