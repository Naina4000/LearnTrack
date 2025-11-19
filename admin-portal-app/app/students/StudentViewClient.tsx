"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAllStudentData } from "@/services/dataService";
import { StudentPortalData } from "@/types/data";
import { Loader2, Users } from "lucide-react";
import React from "react";

const LoadingState = () => (
  <div className="flex justify-center items-center h-64 text-indigo-500">
    <Loader2 className="w-8 h-8 animate-spin mr-3" />
    <span className="text-lg font-semibold">Fetching Student Data...</span>
  </div>
);

export default function StudentViewClient() {
  const { data, isLoading, error } = useQuery<StudentPortalData[]>({
    queryKey: ["allStudents"],
    queryFn: fetchAllStudentData,
  });

  if (isLoading) return <LoadingState />;

  if (error)
    return (
      <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">API Error (Student Portal):</p>
        <p>{error.message}</p>
        <p className="mt-2 text-sm">
          Check connection and if the Student Portal API is running.
        </p>
      </div>
    );

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center">
        <Users className="w-6 h-6 mr-2" /> Student Portal Data Overview
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Batch No.
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Semester
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Subjects & Attendance (%)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.map((student, index) => (
              <tr key={index} className="hover:bg-indigo-50 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">
                  {student.name}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-600">
                  {student.batchNo}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-600">
                  {student.currentSemester}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm">
                  {student.subjects.map((sub, i) => (
                    <div
                      key={i}
                      className={`font-mono text-xs mb-1 p-1 rounded-md transition-colors inline-block mr-2 
                            ${
                              sub.attendancePercentage < 75
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }
                        `}
                    >
                      {sub.name}: {sub.attendancePercentage}%
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
