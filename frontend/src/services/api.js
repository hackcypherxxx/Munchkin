import axios from "axios";

const PROD_API_URL = "https://munchkin-b1zn.onrender.com/api";
const LOCAL_API_URL = "http://localhost:5000/api";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (isLocalhost ? LOCAL_API_URL : PROD_API_URL),
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Automatic fallback if localhost:5000 is not running during static preview
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (
      config &&
      !config._retriedProd &&
      !error.response &&
      config.baseURL === LOCAL_API_URL
    ) {
      config._retriedProd = true;
      config.baseURL = PROD_API_URL;
      return api.request(config);
    }
    return Promise.reject(error);
  }
);

export default api;
