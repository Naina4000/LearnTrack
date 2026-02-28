"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTeacherData, fetchAllStudentData } from "@/services/dataService";
import { getStudentsUnderTeacher } from "@/utils/filterStudentsForTeacher";
import { TeacherData, StudentPortalData } from "@/types/data";
import {
  Loader2,
  BookOpen,
  User,
  BadgeCheck,
  Search,
  Users,
} from "lucide-react";
import React, { useState, useMemo } from "react";

/* ===================== LOADING ===================== */

const LoadingState = () => (
  <div className="flex justify-center items-center h-64 text-indigo-500">
    <Loader2 className="w-8 h-8 animate-spin mr-3" />
    <span className="text-lg font-semibold">Loading Teacher Profiles...</span>
  </div>
);

export default function TeacherViewClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherData | null>(
    null,
  );

  /* ===================== TEACHERS ===================== */

  const { data: teachers = [], isLoading } = useQuery<TeacherData[]>({
    queryKey: ["teacherProfiles"],
    queryFn: fetchTeacherData,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  /* ===================== FETCH ALL STUDENTS ONCE ===================== */

  const { data: allStudents = [], isFetching } = useQuery<StudentPortalData[]>({
    queryKey: ["allStudents"],
    queryFn: fetchAllStudentData,
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  /* ===================== FILTER STUDENTS ===================== */

  const students = useMemo(() => {
    if (!selectedTeacher) return [];
    return getStudentsUnderTeacher(selectedTeacher, allStudents);
  }, [selectedTeacher, allStudents]);

  /* ===================== EXPERIENCE ===================== */

  const calculateExperience = (dateStr: any) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "—";

    const today = new Date();
    let years = today.getFullYear() - date.getFullYear();
    let months = today.getMonth() - date.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years <= 0) return `${months} months`;
    return `${years}y ${months}m`;
  };

  /* ===================== FILTER + SORT ===================== */

  const filteredTeachers = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return teachers
      .filter((t) =>
        [t.teacherName, t.employeeId, t.department, ...(t.subjects || [])]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .sort((a, b) =>
        a.teacherName.localeCompare(b.teacherName, undefined, {
          sensitivity: "base",
        }),
      );
  }, [teachers, searchTerm]);

  if (isLoading) return <LoadingState />;

  /* ===================== UI ===================== */

  return (
    <div className="p-5">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-indigo-600" />
          <h1 className="text-3xl font-bold text-indigo-600">
            Teacher Staff Directory
          </h1>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white shadow-sm outline-none focus:shadow-md transition"
          />
        </div>
      </div>

      {/* ===================== TEACHER TABLE ===================== */}

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Teacher</th>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Subjects</th>
              <th className="px-4 py-3 text-left">Duration</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredTeachers.map((teacher, i) => {
              const active = selectedTeacher?.id === teacher.id;

              return (
                <tr
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher)}
                  className={`cursor-pointer transition ${
                    active ? "bg-indigo-50" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-4 font-medium">{i + 1}</td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User size={16} className="text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-semibold">
                          {teacher.teacherName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {teacher.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-xs font-semibold text-gray-600">
                    {teacher.employeeId}
                  </td>

                  <td className="px-4 py-4">{teacher.department}</td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(teacher.subjects || []).map((sub, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-indigo-700 whitespace-nowrap">
                    <BadgeCheck className="inline w-4 h-4 mr-1" />
                    {calculateExperience(teacher.dateOfJoining)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===================== STUDENTS ===================== */}

      {selectedTeacher && (
        <div className="mt-8 p-5 bg-white rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <Users className="mr-2 text-indigo-600" />
            <h2 className="text-xl font-bold">
              Students Under {selectedTeacher.teacherName}
            </h2>
          </div>

          {isFetching ? (
            <div className="flex items-center text-indigo-600">
              <Loader2 className="animate-spin mr-2" size={18} />
              Loading Students...
            </div>
          ) : students.length === 0 ? (
            <div className="text-sm opacity-70">
              No students registered under this teacher
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-gray-500">
                    Roll: {s.enrollmentNo}
                  </div>
                  <div className="text-xs text-indigo-600 font-medium">
                    Attendance: {s.overallAttendance}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
