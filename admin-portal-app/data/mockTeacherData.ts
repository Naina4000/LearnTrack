// data/mockTeacherData.ts
import { TeacherStudentView } from "@/types/data"; // <-- Uses the correct @/ alias

const getDayStatus = (daysAgo: number): "Present" | "Absent" => {
  return daysAgo % 3 === 0 ? "Absent" : "Present";
};

const generateHistory = (roll: string) => {
  const history = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    history.push({
      date: date.toISOString().split("T")[0],
      status: getDayStatus(i),
    });
  }
  return history;
};

export const mockTeacherStudentView: TeacherStudentView[] = [
  {
    serialNumber: 1,
    studentName: "Alice Johnson",
    studentRollNumber: "CS1001",
    attendanceHistory: generateHistory("CS1001"),
    currentSemester: "3rd",
    batchNumber: "B2023-CS",
    email: "alice.j@uni.edu",
  },
  {
    serialNumber: 2,
    studentName: "Bob Williams",
    studentRollNumber: "EC1002",
    attendanceHistory: generateHistory("EC1002"),
    currentSemester: "1st",
    batchNumber: "B2024-EC",
    email: "bob.w@uni.edu",
  },
  {
    serialNumber: 3,
    studentName: "Charlie Davis",
    studentRollNumber: "CS1003",
    attendanceHistory: generateHistory("CS1003"),
    currentSemester: "3rd",
    batchNumber: "B2023-CS",
    email: "charlie.d@uni.edu",
  },
];
