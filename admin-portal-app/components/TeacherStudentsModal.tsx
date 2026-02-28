"use client";

import { StudentPortalData, TeacherData } from "@/types/data";

export default function TeacherStudentsModal({
  teacher,
  students,
  onClose,
}: {
  teacher: TeacherData;
  students: StudentPortalData[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Students Under {teacher.teacherName}
        </h2>

        {students.length === 0 ? (
          <p className="text-gray-500">No students mapped</p>
        ) : (
          <div className="space-y-2">
            {students.map((s) => (
              <div
                key={s.id}
                className="p-3 border rounded-lg flex justify-between"
              >
                <span>{s.name}</span>
                <span className="text-sm opacity-70">
                  {s.batch} • Sem {s.currentSemester}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          className="mt-5 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
