// services/dataService.ts
import { studentApi, teacherApi } from "./apiService";
import { StudentPortalData, TeacherStudentView } from "../types/data";

// --- TEACHER PORTAL DATA ---
// Fetches the list of students as seen by the Teacher portal
export const fetchTeacherStudentView = async (): Promise<
  TeacherStudentView[]
> => {
  try {
    // Assume the Teacher API has an endpoint to list all relevant students
    const response = await teacherApi.get("/students-view");
    return response.data;
  } catch (error) {
    console.error("Error fetching Teacher View Data:", error);
    throw new Error("Could not load teacher view data.");
  }
};

// --- STUDENT PORTAL DATA ---
// Fetches the list of all students from the Student portal
export const fetchAllStudentData = async (): Promise<StudentPortalData[]> => {
  try {
    // Assume the Student API has an endpoint to list all student details
    const response = await studentApi.get("/all-students");
    return response.data;
  } catch (error) {
    console.error("Error fetching Student Portal Data:", error);
    throw new Error("Could not load student portal data.");
  }
};
