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
  if (value < 60) return "bg-red-50 border-red-300 text-red-700 ring-red-200";
  if (value < 75)
    return "bg-yellow-50 border-yellow-300 text-yellow-700 ring-yellow-200";
  return "bg-green-50 border-green-300 text-green-700 ring-green-200";
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

  /* ---------- Fetch ---------- */

  const { data, isLoading, error } = useQuery<StudentPortalData[]>({
    queryKey: ["allStudents"],
    queryFn: fetchAllStudentData,
  });

  /* ---------- Mutation ---------- */

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

  /* ---------- Filter ---------- */

  const filteredData = useMemo(() => {
    if (!data) return [];

    const term = searchTerm.toLowerCase();

    return data.filter(
      (student) =>
        student.enrollmentNo.toLowerCase().includes(term) ||
        student.name.toLowerCase().includes(term),
    );
  }, [data, searchTerm]);

  /* ---------- States ---------- */

  if (isLoading) return <LoadingState />;

  if (error)
    return (
      <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">API Error</p>
        <p>{(error as Error).message}</p>
      </div>
    );

  /* ===================== UI ===================== */

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-indigo-700 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Student Portal Overview
        </h1>

        {/* SEARCH */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-black" size={18} />
          <input
            type="text"
            placeholder="Search student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg text-black focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y">
          {/* ===== HEADINGS ===== */}
          <thead className="bg-gray-50">
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
                  className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredData.map((student) => {
              const isEditing = editingId === student.id;

              return (
                <tr
                  key={student.id}
                  className={`transition ${
                    isEditing
                      ? "bg-indigo-50 ring-2 ring-indigo-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* SERIAL */}
                  <td className="px-4 py-4 text-black font">
                    {student.serialNumber}
                  </td>

                  {/* NAME */}
                  <td className="px-4 py-4 text-black font">{student.name}</td>

                  {/* ROLL NO */}
                  <td className="px-4 py-4 text-black font-mono font">
                    {student.enrollmentNo}
                  </td>

                  {/* BRANCH */}
                  <td className="px-4 py-4 text-black font">
                    {student.branch}
                  </td>

                  {/* SEM */}
                  <td className="px-4 py-4 text-black font">
                    {student.batchNo} / {student.currentSemester}
                  </td>

                  {/* SUBJECTS */}
                  <td className="px-4 py-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        {editedSubjects.map((sub, i) => (
                          <div
                            key={i}
                            className={`flex justify-between items-center border rounded-md p-2 ring-1 ${getAttendanceColor(
                              sub.attendancePercentage,
                            )}`}
                          >
                            <span className="text-xs font-semibold">
                              {sub.name}
                            </span>

                            <input
                              type="number"
                              value={sub.attendancePercentage}
                              onChange={(e) =>
                                handleAttendanceChange(i, e.target.value)
                              }
                              className="w-16 text-right border rounded px-1 py-0.5 bg-white text-black outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {student.subjects.map((sub, i) => (
                          <span
                            key={i}
                            className={`px-2 py-1 text-xs font-semibold border rounded-md ${getAttendanceColor(
                              sub.attendancePercentage,
                            )}`}
                          >
                            {sub.name}: {sub.attendancePercentage}%
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-4 text-center">
                    {isEditing ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleSaveClick}
                          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                        >
                          {mutation.isPending ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>

                        <button
                          onClick={handleCancelClick}
                          className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(student)}
                        className="px-3 py-1.5 border border-indigo-300 text-indigo-700 rounded-md hover:bg-indigo-50 transition text-sm"
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
