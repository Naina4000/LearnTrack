"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTeacherData } from "@/services/dataService";
import { TeacherData } from "@/types/data";
import {
  Loader2,
  BookOpen,
  User,
  Calendar,
  BadgeCheck,
  Search,
} from "lucide-react";
import React, { useState } from "react";

/* ===================== LOADING ===================== */

const LoadingState = () => (
  <div className="flex justify-center items-center h-64 text-indigo-500">
    <Loader2 className="w-8 h-8 animate-spin mr-3" />
    <span className="text-lg font-semibold">Loading Teacher Profiles...</span>
  </div>
);

/* ===================== MAIN ===================== */

export default function TeacherViewClient() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery<TeacherData[]>({
    queryKey: ["teacherProfiles"],
    queryFn: fetchTeacherData,
  });

  /* ---------- Helpers ---------- */

  const parseDate = (value: unknown): Date | null => {
    if (!value) return null;
    const d = new Date(value as string);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateExperience = (date: Date | null) => {
    if (!date) return "—";

    const today = new Date();

    let years = today.getFullYear() - date.getFullYear();
    let months = today.getMonth() - date.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < date.getDate())) {
      years--;
      months += 12;
    }

    if (years === 0 && months === 0) return "Joined this month";
    if (years === 0) return `${months} months`;
    return `${years} Years${months > 0 ? ` & ${months} Months` : ""}`;
  };

  /* ---------- Filter ---------- */

  const filteredData = data?.filter(
    (teacher) =>
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ---------- States ---------- */

  if (isLoading) return <LoadingState />;

  if (error)
    return (
      <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">API Error (Teacher Portal):</p>
        <p>{(error as Error).message}</p>
      </div>
    );

  /* ---------- UI ---------- */

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-indigo-700" />
          <h1 className="text-3xl font-bold text-indigo-700">
            Teacher Staff Directory
          </h1>
          <div className="ml-4 bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full font-semibold text-sm hidden md:block">
            Total Staff: {data?.length || 0}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search by Employee ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase">
                Serial No.
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase">
                Teacher Name
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase">
                Employee ID
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase">
                Date of Joining
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase">
                Experience (Tenure)
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData?.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No teachers found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredData?.map((teacher) => {
                const joiningDate = parseDate(teacher.dateOfJoining);

                return (
                  <tr
                    key={teacher.employeeId}
                    className="hover:bg-indigo-50/60 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-500 font-medium">
                      #{teacher.serialNumber}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                          <User size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {teacher.teacherName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {teacher.email || "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-gray-100 border font-mono">
                        {teacher.employeeId}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(joiningDate)}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center text-sm font-semibold text-indigo-600">
                        <BadgeCheck className="w-4 h-4 mr-2 text-indigo-500" />
                        {calculateExperience(joiningDate)}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
