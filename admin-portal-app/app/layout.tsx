import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // Import the provider
import Link from "next/link";
import { Home, Users, BookOpen } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JUIT Admin Portal",
  description: "Centralized management dashboard for Student and Teacher data.",
};

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Student Overview", href: "/students", icon: Users },
  { name: "Teacher/Attendance View", href: "/teachers", icon: BookOpen },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* WRAPPER: This <Providers> tag fixes the "No QueryClient set" error */}
        <Providers>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white shadow-md p-4 sticky top-0 z-10">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-extrabold text-indigo-700">
                  JUIT Admin Portal
                </h1>
                <nav className="flex space-x-4">
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
              </div>
            </header>
            <main className="flex-grow max-w-7xl mx-auto w-full p-6">
              {children}
            </main>
            <footer className="w-full p-4 bg-white border-t text-center text-xs text-gray-500">
              © {new Date().getFullYear()} JUIT Administration. Powered by
              Next.js & Dart Microservices.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
