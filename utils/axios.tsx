import axios from "axios";

interface QueueItem {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
}

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.data?.message === "TokenExpired" &&
            !originalRequest._retry
        ) {
            if (originalRequest.url.includes("/auth/refresh-token")) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({
                        resolve,
                        reject
                    });
                })
                    .then(() => {
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post("/auth/refreshtoken");

                processQueue(null, "success");

                return api(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);

                console.error("Session expired completely. Please login again.");
                if (typeof window !== "undefined") {
                    window.location.href = "/auth/login";
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
