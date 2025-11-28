"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllStudentData,
  updateStudentAttendance,
} from "@/services/dataService";
import { StudentPortalData, StudentSubject } from "@/types/data";
import { Loader2, Users, Pencil, Check, X, Save, Search } from "lucide-react";
import React, { useState } from "react";

const LoadingState = () => (
  <div className="flex justify-center items-center h-64 text-indigo-500">
    <Loader2 className="w-8 h-8 animate-spin mr-3" />
    <span className="text-lg font-semibold">Fetching Student Data...</span>
  </div>
);

export default function StudentViewClient() {
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedSubjects, setEditedSubjects] = useState<StudentSubject[]>([]);
  // NEW: Search state
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
      alert("Attendance updated successfully (Mock)!");
      setEditingId(null);
    },
  });

  const handleEditClick = (student: StudentPortalData) => {
    setEditingId(student.id);
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

  const handleAttendanceChange = (index: number, newValue: string) => {
    const updated = [...editedSubjects];
    const val = Math.min(100, Math.max(0, Number(newValue)));
    updated[index].attendancePercentage = val;
    setEditedSubjects(updated);
  };

  // NEW: Filter data based on search term
  const filteredData = data?.filter(
    (student) =>
      student.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) // Also allowing name search for convenience
  );

  if (isLoading) return <LoadingState />;

  if (error)
    return (
      <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">API Error (Student Portal):</p>
        <p>{error.message}</p>
      </div>
    );

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-indigo-700 flex items-center">
          <Users className="w-6 h-6 mr-2" /> Student Portal Data Overview
        </h1>

        {/* Search Bar with Black Text Fix */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            // Added 'text-gray-900' here for dark text
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search by Enrollment No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                S.No.
              </th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Enrollment No.
              </th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Branch
              </th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Batch/Sem
              </th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[250px]">
                Subjects & Attendance (%)
              </th>
              <th className="py-3 px-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData?.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No students found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredData?.map((student) => {
                const isEditing = editingId === student.id;

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isEditing ? "bg-indigo-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-4 px-4 whitespace-nowrap text-gray-500">
                      {student.serialNumber}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-gray-600 font-mono text-sm font-bold">
                      {student.enrollmentNo}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">
                      {student.branch}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">
                      {student.batchNo} / {student.currentSemester}
                    </td>

                    <td className="py-4 px-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          {editedSubjects.map((sub, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between bg-white p-1.5 rounded border border-indigo-200"
                            >
                              <span
                                className="text-xs font-semibold text-gray-700 truncate max-w-[120px]"
                                title={sub.name}
                              >
                                {sub.name}:
                              </span>
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  className="w-14 text-sm p-1 border rounded focus:ring-2 focus:ring-indigo-500 outline-none text-right text-black"
                                  value={sub.attendancePercentage}
                                  onChange={(e) =>
                                    handleAttendanceChange(i, e.target.value)
                                  }
                                />
                                <span className="text-xs text-gray-500 ml-1">
                                  %
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {student.subjects.map((sub, i) => (
                            <div
                              key={i}
                              className={`text-xs px-2 py-1 rounded-md border 
                                    ${
                                      sub.attendancePercentage < 75
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-green-50 text-green-700 border-green-200"
                                    }`}
                            >
                              <span className="font-semibold">{sub.name}:</span>{" "}
                              {sub.attendancePercentage}%
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap align-top pt-6">
                      {isEditing ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={handleSaveClick}
                            disabled={mutation.isPending}
                            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-sm transition"
                            title="Save"
                          >
                            {mutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 shadow-sm transition"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(student)}
                          className="flex items-center justify-center px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-50 transition text-sm font-medium mx-auto shadow-sm"
                        >
                          <Pencil className="w-3 h-3 mr-1.5" /> Edit
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
