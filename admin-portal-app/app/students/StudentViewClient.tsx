"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllStudentData,
  updateStudentAttendance,
} from "@/services/dataService";
import { StudentPortalData, StudentSubject } from "@/types/data";
import { Loader2, Users, Pencil, Check, X, Search } from "lucide-react";

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

  const handleEditClick = (student: StudentPortalData) => {
    setEditingId(student.id);
    // Deep clone to avoid mutating original query data
    setEditedSubjects(JSON.parse(JSON.stringify(student.subjects)));
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditedSubjects([]);
  };

  const handleSaveClick = () => {
    if (editingId) {
      mutation.mutate({ id: editingId, subjects: editedSubjects });
    }
  };

  const handleAttendanceChange = (index: number, value: string) => {
    const val = Math.min(100, Math.max(0, Number(value)));
    setEditedSubjects((prev) =>
      prev.map((sub, i) =>
        i === index ? { ...sub, attendancePercentage: val } : sub,
      ),
    );
  };

  /* ---------- Filter (Optimized with useMemo) ---------- */

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
        <p className="font-bold">API Error (Student Portal):</p>
        <p>{(error as Error).message}</p>
      </div>
    );

  /* ===================== UI ===================== */

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-indigo-700 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Student Portal Data Overview
        </h1>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search by Enrollment No or Name..."
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
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                S.No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                Enrollment No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                Branch
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                Batch / Sem
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase min-w-[260px]">
                Subjects & Attendance (%)
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              filteredData.map((student) => {
                const isEditing = editingId === student.id;

                return (
                  <tr
                    key={student.id}
                    className={isEditing ? "bg-indigo-50" : "hover:bg-gray-50"}
                  >
                    <td className="px-4 py-4 text-gray-500">
                      {student.serialNumber}
                    </td>

                    <td className="px-4 py-4 font-medium text-gray-900">
                      {student.name}
                    </td>

                    <td className="px-4 py-4 font-mono text-sm font-bold text-gray-600">
                      {student.enrollmentNo}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {student.branch}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {student.batchNo} / {student.currentSemester}
                    </td>

                    {/* SUBJECTS */}
                    <td className="px-4 py-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          {editedSubjects.map((sub, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center border rounded p-2"
                            >
                              <span className="text-xs font-semibold text-gray-700">
                                {sub.name}
                              </span>
                              <input
                                type="number"
                                className="w-16 text-sm border rounded p-1 text-right"
                                value={sub.attendancePercentage}
                                onChange={(e) =>
                                  handleAttendanceChange(i, e.target.value)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {student.subjects.map((sub, i) => (
                            <span
                              key={i}
                              className={`px-2 py-1 text-xs font-semibold rounded border
                                ${
                                  sub.attendancePercentage < 75
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-green-50 text-green-700 border-green-200"
                                }`}
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
                            disabled={mutation.isPending}
                            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                          >
                            {mutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(student)}
                          className="px-3 py-1.5 border border-indigo-200 text-indigo-700 rounded hover:bg-indigo-50 text-sm font-medium"
                        >
                          <Pencil className="inline w-3 h-3 mr-1" />
                          Edit
                        </button>
                      )}
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
