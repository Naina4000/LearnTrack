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
      <div className="p-8 rounded-xl border border-red-300 bg-red-50 text-red-700">
        <p className="font-bold">API Error (Teacher Portal):</p>
        <p>{(error as Error).message}</p>
      </div>
    );

  /* ---------- UI ---------- */

  return (
    <div className="p-4 card">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-indigo-600" />
          <h1 className="text-3xl font-bold text-indigo-600">
            Teacher Staff Directory
          </h1>
          <div className="ml-4 bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-semibold text-sm hidden md:block">
            Total Staff: {data?.length || 0}
          </div>
        </div>
        {/* SEARCH */}
        <div className="relative w-full md:w-86">
          <Search className="absolute left-3 top-2.5 text-black" size={18} />
          <input
            type="text"
            placeholder="Search Teacher By Name or Emp. ID "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg text-black focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--card-border)]">
        <table className="min-w-full divide-y divide-[var(--card-border)]">
          <thead className="bg-[color:var(--card)]/60 backdrop-blur">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase opacity-70">
                Serial No.
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase opacity-70">
                Teacher Name
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase opacity-70">
                Employee ID
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase opacity-70">
                Date of Joining
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase opacity-70">
                Experience (Tenure)
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--card-border)]">
            {filteredData?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center opacity-60">
                  No teachers found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredData?.map((teacher) => {
                const joiningDate = parseDate(teacher.dateOfJoining);

                return (
                  <tr
                    key={teacher.employeeId}
                    className="hover:bg-indigo-500/5 transition-colors"
                  >
                    <td className="py-4 px-6 opacity-70 font-medium">
                      #{teacher.serialNumber}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                          <User size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-bold">
                            {teacher.teacherName}
                          </div>
                          <div className="text-xs opacity-60">
                            {teacher.email || "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="badge-id">{teacher.employeeId}</span>
                    </td>

                    <td className="py-4 px-6 text-sm opacity-80">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 opacity-60" />
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
