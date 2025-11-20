// services/dataService.ts
// NOTE: We are MOCKING the API calls for local development.

// import axios from 'axios'; // <-- Comment out axios to prevent network calls
import { StudentPortalData, TeacherStudentView } from "@/types/data";
import { mockStudentData } from "@/data/mockStudentData";
import { mockTeacherStudentView } from "@/data/mockTeacherData";

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
 * Fetches the list of students with daily presence/absence records from the Teacher Portal API.
 */
export const fetchTeacherStudentView = async (): Promise<
  TeacherStudentView[]
> => {
  // Simulate network delay for better testing experience
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("MOCK: Returning Teacher View Data.");
      resolve(mockTeacherStudentView);
    }, 800); // 0.8 second delay
  });
};
