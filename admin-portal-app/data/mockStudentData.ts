// data/mockStudentData.ts
import { StudentPortalData } from "@/types/data"; // <-- Uses the correct @/ alias

export const mockStudentData: StudentPortalData[] = [
  {
    name: "Alice Johnson",
    batchNo: "B2023-CS",
    subjects: [
      { name: "Data Structures", attendancePercentage: 92 },
      { name: "Web Development", attendancePercentage: 85 },
      { name: "Dart/Flutter", attendancePercentage: 70 }, // Low attendance to test coloring
    ],
    currentSemester: "3rd",
  },
  {
    name: "Bob Williams",
    batchNo: "B2024-EC",
    subjects: [
      { name: "Circuits", attendancePercentage: 98 },
      { name: "Signals & Systems", attendancePercentage: 78 },
      { name: "Digital Logic", attendancePercentage: 90 },
    ],
    currentSemester: "1st",
  },
  {
    name: "Charlie Davis",
    batchNo: "B2023-CS",
    subjects: [
      { name: "Data Structures", attendancePercentage: 65 }, // Very low attendance
      { name: "Web Development", attendancePercentage: 80 },
      { name: "Dart/Flutter", attendancePercentage: 95 },
    ],
    currentSemester: "3rd",
  },
];
