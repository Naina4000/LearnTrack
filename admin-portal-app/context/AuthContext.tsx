"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem("isAdminLoggedIn");
      const isAuth = storedAuth === "true";

      setIsAuthenticated(isAuth);
      setIsLoading(false); // Auth check is done

      // Redirect Logic
      if (isAuth) {
        // If logged in and on login page, go to dashboard
        if (pathname === "/login") {
          router.push("/");
        }
      } else {
        // If NOT logged in and NOT on login page, force login
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  const login = () => {
    localStorage.setItem("isAdminLoggedIn", "true");
    setIsAuthenticated(true);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    setIsAuthenticated(false);
    router.push("/login");
  };

  // Prevent the app from rendering unprotected content while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If not authenticated and trying to access a protected page, don't render children
  // (The useEffect above will handle the redirect)
  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
