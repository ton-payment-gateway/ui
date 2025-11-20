import type { IApiResponse } from "./types";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest.headers._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest.headers._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await api.post<
          IApiResponse<{ accessToken: string; refreshToken: string }>
        >("/auth/refresh", null, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            _retry: true,
          },
        });

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
