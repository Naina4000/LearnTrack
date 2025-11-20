"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTeacherStudentView } from "@/services/dataService";
import { TeacherStudentView } from "@/types/data";
import { Loader2, BookOpen, Mail } from "lucide-react";
import React from "react";

const LoadingState = () => (
  <div className="flex justify-center items-center h-64 text-indigo-500">
    <Loader2 className="w-8 h-8 animate-spin mr-3" />
    <span className="text-lg font-semibold">Fetching Teacher View Data...</span>
  </div>
);

export default function TeacherViewClient() {
  const { data, isLoading, error } = useQuery<TeacherStudentView[]>({
    queryKey: ["teacherStudents"],
    queryFn: fetchTeacherStudentView,
  });

  const getTodayStatus = (
    history: { date: string; status: "Present" | "Absent" }[]
  ) => {
    // Assumes the first record in the history array is the most recent
    if (!history || history.length === 0) return "N/A";
    const todayRecord = history[0];
    return todayRecord ? todayRecord.status : "N/A";
  };

  if (isLoading) return <LoadingState />;

  if (error)
    return (
      <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">API Error (Teacher Portal):</p>
        <p>{error.message}</p>
        <p className="mt-2 text-sm">
          Check connection and if the Teacher Portal API is running.
        </p>
      </div>
    );

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center">
        <BookOpen className="w-6 h-6 mr-2" /> Teacher Portal Student View
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                S.No.
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Roll No.
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Student Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Batch/Sem
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Today's Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Prev. Attendance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.map((student) => (
              <tr
                key={student.studentRollNumber}
                className="hover:bg-indigo-50 transition-colors"
              >
                <td className="py-4 px-4 whitespace-nowrap text-gray-600">
                  {student.serialNumber}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-600">
                  {student.studentRollNumber}
                </td>
                <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">
                  {student.studentName}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-600">
                  {student.batchNumber} / {student.currentSemester}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <a
                    href={`mailto:${student.email}`}
                    className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
                  >
                    <Mail className="w-4 h-4 mr-1" /> Send Email
                  </a>
                </td>
                <td className="py-4 px-4 whitespace-nowrap font-bold">
                  <span
                    className={
                      getTodayStatus(student.attendanceHistory) === "Present"
                        ? "text-green-600 bg-green-100 p-1 rounded"
                        : "text-red-600 bg-red-100 p-1 rounded"
                    }
                  >
                    {getTodayStatus(student.attendanceHistory)}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex space-x-1 overflow-x-auto max-w-[150px]">
                    {student.attendanceHistory.slice(0, 5).map((record, i) => (
                      <span
                        key={i}
                        title={`${record.date}: ${record.status}`}
                        className={`p-1 rounded-full text-xs font-bold w-6 h-6 flex items-center justify-center 
                                ${
                                  record.status === "Present"
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }
                            `}
                      >
                        {record.status === "Present" ? "P" : "A"}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
