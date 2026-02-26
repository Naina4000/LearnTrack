"use client";

import Link from "next/link";
import { Home, Users, BookOpen, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Student Overview", href: "/students", icon: Users },
  { name: "Add Students", href: "/students/add", icon: Users },
  { name: "Teacher Directory", href: "/teachers", icon: BookOpen },
  { name: "Add Teachers", href: "/teachers/add", icon: BookOpen },
];

function NavigationBar() {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-indigo-700">
          JUIT Admin Portal
        </h1>

        <div className="flex items-center space-x-4">
          <nav className="flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 p-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={logout}
            className="flex items-center space-x-1 p-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default function ClientLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!isLoginPage && <NavigationBar />}

      <main
        className={`flex-grow w-full ${
          !isLoginPage ? "max-w-7xl mx-auto p-6" : ""
        }`}
      >
        {children}
      </main>

      {!isLoginPage && (
        <footer className="w-full p-4 bg-white border-t text-center text-xs text-gray-500">
          © {new Date().getFullYear()} JUIT Administration. Powered by Next.js &
          Dart Microservices.
        </footer>
      )}
    </div>
  );
}
