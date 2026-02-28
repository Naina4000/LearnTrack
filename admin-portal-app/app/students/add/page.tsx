"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTeacher } from "@/services/dataService";
import { Loader2, X, CheckCircle2 } from "lucide-react";

/* ================= DATA MAPS ================= */

// Note: I've added string keys "1", "2" alongside numbers to be 100% safe.
const SUBJECT_STRUCTURE: Record<string, any> = {
  CSE: {
    1: ["Physics", "Chemistry", "Engg. Maths"],
    "1": ["Physics", "Chemistry", "Engg. Maths"],
    2: ["Engg. Maths 2", "Basic Electronics", "Data Structures"],
    "2": ["Engg. Maths 2", "Basic Electronics", "Data Structures"],
    3: ["OOPS", "COA", "DSA"],
    "3": ["OOPS", "COA", "DSA"],
    4: ["DAA", "DBMS", "TOC"],
    "4": ["DAA", "DBMS", "TOC"],
    5: ["CN", "AI", "WEB Tech"],
    "5": ["CN", "AI", "WEB Tech"],
    6: ["ML", "Crypto", "Data Mining", "Minor Project"],
    "6": ["ML", "Crypto", "Data Mining", "Minor Project"],
    7: ["Cloud Computing", "Java", "IOT", "Major Project"],
    "7": ["Cloud Computing", "Java", "IOT", "Major Project"],
    8: ["Major Project", "Ethics", "Internship"],
    "8": ["Major Project", "Ethics", "Internship"],
  },
  Civil: {
    1: ["Physics", "Chemistry", "Engg. Maths"],
    "1": ["Physics", "Chemistry", "Engg. Maths"],
    2: ["Engg. Maths 2", "Basic Electronics", "Graphics"],
    "2": ["Engg. Maths 2", "Basic Electronics", "Graphics"],
    3: ["Building materials", "Strength of materials", "Maths"],
    "3": ["Building materials", "Strength of materials", "Maths"],
    4: ["Hydrology", "EVS", "Structure Analysis 1"],
    "4": ["Hydrology", "EVS", "Structure Analysis 1"],
    5: ["Transportation Engg.", "Reinforced", "Structure Analysis 2"],
    "5": ["Transportation Engg.", "Reinforced", "Structure Analysis 2"],
    6: ["Steel Structures", "Soil Erosion", "Minor Project"],
    "6": ["Steel Structures", "Soil Erosion", "Minor Project"],
    7: ["EarthQuake Engg.", "Bridge Engg.", "Major Project"],
    "7": ["EarthQuake Engg.", "Bridge Engg.", "Major Project"],
    8: ["Major Project", "Internship"],
    "8": ["Major Project", "Internship"],
  },
  Electronics: {
    1: ["Physics", "Chemistry", "Engg. Maths"],
    "1": ["Physics", "Chemistry", "Engg. Maths"],
    2: ["Engg. Maths 2", "Basic Electronics", "System design"],
    "2": ["Engg. Maths 2", "Basic Electronics", "System design"],
    3: ["Network Analysis", "Digital Electronics", "Signal Sys."],
    "3": ["Network Analysis", "Digital Electronics", "Signal Sys."],
    4: ["Analog Circuit", "Microprocessor"],
    "4": ["Analog Circuit", "Microprocessor"],
    5: ["Analog Communication", "Digital signals", "VLSI Design"],
    "5": ["Analog Communication", "Digital signals", "VLSI Design"],
    6: [
      "Digital communication",
      "Embedded Sys.",
      "Microwave Engg.",
      "Minor Project",
    ],
    "6": [
      "Digital communication",
      "Embedded Sys.",
      "Microwave Engg.",
      "Minor Project",
    ],
    7: ["Optic fiber", "Wireless Communication", "Robotics", "Major Project"],
    "7": ["Optic fiber", "Wireless Communication", "Robotics", "Major Project"],
    8: ["Major Project", "Internship", "IOT"],
    "8": ["Major Project", "Internship", "IOT"],
  },
};

const BATCHES: Record<string, string[]> = {
  CSE: ["CS-1", "CS-2", "CS-3"],
  Civil: ["CV-1", "CV-2", "CV-3"],
  Electronics: ["EC-1", "EC-2", "EC-3"],
};

