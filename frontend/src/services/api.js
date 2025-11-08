import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Log API URL for debugging
console.log("API URL configured as:", API_URL);
console.log("Backend base URL:", API_URL.replace("/api", ""));

// Test backend connection on module load (only in development)
if (import.meta.env.DEV) {
  fetch(API_URL.replace("/api", ""))
    .then((res) => res.json())
    .then((data) => console.log("✅ Backend health check:", data))
    .catch((err) => {
      console.error(
        "❌ Backend not reachable. Make sure it's running on port 5000"
      );
      console.error("Error:", err.message);
    });
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const message =
        error.response.data?.message ||
        error.response.data?.error?.message ||
        error.response.statusText ||
        "An error occurred";
      // Don't log 401 errors for auth/me endpoint (expected when not logged in)
      const isAuthCheck = error.config?.url?.includes("/auth/me");
      if (!(isAuthCheck && error.response.status === 401)) {
        console.error("API Error Response:", {
          status: error.response.status,
          data: error.response.data,
          message,
        });
      }
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error - No response received:", {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        message: error.message,
      });
      return Promise.reject(
        new Error(
          `Network error. Please check if the backend is running at ${API_URL.replace(
            "/api",
            ""
          )}`
        )
      );
    } else {
      // Something else happened
      console.error("Request setup error:", error.message);
      return Promise.reject(
        new Error(error.message || "An unexpected error occurred")
      );
    }
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};

// Posts API
export const postsAPI = {
  getPosts: (params) => api.get("/posts", { params }),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post("/posts", data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getUpcoming: (limit = 5) =>
    api.get("/dashboard/upcoming", { params: { limit } }),
};

export default api;
