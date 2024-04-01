"use client";
import { useAuth } from "@/contexts/auth";
import { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosError, AxiosInstance, AxiosStatic } from "axios";

const customAxios = axios.create();

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
    const { accessToken, refreshAccessToken, logout } = useAuth();

    useEffect(() => {
        const request = customAxios.interceptors.request.use(
            (config) => {
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const response = customAxios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (
                    (error as AxiosError).response?.status === 401 &&
                    !originalRequest._retry
                ) {
                    originalRequest._retry = true;

                    try {
                        const newAccessToken = await refreshAccessToken();
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return customAxios(originalRequest);
                    } catch (refreshError) {
                        if (
                            (refreshError as AxiosError).response?.status ===
                            401
                        ) {
                            logout();
                        }
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            customAxios.interceptors.request.eject(request);
            customAxios.interceptors.response.eject(response);
        };
    }, [accessToken, refreshAccessToken, logout]);

    return children;
};

export default customAxios;
export { AxiosInterceptor as AxiosProvider };
