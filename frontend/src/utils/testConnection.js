// Utility to test backend connection
export const testBackendConnection = async () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const baseURL = API_URL.replace("/api", "");

  try {
    const response = await fetch(`${baseURL}/`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    console.log("✅ Backend is reachable:", data);
    return true;
  } catch (error) {
    console.error("❌ Backend connection failed:", error);
    console.error("Make sure the backend is running on:", baseURL);
    return false;
  }
};
