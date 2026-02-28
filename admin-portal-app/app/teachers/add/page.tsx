"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTeacher } from "@/services/dataService";
import { Loader2 } from "lucide-react";

/* ================= SAFE NORMALIZERS ================= */

const normalizeDept = (d?: string) => (d || "").trim().toUpperCase();
const normalizeSem = (s?: string) => String(s || "").replace(/\D/g, "");

/* ================= SUBJECT MAP ================= */

const SUBJECT_STRUCTURE: Record<string, Record<string, string[]>> = {
  CSE: {
    "3": ["OOPS", "COA", "DSA"],
    "4": ["DAA", "DBMS", "TOC"],
    "5": ["CN", "AI", "WEB Tech"],
  },
  CIVIL: {
    "3": ["Surveying", "Fluid Mechanics"],
    "4": ["Geotechnical", "Transportation"],
  },
  ELECTRONICS: {
    "3": ["Digital Logic", "Signals"],
    "4": ["Microprocessor", "Control Systems"],
  },
};

const BATCHES: Record<string, string[]> = {
  CSE: ["CS-1", "CS-2", "CS-3"],
  CIVIL: ["CV-1", "CV-2", "CV-3"],
  ELECTRONICS: ["EC-1", "EC-2", "EC-3"],
};

export default function AddTeacherPage() {
  const queryClient = useQueryClient();

  const [allocations, setAllocations] = useState<
    { batch: string; semester: string }[]
  >([]);

  const [form, setForm] = useState({
    teacherName: "",
    employeeId: "",
    email: "",
    dateOfJoining: "",
    department: "",
    subjects: [] as string[],
  });

  /* ================= COMPUTE SUBJECTS ================= */

  const availableSubjects = useMemo(() => {
    const dept = normalizeDept(form.department);
    if (!dept || allocations.length === 0) return [];

    const subjectSet = new Set<string>();

    allocations.forEach((a) => {
      const sem = normalizeSem(a.semester);
      SUBJECT_STRUCTURE[dept]?.[sem]?.forEach((s) => subjectSet.add(s));
    });

    return Array.from(subjectSet).sort();
  }, [allocations, form.department]);

  /* remove selected subjects if allocation changed */
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => availableSubjects.includes(s)),
    }));
  }, [availableSubjects]);

  /* ================= CLASS HANDLERS ================= */

  const addAllocation = (batch: string, semester: string) => {
    const sem = normalizeSem(semester);

    if (!form.department) {
      alert("Select department first");
      return;
    }

    if (
      allocations.some(
        (a) => a.batch === batch && normalizeSem(a.semester) === sem,
      )
    )
      return;

    setAllocations([...allocations, { batch, semester: sem }]);
  };

  const removeAllocation = (batch: string, semester: string) => {
    setAllocations(
      allocations.filter(
        (a) =>
          !(
            a.batch === batch &&
            normalizeSem(a.semester) === normalizeSem(semester)
          ),
      ),
    );
  };

  /* ================= SUBJECT SELECT ================= */

  const toggleSubject = (subject: string) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  /* ================= SAVE ================= */

  const mutation = useMutation({
    mutationFn: addTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherProfiles"] });

      alert("Teacher Assigned Successfully 🎉");

      setForm({
        teacherName: "",
        employeeId: "",
        email: "",
        dateOfJoining: "",
        department: "",
        subjects: [],
      });
      setAllocations([]);
    },
  });

  const submit = () => {
    if (!form.teacherName || !form.department || allocations.length === 0)
      return alert("Fill all required fields");

    if (form.subjects.length === 0) return alert("Select at least one subject");

    mutation.mutate({
      ...form,
      allocations,
    });
  };

  /* ================= UI ================= */

  const dept = normalizeDept(form.department);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        Assign Teacher Subjects
      </h1>

      {/* BASIC INFO */}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          placeholder="Teacher Name"
          className="input"
          onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
        />

        <input
          placeholder="Employee ID"
          className="input"
          onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
        />

        <input
          placeholder="Email"
          className="input"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="date"
          className="input"
          onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })}
        />

        <select
          className="input"
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        >
          <option value="">Department</option>
          <option>CSE</option>
          <option>Civil</option>
          <option>Electronics</option>
        </select>
      </div>

      {/* CLASS SELECTION */}
      {dept && (
        <div className="mt-6 border-t pt-4">
          <h2 className="font-semibold mb-3">Assign Classes</h2>

          {BATCHES[dept]?.map((batch) => (
            <div key={batch} className="mb-3">
              <div className="font-medium">{batch}</div>

              <div className="flex gap-2 mt-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => addAllocation(batch, String(sem))}
                    className="px-3 py-1 bg-gray-100 rounded hover:bg-indigo-100"
                  >
                    Sem {sem}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2 mt-4">
            {allocations.map((a) => (
              <div
                key={a.batch + a.semester}
                onClick={() => removeAllocation(a.batch, a.semester)}
                className="bg-indigo-100 px-3 py-1 rounded cursor-pointer"
              >
                {a.batch} Sem {a.semester} ✕
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBJECTS */}
      {availableSubjects.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h2 className="font-semibold mb-3">Select Subjects</h2>

          <div className="flex flex-wrap gap-3">
            {availableSubjects.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => toggleSubject(sub)}
                className={`px-4 py-2 rounded-lg border ${
                  form.subjects.includes(sub)
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-gray-100 hover:bg-indigo-100"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={submit}
        className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          "Assign Teacher"
        )}
      </button>
    </div>
  );
}
