// data/mockTeacherData.ts
import { TeacherData } from "@/types/data";

export const mockTeacherData: TeacherData[] = [
  {
    serialNumber: 1,
    teacherName: "Dr. Sarah Smith",
    employeeId: "FAC-CS-001",
    dateOfJoining: "2015-08-15", // ~8+ years
    email: "sarah.smith@uni.edu",
    department: "Computer Science",
  },
  {
    serialNumber: 2,
    teacherName: "Prof. Robert Langdon",
    employeeId: "FAC-HS-042",
    dateOfJoining: "2010-01-20", // ~13+ years
    email: "robert.l@uni.edu",
    department: "History & Symbols",
  },
  {
    serialNumber: 3,
    teacherName: "Dr. Emily Blunt",
    employeeId: "FAC-PH-108",
    dateOfJoining: "2022-11-01", // ~1-2 years
    email: "emily.b@uni.edu",
    department: "Physics",
  },
  {
    serialNumber: 4,
    teacherName: "Mr. John Doe",
    employeeId: "FAC-MA-202",
    dateOfJoining: "2024-01-10", // <1 year
    email: "john.doe@uni.edu",
    department: "Mathematics",
  },
];