export default function AddTeacherPage() {
  const queryClient = useQueryClient();

  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
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

  /* ================= THE "FAIL-SAFE" EFFECT ================= */

  useEffect(() => {
    // Log for you to see in F12 Console
    console.log("Current Dept:", form.department);
    console.log("Current Allocations:", allocations);

    if (!form.department || allocations.length === 0) {
      setAvailableSubjects([]);
      return;
    }

    const newSubjectSet = new Set<string>();
    const deptData = SUBJECT_STRUCTURE[form.department];

    if (deptData) {
      allocations.forEach((alloc) => {
        // Force conversion to both string and number to find the match
        const sKey = String(alloc.semester).trim();
        const nKey = Number(sKey);

        const subjects = deptData[sKey] || deptData[nKey];

        if (subjects && Array.isArray(subjects)) {
          subjects.forEach((s) => newSubjectSet.add(s));
        }
      });
    }

    const sortedList = Array.from(newSubjectSet).sort();
    console.log("Calculated Subject List:", sortedList);
    setAvailableSubjects(sortedList);
  }, [allocations, form.department]);

  /* ================= HELPERS ================= */

  const addAllocation = (batch: string, sem: string) => {
    setAllocations((prev) => {
      const exists = prev.some((a) => a.batch === batch && a.semester === sem);
      if (exists) return prev;
      return [...prev, { batch, semester: sem }];
    });
  };

  const removeAllocation = (batch: string, sem: string) => {
    setAllocations((prev) =>
      prev.filter((a) => !(a.batch === batch && a.semester === sem)),
    );
  };

  const toggleSubject = (sub: string) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(sub)
        ? prev.subjects.filter((s) => s !== sub)
        : [...prev.subjects, sub],
    }));
  };

  const mutation = useMutation({
    mutationFn: addTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherProfiles"] });
      alert("Teacher Assigned!");
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

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-white shadow-xl rounded-2xl mt-10">
      <h1 className="text-3xl font-bold text-indigo-700">
        Assign Teacher Subjects
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="p-3 border rounded-xl"
          placeholder="Teacher Name"
          value={form.teacherName}
          onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
        />
        <input
          className="p-3 border rounded-xl"
          placeholder="Employee ID"
          value={form.employeeId}
          onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
        />

        <select
          className="p-3 border rounded-xl bg-white"
          value={form.department}
          onChange={(e) => {
            setForm({ ...form, department: e.target.value, subjects: [] });
            setAllocations([]);
          }}
        >
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="Civil">Civil</option>
          <option value="Electronics">Electronics</option>
        </select>
      </div>

      {form.department && (
        <div className="space-y-4 border-t pt-4">
          <h2 className="font-bold text-gray-600">Assign Classes</h2>
          {BATCHES[form.department]?.map((batch) => (
            <div
              key={batch}
              className="flex flex-col md:flex-row md:items-center gap-4 p-3 bg-gray-50 rounded-xl"
            >
              <span className="font-bold text-indigo-600 w-20">{batch}</span>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => addAllocation(batch, String(sem))}
                    className="px-4 py-1.5 bg-white border rounded-lg text-sm font-medium hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    Sem {sem}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Chips */}
      <div className="flex flex-wrap gap-2">
        {allocations.map((a, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md"
          >
            {a.batch} Sem {a.semester}
            <X
              size={14}
              className="cursor-pointer hover:text-red-300"
              onClick={() => removeAllocation(a.batch, a.semester)}
            />
          </div>
        ))}
      </div>

      {/* Subject Selector */}
      {availableSubjects.length > 0 && (
        <div className="border-t pt-6">
          <h2 className="font-bold text-gray-800 mb-4">
            Select Subjects ({availableSubjects.length} found)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {availableSubjects.map((sub) => (
              <div
                key={sub}
                onClick={() => toggleSubject(sub)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                  form.subjects.includes(sub)
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-100 bg-white"
                }`}
              >
                <span className="text-sm font-semibold">{sub}</span>
                {form.subjects.includes(sub) && (
                  <CheckCircle2 size={18} className="text-indigo-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => mutation.mutate({ ...form, allocations })}
        disabled={
          mutation.isPending || !form.department || form.subjects.length === 0
        }
        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg disabled:bg-gray-300 transition-all active:scale-[0.98]"
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          "Finalize Teacher Assignment"
        )}
      </button>
    </div>
  );
}
