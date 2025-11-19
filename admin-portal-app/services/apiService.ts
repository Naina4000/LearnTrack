// services/apiService.ts
import axios from "axios";

// NOTE: Ensure these environment variables are set in your .env.local file
const STUDENT_API_URL =
  process.env.NEXT_PUBLIC_STUDENT_API_URL || "http://localhost:3001/api";
const TEACHER_API_URL =
  process.env.NEXT_PUBLIC_TEACHER_API_URL || "http://localhost:3002/api";

const getAuthToken = () => {
  // Implement logic to get the stored JWT/Session Token
  return localStorage.getItem("adminAuthToken");
};

const setupInterceptor = (api: any) => {
  api.interceptors.request.use((config: any) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return api;
};

// 1. Client for the Student Portal API
export const studentApi = setupInterceptor(
  axios.create({ baseURL: STUDENT_API_URL })
);

// 2. Client for the Teacher Portal API
export const teacherApi = setupInterceptor(
  axios.create({ baseURL: TEACHER_API_URL })
);
