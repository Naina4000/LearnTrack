// services/dataService.ts
// NOTE: We are MOCKING the API calls for local development.

import { StudentPortalData, TeacherData, StudentSubject } from "@/types/data";
import { mockStudentData } from "@/data/mockStudentData";
import { mockTeacherData } from "@/data/mockTeacherData";

// --- Data Fetching Functions (MOCKED) ---

/**
 * Fetches the list of students.
 * NOTE: We return a spread copy [...mockStudentData] to ensure React Query
 * detects the new reference when data changes.
 */
export const fetchAllStudentData = async (): Promise<StudentPortalData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("MOCK: Returning Student Portal Data.");
      // Return a shallow copy so React detects state changes
      resolve([...mockStudentData]);
    }, 500);
  });
};

/**
 * Updates the attendance for a specific student.
 * CRITICAL FIX: This now actually modifies the mock data array.
 */
export const updateStudentAttendance = async (
  studentId: string,
  updatedSubjects: StudentSubject[]
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. Find the student in the mock data array
      const studentIndex = mockStudentData.findIndex((s) => s.id === studentId);

      // 2. Update the data in memory
      if (studentIndex !== -1) {
        mockStudentData[studentIndex].subjects = updatedSubjects;
        console.log(`MOCK: Data updated for student ${studentId}`);
      } else {
        console.error(`MOCK: Student ${studentId} not found!`);
      }

      resolve(true);
    }, 600); // Simulate network delay
  });
};

/**
 * Fetches the list of Teachers.
 */
export const fetchTeacherData = async (): Promise<TeacherData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("MOCK: Returning Teacher List Data.");
      resolve(mockTeacherData);
    }, 800);
  });
};
