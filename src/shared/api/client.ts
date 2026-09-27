import axios from "axios";

export const USE_MOCK_API =
  (import.meta.env.VITE_USE_MOCK_API ?? "true") === "true";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("demo_auth");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Simulates network latency in mock mode. */
export function delay<T>(data: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
