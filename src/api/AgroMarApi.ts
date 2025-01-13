import axios from "axios";

export const AgroMarApi = axios.create({
  // baseURL: "http://localhost:3001/api",
  baseURL: "https://agromar-ec.vercel.app/api",
});

AgroMarApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

