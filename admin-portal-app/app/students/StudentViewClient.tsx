"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllStudentData,
  updateStudentAttendance,
} from "@/services/dataService";
import { StudentPortalData, StudentSubject } from "@/types/data";
import { Loader2, Users, Pencil, Check, X, Search } from "lucide-react";

/* ===================== HELPERS ===================== */

const getAttendanceColor = (value: number) => {
  if (value < 60) return "badge-soft-red";
  if (value < 75) return "badge-soft-yellow";
  return "badge-soft-green";
};

/* ===================== LOADING ===================== */

const LoadingState = () => (
  <div className="flex justify-center items-center h-64 text-indigo-500">
    <Loader2 className="w-8 h-8 animate-spin mr-3" />
    <span className="text-lg font-semibold">Fetching Student Data...</span>
  </div>
);

/* ===================== MAIN ===================== */

export default function StudentViewClient() {
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedSubjects, setEditedSubjects] = useState<StudentSubject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery<StudentPortalData[]>({
    queryKey: ["allStudents"],
    queryFn: fetchAllStudentData,
  });

  const mutation = useMutation({
    mutationFn: (params: { id: string; subjects: StudentSubject[] }) =>
      updateStudentAttendance(params.id, params.subjects),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allStudents"] });
      setEditingId(null);
    },
  });

  /* ---------- Handlers ---------- */

  const handleEditClick = useCallback((student: StudentPortalData) => {
    setEditingId(student.id);
    setEditedSubjects(JSON.parse(JSON.stringify(student.subjects)));
  }, []);

  const handleCancelClick = useCallback(() => {
    setEditingId(null);
    setEditedSubjects([]);
  }, []);

  const handleSaveClick = useCallback(() => {
    if (editingId) {
      mutation.mutate({ id: editingId, subjects: editedSubjects });
    }
  }, [editingId, editedSubjects, mutation]);

  const handleAttendanceChange = useCallback((index: number, value: string) => {
    const val = Math.min(100, Math.max(0, Number(value)));
    setEditedSubjects((prev) =>
      prev.map((sub, i) =>
        i === index ? { ...sub, attendancePercentage: val } : sub,
      ),
    );
  }, []);

  /* ================= SEARCH + SORT ================= */

  const filteredData = useMemo(() => {
    if (!data) return [];

    const term = searchTerm.trim().toLowerCase();

    const filtered = data.filter((student) => {
      const name = student.name.toLowerCase();
      const roll = student.enrollmentNo.toLowerCase();

      return name.includes(term) || roll.includes(term);
    });

    // Alphabetical Sort A → Z
    return filtered.sort((a, b) =>
      a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
    );
  }, [data, searchTerm]);

  /* ---------- States ---------- */

  if (isLoading) return <LoadingState />;

  if (error)
    return (
      <div className="p-8 rounded-xl border border-red-300 bg-red-50 text-red-700">
        <p className="font-bold">API Error</p>
        <p>{(error as Error).message}</p>
      </div>
    );

  /* ===================== UI ===================== */

  return (
    <div className="p-4 card">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center">
          <Users className="w-7 h-7 mr-3 text-indigo-600" />
          <h1 className="text-3xl font-bold text-indigo-600">
            Student Portal Overview
          </h1>
          <div className="ml-4 bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-semibold text-sm hidden md:block">
            Total Students: {filteredData.length}
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg text-black focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border border-[var(--card-border)]">
        <table className="min-w-full divide-y divide-[var(--card-border)]">
          <thead className="bg-[color:var(--card)]/60 backdrop-blur">
            <tr>
              {[
                "S.No",
                "Name",
                "Enrollment",
                "Branch",
                "Batch/Sem",
                "Subjects",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="py-4 px-6 text-left text-xs font-bold uppercase opacity-70"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--card-border)]">
            {filteredData.map((student, index) => {
              const isEditing = editingId === student.id;

              return (
                <tr
                  key={student.id}
                  className={`transition ${
                    isEditing ? "bg-indigo-500/5" : "hover:bg-indigo-500/5"
                  }`}
                >
                  {/* SERIAL NUMBER FIXED */}
                  <td className="py-4 px-6 opacity-70">{index + 1}</td>

                  <td className="py-4 px-6 font-semibold">{student.name}</td>
                  <td className="py-4 px-6 font-mono opacity-80">
                    {student.enrollmentNo}
                  </td>
                  <td className="py-4 px-6 opacity-80">{student.branch}</td>
                  <td className="py-4 px-6 opacity-80">
                    {student.batch} / {student.currentSemester}
                  </td>

                  {/* SUBJECTS */}
                  <td className="py-4 px-6">
                    {isEditing ? (
                      <div className="space-y-2">
                        {editedSubjects.map((sub, i) => (
                          <div
                            key={i}
                            className={`flex justify-between items-center px-3 py-2 rounded-lg ${getAttendanceColor(sub.attendancePercentage)}`}
                          >
                            <span className="text-sm font-medium">
                              {sub.name}
                            </span>
                            <input
                              type="number"
                              value={sub.attendancePercentage}
                              onChange={(e) =>
                                handleAttendanceChange(i, e.target.value)
                              }
                              className="w-16 text-right bg-white/70 rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {student.subjects.map((sub, i) => (
                          <span
                            key={i}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md ${getAttendanceColor(sub.attendancePercentage)}`}
                          >
                            {sub.name}: {sub.attendancePercentage}%
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-4 px-6 text-center">
                    {isEditing ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleSaveClick}
                          className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition"
                        >
                          {mutation.isPending ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="p-2 bg-slate-400 text-white rounded-full hover:bg-slate-500 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(student)}
                        className="px-3 py-1.5 border border-indigo-200 text-indigo-600 rounded-md hover:bg-indigo-50 transition text-sm font-medium"
                      >
                        <Pencil size={14} className="inline mr-1" />
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
