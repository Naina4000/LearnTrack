"use client";

import { useState, ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStudent } from "@/services/dataService";
import { StudentSubject } from "@/types/data";
import { Loader2, PlusCircle, Trash2, User } from "lucide-react";

type StudentForm = {
  name: string;
  enrollmentNo: string;
  branch: string;
  currentSemester: string;
  subjects: StudentSubject[];
};

export default function AddStudentPage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<StudentForm>({
    name: "",
    enrollmentNo: "",
    branch: "",
    currentSemester: "",
    subjects: [{ name: "", attendancePercentage: 0 }],
  });

  const mutation = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allStudents"] });
      alert("Student successfully added 🎉");

      setForm({
        name: "",
        enrollmentNo: "",
        branch: "",
        currentSemester: "",
        subjects: [{ name: "", attendancePercentage: 0 }],
      });
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubjectChange = (
    index: number,
    field: keyof StudentSubject,
    value: string | number,
  ) => {
    setForm((prev) => {
      const updated = [...prev.subjects];
      updated[index] = {
        ...updated[index],
        [field]:
          field === "attendancePercentage" ? Number(value) : String(value),
      };
      return { ...prev, subjects: updated };
    });
  };

  const addSubjectField = () =>
    setForm((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { name: "", attendancePercentage: 0 }],
    }));

  const removeSubject = (index: number) =>
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));

  const submit = () => {
    if (!form.name || !form.enrollmentNo) {
      alert("Please fill required fields");
      return;
    }
    mutation.mutate(form);
  };

  const getAttendanceColor = (value: number) => {
    if (value < 60) return "border-red-300 bg-red-50";
    if (value < 75) return "border-yellow-300 bg-yellow-50";
    return "border-green-300 bg-green-50";
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="p-3 bg-indigo-100 rounded-xl mr-4">
          <User className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">
            Register New Student
          </h1>
          <p className="text-sm text-gray-700">
            Fill student academic and attendance details
          </p>
        </div>
      </div>

      {/* Student Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Student Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="input"
          />
          <input
            name="enrollmentNo"
            value={form.enrollmentNo}
            onChange={handleChange}
            placeholder="Roll Number"
            className="input"
          />
          <input
            name="branch"
            value={form.branch}
            onChange={handleChange}
            placeholder="Branch (CSE, IT...)"
            className="input"
          />
          <input
            name="currentSemester"
            value={form.currentSemester}
            onChange={handleChange}
            placeholder="Semester (e.g. 5)"
            className="input"
          />
        </div>
      </div>

      {/* Subjects */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Subjects & Attendance
        </h2>

        {form.subjects.map((sub, i) => (
          <div
            key={i}
            className="flex items-center gap-4 mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
          >
            {/* Subject Name - Wider */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name
              </label>
              <input
                value={sub.name}
                placeholder="Enter subject name"
                onChange={(e) => handleSubjectChange(i, "name", e.target.value)}
                className="input"
              />
            </div>

            {/* Attendance - Smaller */}
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attendance %
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={sub.attendancePercentage}
                  onChange={(e) =>
                    handleSubjectChange(
                      i,
                      "attendancePercentage",
                      e.target.value,
                    )
                  }
                  className="input pr-8 text-center"
                />
                <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                  %
                </span>
              </div>
            </div>

            {/* Delete */}
            {form.subjects.length > 1 && (
              <button
                onClick={() => removeSubject(i)}
                className="mt-6 text-red-600 hover:text-red-800 transition"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addSubjectField}
          className="flex items-center gap-2 mt-5 text-indigo-700 font-medium hover:text-indigo-900"
        >
          <PlusCircle size={18} />
          Add Another Subject
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        disabled={mutation.isPending}
        className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center transition"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            Saving Student...
          </>
        ) : (
          "Save Student Record"
        )}
      </button>
    </div>
  );
}
