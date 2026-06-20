import axios from "axios";

// Buat instance dengan konfigurasi dasar
const api = axios.create({
  baseURL: "http://localhost:8000/api", // URL endpoint Laravel Anda
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Interceptor: Otomatis menyisipkan Token di setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
