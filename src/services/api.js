// services/api.js
import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// attach JWT on every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// existing response‑error interceptor
API.interceptors.response.use(
  response => response,
  error => {
    toast.error(error.response?.data?.message || "An error occurred");
    return Promise.reject(error);
  }
);

export default API;
