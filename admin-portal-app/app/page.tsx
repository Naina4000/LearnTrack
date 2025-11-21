"use client";

import Link from "next/link";
import { Users, BookOpen, GraduationCap } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <div className="bg-indigo-100 p-4 rounded-full inline-flex mb-4">
          <GraduationCap className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          JUIT Admin Dashboard
        </h1>
        <p className="text-xl text-gray-600">Select a portal to manage</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* Student Portal Option */}
        <Link
          href="/students"
          className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-500 flex flex-col items-center text-center"
        >
          <div className="bg-blue-50 p-6 rounded-full mb-6 group-hover:bg-blue-100 transition-colors">
            <Users className="w-16 h-16 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-700">
            Student Portal
          </h2>
          <p className="text-gray-500">
            View attendance, manage enrollments, and track student performance
            metrics.
          </p>
          <span className="mt-6 text-blue-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
            Access Portal &rarr;
          </span>
        </Link>

        {/* Teacher Portal Option */}
        <Link
          href="/teachers"
          className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-500 flex flex-col items-center text-center"
        >
          <div className="bg-purple-50 p-6 rounded-full mb-6 group-hover:bg-purple-100 transition-colors">
            <BookOpen className="w-16 h-16 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-700">
            Teacher Portal
          </h2>
          <p className="text-gray-500">
            Manage faculty profiles, track joining dates, and view teaching
            tenures.
          </p>
          <span className="mt-6 text-purple-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
            Access Portal &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
}
