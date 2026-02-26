"use client";

import { useState, ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTeacher } from "@/services/dataService";
import { Loader2, UserCheck } from "lucide-react";

type TeacherForm = {
  teacherName: string;
  employeeId: string;
  department: string;
  email: string;
  dateOfJoining: string;
};

export default function AddTeacherPage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<TeacherForm>({
    teacherName: "",
    employeeId: "",
    department: "",
    email: "",
    dateOfJoining: "",
  });

  /* ================= MUTATION ================= */

  const mutation = useMutation({
    mutationFn: addTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherProfiles"] });
      alert("Teacher successfully added 🎉");

      setForm({
        teacherName: "",
        employeeId: "",
        department: "",
        email: "",
        dateOfJoining: "",
      });
    },
  });

  /* ================= HANDLERS ================= */

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = () => {
    if (!form.teacherName || !form.employeeId) {
      alert("Please fill required fields");
      return;
    }

    mutation.mutate(form);
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="p-3 bg-indigo-100 rounded-xl mr-4">
          <UserCheck className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">
            Register New Teacher
          </h1>
          <p className="text-sm text-gray-700">
            Enter faculty employment and department details
          </p>
        </div>
      </div>

      {/* Teacher Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Teacher Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              name="teacherName"
              value={form.teacherName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              placeholder="Enter employee ID"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="CSE, ECE, Civil..."
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@university.edu"
              className="input"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Joining
            </label>
            <input
              name="dateOfJoining"
              type="date"
              value={form.dateOfJoining}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
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
            Saving Teacher...
          </>
        ) : (
          "Save Teacher Record"
        )}
      </button>
    </div>
  );
}
