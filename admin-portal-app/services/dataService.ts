// services/dataService.ts
// NOTE: We are MOCKING the API calls for local development.

// import axios from 'axios'; // <-- Comment out axios to prevent network calls
import { StudentPortalData, TeacherData, StudentSubject } from "@/types/data";
import { mockStudentData } from "@/data/mockStudentData";
import { mockTeacherData } from "@/data/mockTeacherData";

// --- Data Fetching Functions (MOCKED) ---

/**
 * Fetches the list of students with detailed subject attendance from the Student Portal API.
 */
export const fetchAllStudentData = async (): Promise<StudentPortalData[]> => {
  // Simulate network delay for better testing experience
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("MOCK: Returning Student Portal Data.");
      resolve(mockStudentData);
    }, 500); // 0.5 second delay
  });
};

/**
 * Updates the attendance for a specific student.
 * In a real app, this would send a PUT/PATCH request to the backend.
 */
export const updateStudentAttendance = async (
  studentId: string,
  updatedSubjects: StudentSubject[]
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `MOCK: Updated attendance for student ${studentId}`,
        updatedSubjects
      );
      // In a real app, this would be an axios.put() call
      // For mock, we simply return true to simulate success
      resolve(true);
    }, 600);
  });
};

/**
 * Fetches the list of Teachers with their profile details.
 */
export const fetchTeacherData = async (): Promise<TeacherData[]> => {
  // Simulate network delay for better testing experience
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("MOCK: Returning Teacher List Data.");
      resolve(mockTeacherData);
    }, 800); // 0.8 second delay
  });
};
