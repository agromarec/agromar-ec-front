import { globalVariables } from "@/config/globalVariables";
import axios from "axios";

export const AgroMarApi = axios.create({
  // baseURL: "http://localhost:3001/api",
  baseURL: globalVariables.apiUrl,
});

AgroMarApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

