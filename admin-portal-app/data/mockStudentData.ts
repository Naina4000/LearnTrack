// data/mockStudentData.ts
import { StudentPortalData } from "@/types/data";

export const mockStudentData: StudentPortalData[] = [
  {
    id: "1",
    serialNumber: 1,
    name: "Alice Johnson",
    enrollmentNo: "EN23001",
    branch: "Computer Science",
    batchNo: "2023-27",
    currentSemester: "3rd",
    subjects: [
      { name: "Data Structures", attendancePercentage: 92 },
      { name: "Web Development", attendancePercentage: 85 },
      { name: "Dart/Flutter", attendancePercentage: 70 },
    ],
  },
  {
    id: "2",
    serialNumber: 2,
    name: "Bob Williams",
    enrollmentNo: "EN24052",
    branch: "Electronics",
    batchNo: "2024-28",
    currentSemester: "1st",
    subjects: [
      { name: "Circuits", attendancePercentage: 98 },
      { name: "Signals & Systems", attendancePercentage: 78 },
      { name: "Digital Logic", attendancePercentage: 90 },
    ],
  },
  {
    id: "3",
    serialNumber: 3,
    name: "Charlie Davis",
    enrollmentNo: "EN23015",
    branch: "Computer Science",
    batchNo: "2023-27",
    currentSemester: "3rd",
    subjects: [
      { name: "Data Structures", attendancePercentage: 65 },
      { name: "Web Development", attendancePercentage: 80 },
      { name: "Dart/Flutter", attendancePercentage: 95 },
    ],
  },
];
